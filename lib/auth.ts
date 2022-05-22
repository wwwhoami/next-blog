import redis from '@/lib/redis'
import bcrypt from 'bcrypt'
import { sign, verify } from 'jsonwebtoken'
import { NextHandler } from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { BadRequest, UnauthorizedError } from './error'
import prisma from './prisma'

export async function matchPassword(
  enteredPassword: string,
  userPassword: string
) {
  return await bcrypt.compare(enteredPassword, userPassword)
}

export async function createAccessToken(id: string) {
  const expiresIn = 600

  const accessToken = sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn,
  })
  return accessToken
}

export async function createRefreshToken(id: string) {
  const expiresIn = 86400

  const refreshToken = sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn,
  })

  await redis.set(id, refreshToken)
  await redis.expire(id, expiresIn)

  return refreshToken
}

export async function checkAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const { authorization } = req.headers

  if (authorization?.startsWith('Bearer')) {
    const token = authorization.split(' ')[1]
    const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET as string)

    req.body.user = await prisma.user.findFirst({
      where: {
        id: parseInt(decoded as string),
      },
      rejectOnNotFound: true,
    })
  } else {
    throw new UnauthorizedError('Not authorized, no token')
  }
  next()
}
