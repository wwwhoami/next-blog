import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { getPosts } from 'services/PostService'

type GetPostsRequest = NextApiRequest & {
  query: {
    take?: string
    skip?: string
    order?: 'asc' | 'desc'
    orderBy?: string
    content?: string
  }
}

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)
    res.status(500).json('Internal server error')
  },
  onNoMatch: (req, res) => {
    res.status(404).send('Page is not found')
  },
}).get<GetPostsRequest>(async (req, res) => {
  const { take, skip, order, orderBy, content } = req.query
  const posts = await getPosts(
    take ? parseInt(take) : undefined,
    skip ? parseInt(skip) : undefined,
    order,
    orderBy,
    content === 'true' || content === '1'
  )
  res.status(200).json(posts)
})

export default handler
