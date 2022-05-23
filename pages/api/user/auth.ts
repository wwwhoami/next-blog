import {
  validateEmail,
  validatePassword,
} from '@/middleware/validateMiddleware'
import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { authUser } from 'services/UserService'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)
    if (typeof err === 'string') res.status(400).json({ message: err })
    if (err.name === 'UnauthorizedError')
      res.status(401).json({ mesasge: 'Invalid token' })

    res.status(500).json({ message: 'Internal server error' })
  },
  onNoMatch: (req, res) => {
    res.status(404).send({ message: 'Page is not found' })
  },
}).post(validateEmail, validatePassword, async (req, res) => {
  const { email: userEmail, password } = req.body
  const { name, email, accessToken, accessTokenExpiry, refreshToken } =
    await authUser(userEmail, password)

  res.setHeader(
    'Set-Cookie',
    serialize('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    })
  )

  res.json({ name, email, accessToken, accessTokenExpiry })
})

export default handler
