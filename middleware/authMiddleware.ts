import { UnauthorizedError } from '@/lib/error'
import prisma from '@/lib/prisma'
import { verify } from 'jsonwebtoken'
import { NextHandler } from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next/types'

export async function checkAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const { authorization } = req.headers

  if (authorization?.startsWith('Bearer')) {
    if (process.env.ACCESS_TOKEN_SECRET === undefined)
      throw new Error('process.env.ACCESS_TOKEN_SECRET undefined')

    const token = authorization.split(' ')[1]
    const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET)

    req.body.user = await prisma.user.findFirst({
      where: {
        id: decoded as string,
      },
      rejectOnNotFound: true,
    })
  } else {
    throw new UnauthorizedError('Not authorized, no token')
  }
  next()
}
