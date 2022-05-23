import { BadRequest } from '@/lib/error'
import { NextHandler } from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next/types'
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'
import isURL from 'validator/lib/isURL'

export async function validateEmail(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const { email } = req.body
  if (!email) throw new BadRequest('Missing email field in request body')
  if (!isEmail(email)) throw new BadRequest('Wrong email format')
  next()
}

export async function validatePassword(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const { password } = req.body
  if (!password) throw new BadRequest('Missing password field in request body')
  if (
    !isStrongPassword(password, {
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10,
    })
  )
    throw new BadRequest(
      'Wrong password format: should be at least 8 characters long'
    )
  next()
}

export async function validateUserImage(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const { image } = req.body
  if (!image) throw new BadRequest('Missing image field in request body')
  if (!isURL(image))
    throw new BadRequest('Image field should contain image url')
  next()
}
