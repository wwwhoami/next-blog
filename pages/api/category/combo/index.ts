import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { getCategoryCombinations } from 'services/CategoryService'

type GetCategoryCombsRequest = NextApiRequest & {
  query: {
    searchQuery?: string
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
}).get<GetCategoryCombsRequest>(async (req, res) => {
  const { searchQuery } = req.query
  const categoryCombs = await getCategoryCombinations(searchQuery)
  res.status(200).json(categoryCombs)
})

export default handler
