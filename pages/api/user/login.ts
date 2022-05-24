import { BadRequest } from '@/lib/error'
import {
  validateEmail,
  validatePassword,
} from '@/middleware/validateMiddleware'
import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { loginUser } from 'services/UserService'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)
    if (err instanceof BadRequest)
      res.status(400).json({ message: err.message, name: err.name })

    res.status(500).json({ message: 'Internal server error' })
  },
  onNoMatch: (req, res) => {
    res.status(404).send({ message: 'Page is not found' })
  },
}).post(validateEmail, validatePassword, async (req, res) => {
  const { email: userEmail, password } = req.body
  const { name, email, image, accessToken, accessTokenExpiry, refreshToken } =
    await loginUser(userEmail, password)

  res.setHeader(
    'Set-Cookie',
    serialize('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    })
  )

  res.json({ user: { name, email, image }, accessToken, accessTokenExpiry })
})

export default handler
