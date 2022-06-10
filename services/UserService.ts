import {
  createAccessToken,
  createRefreshToken,
  matchPassword,
} from '@/lib/auth'
import { BadRequest } from '@/lib/error'
import prisma from '@/lib/prisma'
import redis from '@/lib/redis'
import { decode, JwtPayload, verify } from 'jsonwebtoken'
import { genSalt, hash } from 'bcrypt'

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      image: true,
    },
    where: { email },
  })

  if (user && (await matchPassword(password, user.password))) {
    const { id, name, email, image } = user
    const accessToken = await createAccessToken(id)
    const accessTokenExpiry = (decode(accessToken) as JwtPayload).exp

    const refreshToken = await createRefreshToken(id)

    return {
      name,
      email,
      image,
      accessToken,
      accessTokenExpiry,
      refreshToken,
    }
  } else {
    throw new BadRequest('Invalid email or password!')
  }
}

type CreateUserParams = {
  name: string
  email: string
  password: string
  image?: string
}

export async function createUser({
  name,
  email,
  password,
  image = 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/591.jpg',
}: CreateUserParams) {
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
    throw new BadRequest('User with provided email exists')
  } else if (userWithUsernameExists) {
    throw new BadRequest('User with provided name exists')
  }

  const salt = await genSalt(10)
  const encryptedPassword = await hash(password, salt)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: encryptedPassword,
      image,
    },
  })
  if (user) {
    const { id, name, email, image } = user
    const accessToken = await createAccessToken(id)
    const accessTokenExpiry = (decode(accessToken) as JwtPayload).exp

    const refreshToken = await createRefreshToken(id)

    return {
      name,
      email,
      image,
      accessToken,
      accessTokenExpiry,
      refreshToken,
    }
  } else {
    throw new BadRequest('Invalid user data')
  }
}

export async function logoutUser(refreshToken: string) {
  if (process.env.REFRESH_TOKEN_SECRET === undefined)
    throw new Error('process.env.REFRESH_TOKEN_SECRET undefined')

  const decoded = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  const id: string = (decoded as JwtPayload)['userId']

  await redis.del(id)

  return id
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

export async function getUserProfileDataById(id: string) {
  const user = await prisma.user.findFirst({
    select: {
      name: true,
      email: true,
      image: true,
    },
    where: {
      id,
    },
    rejectOnNotFound: true,
  })

  return user
}

export async function checkUserPassword(id: string, password: string) {
  const user = await prisma.user.findFirst({
    select: {
      password: true,
    },
    where: {
      id,
    },
    rejectOnNotFound: true,
  })

  return await matchPassword(password, user.password)
}

type UserUpdateData = {
  id: string
  name?: string
  email?: string
  password?: string
  image?: string
}

export async function updateUserProfileData({
  id,
  name,
  email,
  password,
  image,
}: UserUpdateData) {
  let encryptedPassword
  if (password) {
    const salt = await genSalt(10)
    encryptedPassword = await hash(password, salt)
  }

  const updatedUser = await prisma.user.update({
    data: {
      name,
      email,
      password: encryptedPassword,
      image,
    },
    where: {
      id,
    },
  })

  const accessToken = await createAccessToken(updatedUser.id)
  const accessTokenExpiry = (decode(accessToken) as JwtPayload).exp

  return {
    name: updatedUser.name,
    email: updatedUser.email,
    image: updatedUser.image,
    accessToken,
    accessTokenExpiry,
  }
}

export async function deleteUser({ name }: UserUpdateData) {
  const deletedUser = await prisma.user.delete({
    where: {
      name,
    },
  })

  return deletedUser.id
}
