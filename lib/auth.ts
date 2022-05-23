import redis from '@/lib/redis'
import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'

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
