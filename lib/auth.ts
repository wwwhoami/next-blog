import redis from '@/lib/redis'
import bcrypt from 'bcrypt'
import { decode, JwtPayload, sign, verify } from 'jsonwebtoken'
import { ForbiddenError, UnauthorizedError } from './error'

export async function matchPassword(
  enteredPassword: string,
  userPassword: string
) {
  return await bcrypt.compare(enteredPassword, userPassword)
}

export async function createAccessToken(id: string) {
  if (process.env.ACCESS_TOKEN_SECRET === undefined)
    throw new Error('process.env.ACCESS_TOKEN_SECRET undefined')

  const expiresIn = 600

  const accessToken = sign({ userId: id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn,
  })
  return accessToken
}

export async function createRefreshToken(id: string) {
  if (process.env.REFRESH_TOKEN_SECRET === undefined)
    throw new Error('process.env.REFRESH_TOKEN_SECRET undefined')

  const expiresIn = 86400

  const refreshToken = sign({ userId: id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn,
  })

  await redis.set(id, refreshToken)
  await redis.expire(id, expiresIn)

  return refreshToken
}

export const refreshTokens = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ForbiddenError('Access denied: token missing')
  } else {
    if (process.env.REFRESH_TOKEN_SECRET === undefined)
      throw new Error('process.env.REFRESH_TOKEN_SECRET undefined')

    const decoded = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const id: string = (decoded as JwtPayload)['userId']
    const tokenValue = await redis.get(id)
    if (!tokenValue) {
      throw new UnauthorizedError('Token expired')
    } else {
      await redis.del(id)
      const refreshToken = await createRefreshToken(id)
      const accessToken = await createAccessToken(id)
      const accessTokenExpiry = (decode(accessToken) as JwtPayload).exp

      return { refreshToken, accessToken, accessTokenExpiry }
    }
  }
}
