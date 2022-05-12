import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { getPostsFrontmatter } from 'services/PostService'

type GetPostsRequest = NextApiRequest & {
  query: {
    take?: string
    skip?: string
    order?: 'asc' | 'desc'
    orderBy?: string
  }
}

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)
    res.status(500).end('Internal server error')
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found')
  },
}).get<GetPostsRequest>(async (req, res) => {
  const { take, skip, order, orderBy } = req.query
  const posts = await getPostsFrontmatter({
    take: take ? parseInt(take) : undefined,
    skip: skip ? parseInt(skip) : undefined,
    order,
    orderBy,
  })
  res.status(200).json(posts)
})

export default handler
