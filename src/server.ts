import * as os from 'os'
import * as cluster from 'cluster'
import express from 'express'
import routes from './routes'
import { middlewares } from './lib/middlewares'
import { handleShutdown } from './lib/terminator'

export async function start() {
  const app = express()

  // Application settings
  app.set('trust proxy', true)
  app.set('x-powered-by', false)

  middlewares(app)
  routes(app)

  // Start the app in cluster mode
  if (cluster.isMaster) {
    // Fork the app across all available CPUS
    const CPUS = os.cpus()
    CPUS.forEach(() => cluster.fork())
  } else {
    // Start the server process
    const { PORT } = process.env

    const server = app.listen(PORT, () => {
      console.log('Server listening on port', PORT)
    })

    handleShutdown(app, server)
  }
}
