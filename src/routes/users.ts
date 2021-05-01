import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

/** Creates a new user */
router.put('/users', async (req, res) => {
  let { user } = req.body

  if (user) {
    let created = await prisma.user.create({
      data: {
        name: user.name,
        providerId: user.uid,
        role: 'user',
        phoneNumber: user.phoneNumber,
      },
    })

    return res.send(created)
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
router.post('/users/:id', async (req, res) => {
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
router.delete('/users/:id', async (req, res) => {
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
