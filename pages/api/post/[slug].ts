import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import nc from 'next-connect'
import { getPostBySlug } from 'services/PostService'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)
    res.status(500).end('Internal server error')
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found')
  },
}).get(async (req, res) => {
  const { slug } = req.query
  if (typeof slug === 'string') {
    const post = await getPostBySlug(slug)
    res.status(201).json(post)
  }
  res.status(400).send('Bad Request')
})

export default handler
