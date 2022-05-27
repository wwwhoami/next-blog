import { refreshTokens } from '@/lib/auth'
import { BadRequest, ForbiddenError, UnauthorizedError } from '@/lib/error'
import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)

    if (err instanceof BadRequest)
      res.status(400).json({ message: err.message, name: err.name })
    if (err instanceof ForbiddenError)
      res.status(403).json({ message: err.message, name: err.name })
    if (err instanceof UnauthorizedError)
      res.status(401).json({ message: err.message, name: err.name })

    res.status(500).json({ message: 'Internal server error' })
  },
  onNoMatch: (req, res) => {
    res.status(404).send({ message: 'Page is not found' })
  },
}).get(async (req, res) => {
  const { refreshToken: oldRefreshToken } = req.cookies
  const { accessToken, accessTokenExpiry, refreshToken } = await refreshTokens(
    oldRefreshToken
  )

  res.setHeader(
    'Set-Cookie',
    serialize('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    })
  )

  res.status(200).json({ accessToken, accessTokenExpiry })
})

export default handler
