import { createHttpTerminator } from 'http-terminator'

export function handleShutdown(app, server) {
  const httpTerminator = createHttpTerminator({ server })

  const shutDown = async () => {
    app.isShutDown = true
    await httpTerminator.terminate()
  }

  process.on('SIGINT', shutDown)
  process.on('SIGTERM', shutDown)
  process.on('SIGHUP', shutDown)
}
