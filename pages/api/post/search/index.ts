import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { getPosts, getPostsByCategories } from 'services/PostService'

type GetPostsRequest = NextApiRequest & {
  query: {
    take?: string
    skip?: string
    order?: 'asc' | 'desc'
    orderBy?: string
    content?: string
    searchQuery?: string
    category?: string
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
  const { take, skip, order, orderBy, content, searchQuery, category } =
    req.query
  let posts
  if (!category) {
    posts = await getPosts({
      take: take ? parseInt(take) : undefined,
      skip: skip ? parseInt(skip) : undefined,
      order,
      orderBy,
      content: content === 'true' || content === '1',
      searchQuery: searchQuery,
    })
  } else {
    posts = await getPostsByCategories({
      take: take ? parseInt(take) : undefined,
      skip: skip ? parseInt(skip) : undefined,
      order,
      orderBy,
      content: content === 'true' || content === '1',
      searchQuery: searchQuery,
      category,
    })
  }

  res.status(200).json(posts)
})

export default handler
