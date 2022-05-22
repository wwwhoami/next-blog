import {
  createAccessToken,
  createRefreshToken,
  matchPassword,
} from '@/lib/auth'
import prisma from '@/lib/prisma'
import redis from '@/lib/redis'
import { decode, JwtPayload, verify } from 'jsonwebtoken'

export async function authUser(email: string, password: string) {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
    where: { email },
  })

  if (user && (await matchPassword(password, user.password))) {
    const { id, name, email } = user
    const accessToken = await createAccessToken(id.toString())
    const accessTokenExpiry = (decode(accessToken) as JwtPayload).exp

    const refreshToken = await createRefreshToken(id.toString())

    return {
      name,
      email,
      accessToken,
      accessTokenExpiry,
      refreshToken,
    }
  } else {
    throw new Error('Invalid email or password!')
  }
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  image: string = 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/591.jpg'
) {
  const userWithEmailExists = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
    },
  })
  const userWithUsernameExists = await prisma.user.findFirst({
    where: {
      name,
    },
    select: {
      id: true,
    },
  })

  if (userWithEmailExists) {
    throw new Error('User with provided email exists')
  } else if (userWithUsernameExists) {
    throw new Error('User with provided name exists')
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password,
      image,
    },
  })
  if (user) {
    const { id, name, email } = user
    const accessToken = await createAccessToken(id.toString())
    const accessTokenExpiry = (decode(accessToken) as JwtPayload).exp

    const refreshToken = createRefreshToken(id.toString())

    return {
      id,
      name,
      email,
      accessToken,
      accessTokenExpiry,
      refreshToken,
    }
  } else {
    throw new Error('Invalid user data')
  }
}

export async function logoutUser(refreshToken: string) {
  const decoded = verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  )
  const id: string = (decoded as JwtPayload)['userId']

  redis.del(id)

  return
}

export async function getUserProfileData(name: string) {
  const user = await prisma.user.findFirst({
    select: {
      name: true,
      email: true,
      image: true,
    },
    where: {
      name,
    },
    rejectOnNotFound: true,
  })

  return user
}

type UserUpdateData = {
  name?: string
  email?: string
  password?: string
  image?: string
}

export async function updateUserProfileData({
  name,
  email,
  password,
  image,
}: UserUpdateData) {
  const updatedUser = await prisma.user.update({
    data: {
      name,
      email,
      password,
      image,
    },
    where: {
      name,
    },
  })
  const accessToken = await createAccessToken(updatedUser.id.toString())
  const accessTokenExpiry = (decode(accessToken) as JwtPayload).exp

  return {
    id: updatedUser.id,
    username: updatedUser.name,
    email: updatedUser.email,
    image: updatedUser.image,
    accessToken,
    accessTokenExpiry,
  }
}
