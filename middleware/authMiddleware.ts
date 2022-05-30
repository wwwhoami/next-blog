import { UnauthorizedError } from '@/lib/error'
import prisma from '@/lib/prisma'
import { NextApiUserRequest } from '@/types/User'
import { JwtPayload, verify } from 'jsonwebtoken'
import { NextHandler } from 'next-connect'
import { NextApiResponse } from 'next/types'

export async function checkAuth(
  req: NextApiUserRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const { authorization } = req.headers

  if (authorization?.startsWith('Bearer')) {
    if (process.env.ACCESS_TOKEN_SECRET === undefined)
      throw new Error('process.env.ACCESS_TOKEN_SECRET undefined')

    const token = authorization.split(' ')[1]
    const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET)
    const id: string = (decoded as JwtPayload)['userId']

    const user = await prisma.user.findFirst({
      select: {
        id: true,
      },
      where: {
        id,
      },
      rejectOnNotFound: true,
    })
    req.user = user
  } else {
    throw new UnauthorizedError('Not authorized, no token')
  }
  next()
}
