import { Router } from 'express'

const router = Router()

router.get('/', async (req, res) => {
  res.send({ hello: 'world' })
})

export default router
