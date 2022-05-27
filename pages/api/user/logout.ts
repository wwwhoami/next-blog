import { BadRequest } from '@/lib/error'
import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { logoutUser } from 'services/UserService'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)

    if (err instanceof BadRequest)
      res.status(400).json({ message: err.message, name: err.name })

    res.status(500).send('Internal server error')
  },
  onNoMatch: (req, res) => {
    res.status(404).send('Page is not found')
  },
}).delete(async (req, res) => {
  const { refreshToken } = req.cookies
  if (!refreshToken) throw new BadRequest('No refresh token')

  const id = await logoutUser(refreshToken)

  res.status(200).json({ id })
})

export default handler
