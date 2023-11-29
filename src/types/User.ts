import { NextApiRequest } from 'next/dist/shared/lib/utils'

export type UserSession = Partial<User & AccessTokenResponse>

export type User = {
  id: string
  email: string
  name: string
  image: string | null
  role: Role
}

export type UserProfileResponse = User

export type AccessTokenResponse = {
  accessToken: string
}

export type UserSignInResponse = User & AccessTokenResponse

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
