import { createHttpTerminator } from 'http-terminator'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export function handleShutdown(app, server) {
  const httpTerminator = createHttpTerminator({ server })

  const shutDown = async () => {
    // Signal to stop handling new requests
    app.isShutDown = true
    // Close database connections
    await prisma.$disconnect()
    // Close pending connections
    await httpTerminator.terminate()
  }

  process.on('SIGINT', shutDown)
  process.on('SIGTERM', shutDown)
  process.on('SIGHUP', shutDown)
}
