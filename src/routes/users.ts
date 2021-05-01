import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { withAuth } from '../lib/firebase'

const prisma = new PrismaClient()
const router = Router()

function gravatarPhoto(email: string = '') {
  let hash = crypto.createHash('md5').update(email).digest('hex')
  return `https://www.gravatar.com/avatar/${hash}?d=mp`
}

/** Creates a new user */
router.put('/users', async (req, res) => {
  let { user } = req.body

  if (user) {
    try {
      let created = await prisma.user.create({
        data: {
          providerId: user.uid,
          name: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL ?? gravatarPhoto(user.email),
          role: 'user',
        },
      })

      return res.send(created)
    } catch (err) {
      return res.status(500).send({ message: err.message })
    }
  }

  return res.status(400).send({ ok: false, message: 'Missing user field' })
})

/** Display user data */
router.get('/users/:id', async (req, res) => {
  let { id } = req.params
  if (id) {
    let user = await prisma.user.findUnique({
      where: { id: Number(id) },
    })
    return res.send(user)
  }
  return res.status(400).send({ ok: false, message: 'Invalid user id' })
})

/** Update user data */
router.post('/users/:id', withAuth, async (req, res) => {
  let { id } = req.params
  let { user } = req.body

  if (id && user) {
    let updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: user,
    })
    return res.send(updatedUser)
  }

  return res
    .status(400)
    .send({ ok: false, message: 'Missing id or user fields' })
})

/** Delete a user */
router.delete('/users/:id', withAuth, async (req, res) => {
  let { id } = req.params

  if (id) {
    let user = await prisma.user.delete({
      where: { id: Number(id) },
    })
    return res.send(user)
  }

  return res
    .status(400)
    .send({ ok: false, message: 'Missing id or user fields' })
})

export default router
