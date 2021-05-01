import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../lib/firebase'

const prisma = new PrismaClient()
const router = Router()

/** Creates a new post */
router.put('/posts', withAuth, async (req, res) => {
  let { post } = req.body

  if (!post.authorId) {
    return res
      .status(400)
      .send({ ok: false, message: 'Missing post.authorId field' })
  }

  if (post) {
    let created = await prisma.post.create({
      data: post,
    })

    return res.send(created)
  }

  return res.status(400).send({ ok: false, message: 'Missing post field' })
})

/** Display post data */
router.get('/posts/:id', withAuth, async (req, res) => {
  let { id } = req.params
  if (id) {
    let post = await prisma.post.findUnique({
      where: { id: Number(id) },
    })
    return res.send(post)
  }
  return res.status(400).send({ ok: false, message: 'Invalid post id' })
})

/** Update post data */
router.post('/posts/:id', withAuth, async (req, res) => {
  let { id } = req.params
  let { post } = req.body

  if (id && post) {
    let updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: post,
    })
    return res.send(updatedPost)
  }

  return res
    .status(400)
    .send({ ok: false, message: 'Missing id or post fields' })
})

/** Delete a post */
router.delete('/posts/:id', withAuth, async (req, res) => {
  let { id } = req.params

  if (id) {
    let post = await prisma.post.delete({
      where: { id: Number(id) },
    })
    return res.send(post)
  }

  return res
    .status(400)
    .send({ ok: false, message: 'Missing id or post fields' })
})

export default router
