import { Application } from 'express'
import hello from './routes/hello'

function healthChecks(app: Application) {
  // Check for liveliness
  app.get('/live', async (req, res) => {
    if (app.isShutDown) {
      return res.status(500).send('SERVER_IS_SHUTTING_DOWN')
    }
    res.status(200).send('SERVER_IS_NOT_SHUTTING_DOWN')
  })

  // Check for readiness
  app.get('/ready', async (req, res) => {
    if (app.isShutDown) {
      return res.status(500).send('SERVER_IS_NOT_READY')
    }
    res.status(200).send('SERVER_IS_READY')
  })
}

export default function init(app: Application) {
  healthChecks(app)
  app.use(hello)
  // TODO: add your routes below...
}
