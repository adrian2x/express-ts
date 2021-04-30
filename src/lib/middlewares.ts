import path from 'path'
import express from 'express'
import compress from 'compression'
import helmet from 'helmet'
import hpp from 'hpp'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import pino from 'express-pino-logger'

export function middlewares(app: express.Application) {
  let { NODE_ENV } = process.env
  // Set security headers
  app.use(helmet({}))
  app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'unsafe-inline'"],
        scriptSrc: ["'unsafe-inline'", "'self'"],
      },
    })
  )

  // gzip compression
  app.use(compress())

  // parse json request body
  app.use(express.json())

  // security
  app.use(hpp())

  // enable cors
  app.use(cors())
  app.options('*', cors())

  if (NODE_ENV === 'production') {
    // rate limit requests
    app.use(
      rateLimit({
        windowMs: 2 * 60 * 1000, // 1 minute
        max: 250, // 250 req/2min per IP
      })
    )
  }

  // logger
  app.use(
    pino({
      prettyPrint: {
        levelFirst: true,
        colorize: true,
      },
    })
  )

  // serve static files
  app.use(
    '/public',
    express.static(path.join(__dirname, '../../public'), {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
  )
}
