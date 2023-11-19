import { NextApiRequest } from 'next/dist/shared/lib/utils'

export type UserSession = Partial<UserApiResponse>

export type User = {
  id: string
  email: string
  name: string
  image: string | null
  role: Role
}

export type UserApiResponse = User & {
  accessToken: string
}

export type NextApiUserRequest = NextApiRequest & {
  user: {
    id: string
    name?: string
    email?: string
    image?: string
  }
}

enum Role {
  User = 'USER',
  Admin = 'ADMIN',
}

export type UserNameImageEntity = Pick<User, 'name' | 'image'>

export type UserNameImage = {
  user: UserNameImageEntity
}

export type UserNoIdEntity = Omit<User, 'id'>
