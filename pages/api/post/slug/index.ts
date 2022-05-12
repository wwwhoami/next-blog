import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { getPostsSlugs } from 'services/PostService'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)
    res.status(500).json('Internal server error')
  },
  onNoMatch: (req, res) => {
    res.status(404).send('Page is not found')
  },
}).get(async (req, res) => {
  const slugs = await getPostsSlugs()
  res.status(200).json(slugs)
})

export default handler
