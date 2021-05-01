import { Application } from 'express'
import users from './routes/users'
import posts from './routes/posts'

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
  app.use(users)
  app.use(posts)
  // TODO: add your routes below...
}
