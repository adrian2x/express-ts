import path from 'path'
import express from 'express'
import compress from 'compression'
import helmet from 'helmet'
import hpp from 'hpp'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import pino from 'express-pino-logger'

export function middlewares(app: express.Application) {
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

  // parse urlencoded request body
  app.use(express.urlencoded({ extended: true }))

  // security
  app.use(hpp())

  // parse cookies
  app.use(cookieParser())

  // enable cors
  app.use(cors())
  app.options('*', cors())

  // rate limit requests
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 2, // 2 qps per IP
    })
  )

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
      maxAge: 31557600000,
    })
  )
}
