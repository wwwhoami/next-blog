import { Prisma } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { deletePostBySlug, getPostBySlug } from 'services/PostService'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)
    if (
      (err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025') ||
      err.name === 'NotFoundError'
    ) {
      res.status(404).send("Post with given slug parameter doesn't exist")
    } else {
      res.status(500).send('Internal server error')
    }
  },
  onNoMatch: (req, res) => {
    res.status(404).send('Page is not found')
  },
})
  .get(async (req, res) => {
    const { slug } = req.query
    if (typeof slug === 'string') {
      const post = await getPostBySlug(slug)
      res.status(201).json(post)
    }
    res.status(400).send('Bad Request')
  })
  .delete(async (req, res) => {
    const { slug } = req.query
    if (typeof slug === 'string') {
      const post = await deletePostBySlug(slug)
      res.status(201).json(post)
    }
    res.status(400).send('Bad Request')
  })

export default handler
