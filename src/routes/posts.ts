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

async function cursorPagination(req, getResults) {
  let page = { size: 100 }
  if (req.query.page) {
    page = req.query.page
  }

  const { before, after, size } = page

  let query = {
    take: Number(size),
    skip: after ? 1 : 0,
    cursor: undefined,
    orderBy: {
      id: 'asc',
    },
  }
  if (before || after) {
    query.cursor = {
      id: Number(after),
    }
  }
  let data = await getResults(query)

  let last = data[data.length - 1]
  let nextCursor = last?.id
  return {
    links: {
      next: `/api/v1/posts/?page[after]=${nextCursor}&page[size]=${size}`,
      prev: `/api/v1/posts/?page[before]=${nextCursor}&page[size]=${size}`,
    },
    data: data,
  }
}

/** Display post data */
router.get('/posts/:id?', async (req, res) => {
  const { id } = req.params
  if (id) {
    // Fetch post by id
    let post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        author: true,
      },
    })
    res.send(post)
  } else {
    // Fetch all posts
    let results = await cursorPagination(req, (query) => {
      query.where = { published: true }
      query.include = {
        author: true,
      }
      return prisma.post.findMany(query)
    })
    res.send(results)
  }
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
