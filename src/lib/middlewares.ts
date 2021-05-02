import path from 'path'
import cookie from 'cookie'
import pino from 'express-pino-logger'
import express, { Express, Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import hpp from 'hpp'
import compress from 'compression'
import rateLimit from 'express-rate-limit'
import { firebaseAuth } from './firebase'

const { NODE_ENV } = process.env
const IS_PROD = NODE_ENV === 'production'
const IS_DEV = NODE_ENV === 'development'

function getCookies(req: Request, res: Response, next: any) {
  req.cookies = {}
  if (req.headers.cookie) {
    req.cookies = cookie.parse(req.headers.cookie)
  }
  next()
}

export function middlewares(app: Express) {
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

  if (!IS_DEV) {
    // rate limit requests
    app.use(
      rateLimit({
        windowMs: 2 * 60 * 1000, // 1 minute
        max: 250, // 250 req/2min per IP
      })
    )
  }

  // logger
  let pinoConfig = {
    prettyPrint: {
      levelFirst: true,
      colorize: true,
    },
  } as pino.Options

  if (IS_PROD) {
    pinoConfig = {}
  }
  app.use(pino(pinoConfig as pino.Options))

  // serve static files
  app.use(
    '/public',
    express.static(path.join(__dirname, '../../public'), {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
  )

  // cookie parser
  app.use(getCookies)

  // auth by firebase
  app.use(firebaseAuth)
}
