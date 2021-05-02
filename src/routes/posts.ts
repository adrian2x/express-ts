import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '../lib/firebase'

const prisma = new PrismaClient()
const router = Router()

/** Creates a new post */
router.put('/posts', withAuth, async (req, res) => {
  let { post } = req.body
  let currentUser = await req.getUser()
  post.authorId = currentUser.id

  if (post) {
    let created = await prisma.post.create({
      data: post,
    })

    return res.send(created)
  }

  return res.status(400).send({ ok: false, message: 'Missing post field' })
})

async function cursorPagination(req, getResults) {
  let { page = { size: 100 }, sort = ['createdAt'] } = req.query
  const { before, after, size } = page
  if (!Array.isArray(sort)) sort = [sort]

  let query = {
    take: Number(size),
    skip: after ? 1 : 0,
    orderBy: sort.map((field: string) => {
      let desc = field.startsWith('-')
      if (desc) field = field.substr(1)
      return { [field]: desc ? 'desc' : 'asc' }
    }),
  }

  if (after) {
    query.cursor = {
      id: Number(after),
    }
  }

  let nextCursor
  let data = await getResults(query)
  if (data && data.length) {
    let last = data[data.length - 1]
    nextCursor = last?.id
  }
  return {
    links: {
      next:
        nextCursor &&
        `/api/v1/posts/?page[after]=${nextCursor}&page[size]=${size}`,
      prev: `/api/v1/posts/?page[before]=${nextCursor}&page[size]=${size}`,
    },
    data,
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
  try {
    let {
      params: { id },
      body: { post },
    } = req

    let currentUser = await req.getUser()
    // Make sure user is owner of the post
    if (currentUser?.id !== post.authorId) {
      return res.status(401).send({ error: 'Unauthorized to edit this post!' })
    }

    if (post && id) {
      let updatedPost = await prisma.post.update({
        where: { id: Number(id) },
        data: post,
      })
      return res.send(updatedPost)
    }

    return res.status(400).send({ error: 'Missing id or body post fields' })
  } catch (error) {
    return res.status(500).send({ error })
  }
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
