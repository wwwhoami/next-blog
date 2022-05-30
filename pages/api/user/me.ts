import { BadRequest, UnauthorizedError } from '@/lib/error'
import { checkAuth } from '@/middleware/authMiddleware'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { getUserProfileDataById } from 'services/UserService'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)

    if (err instanceof BadRequest)
      res.status(400).json({ name: err.name, message: err.message })
    if (err instanceof UnauthorizedError)
      res.status(401).json({ name: err.name, message: err.message })

    res.status(500).json({ message: 'Internal server error' })
  },
  onNoMatch: (req, res) => {
    res.status(404).send({ message: 'Page is not found' })
  },
}).get(checkAuth, async (req, res) => {
  const { id } = req.user

  const { email, name, image } = await getUserProfileDataById(id)

  res.json({ user: { email, name, image } })
})

export default handler
