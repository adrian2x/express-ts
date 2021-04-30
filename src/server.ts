import * as os from 'os'
import * as cluster from 'cluster'
import express from 'express'
import routes from './routes'
import { middlewares } from './lib/middlewares'
import { handleShutdown } from './lib/terminator'

const { PORT, DEBUG } = process.env

export async function start() {
  let app = express()

  // Application settings
  app.set('trust proxy', true)
  app.set('x-powered-by', false)

  // Setup middlewares
  middlewares(app)

  // Route handlers
  routes(app)

  function listen(app) {
    // Start the server process
    let server = app.listen(Number(PORT), '0.0.0.0', () => {
      console.log('Server listening on port', PORT)
    })
    handleShutdown(app, server)
  }

  if (cluster.isMaster && !DEBUG) {
    // Fork the app across available cpus
    let CPUS = os.cpus()
    CPUS.forEach(() => cluster.fork())
  } else {
    listen(app)
  }
}
