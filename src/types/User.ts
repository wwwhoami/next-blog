import { NextApiRequest } from 'next/dist/shared/lib/utils'

export type UserSession = {
  accessToken?: string
  user?: User
}

export type User = {
  name: string
  email: string
  image: string
}

export type UserApiResponse = {
  user: User
  accessToken: string
  accessTokenExpiry: string
}

export type NextApiUserRequest = NextApiRequest & {
  user: {
    id: string
    name?: string
    email?: string
    image?: string
  }
}
