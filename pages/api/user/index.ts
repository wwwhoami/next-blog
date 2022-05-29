import { checkAuth } from '@/middleware/authMiddleware'
import { BadRequest, UnauthorizedError } from '@/lib/error'
import { serialize } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import {
  createUser,
  deleteUser,
  getUserProfileData,
  updateUserProfileData,
} from 'services/UserService'
import {
  validateEmail,
  validatePassword,
  validateUserImage,
} from '@/middleware/validateMiddleware'

type CreateUserRequest = {
  body: {
    name: string
    email: string
    password: string
    image?: string
  }
}

type UpdateUserRequest = {
  body: {
    name?: string
    email?: string
    password?: string
    image?: string
  }
}

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.message)
    console.error(err.stack)

    if (err instanceof BadRequest)
      res.status(400).json({ name: err.name, message: err.message })
    if (err instanceof UnauthorizedError)
      res.status(401).json({ name: err.name, message: err.message })

    res.status(500).json({ message: 'Internal server error' })
  },
  onNoMatch: (req, res) => {
    res.status(404).send({ message: 'Page is not found' })
  },
})
  .get(async (req, res) => {
    const { name: username } = req.body

    if (!username) throw new BadRequest('Name is not defined')

    const { email, name, image } = await getUserProfileData(username)

    res.json({ user: { email, name, image } })
  })
  .post<CreateUserRequest>(
    validateEmail,
    validatePassword,
    async (req, res) => {
      const {
        name: username,
        email: userEmail,
        password,
        image: userImage,
      } = req.body

      const {
        name,
        email,
        image,
        accessToken,
        accessTokenExpiry,
        refreshToken,
      } = await createUser({
        name: username,
        email: userEmail,
        password,
        image: userImage,
      })

      res.setHeader(
        'Set-Cookie',
        serialize('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'strict',
        })
      )

      res
        .status(201)
        .json({ user: { name, email, image }, accessToken, accessTokenExpiry })
    }
  )
  .put<UpdateUserRequest>(checkAuth, async (req, res) => {
    const { name, email, password, image } = req.body
    if (!name) throw new BadRequest('Missing name value in body')

    const updatedUser = await updateUserProfileData({
      name,
      email,
      password,
      image,
    })

    res.status(201).json({
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
      accessToken: updatedUser.accessToken,
      accessTokenExpiry: updatedUser.accessTokenExpiry,
    })
  })
  .delete(checkAuth, async (req, res) => {
    const { name } = req.body
    if (!name) throw new BadRequest('Missing name value in body')

    await deleteUser(name)

    res.status(204)
  })

export default handler
