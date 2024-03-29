'use client'

import { useUser } from '@/context/UserProvider'
import fetcher from '@/lib/fetcher'
import { UserSignInResponse } from '@/types/User'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'
import FormErrorResponse from '../form/FormErrorResponse'
import FormInput from '../form/FormInput'
import PasswordInput from '../form/PasswordInput'

type Props = {}

const SignUpForm = ({}: Props) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nameError, setNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [errorResponse, setErrorResponse] = useState<Error>()

  const router = useRouter()
  const { setUser, setError } = useUser()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      !nameError &&
      !emailError &&
      !passwordError &&
      name.length &&
      email.length &&
      password.length
    ) {
      try {
        const signInRes = await fetcher<UserSignInResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          },
        )

        setUser(signInRes)
        setError(null)

        toast.success('🦄 Signed up successfully!')

        router.back()
      } catch (err: any) {
        setErrorResponse(err)
        setError(err)
      }
    }
  }

  return (
    <form className="w-80" onSubmit={handleSubmit}>
      {errorResponse?.message && (
        <FormErrorResponse error={errorResponse.message} />
      )}
      <FormInput
        label="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          if (nameError) setNameError(!e.target.value.length)
        }}
        onBlur={(e) => {
          setNameError(!e.target.value)
        }}
        type="text"
        id="name"
        placeholder="Enter preferred username"
        hasError={nameError}
        errorMessage="Name should not be empty"
      />
      <FormInput
        label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (emailError) setEmailError(!isEmail(e.target.value))
        }}
        onBlur={(e) => {
          setEmailError(!isEmail(e.target.value))
        }}
        type="email"
        id="email"
        placeholder="somemail@example.com"
        hasError={emailError}
        errorMessage="Wrong email format"
      />
      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          if (passwordError)
            setPasswordError(
              !isStrongPassword(e.target.value, {
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
              }),
            )
        }}
        onBlur={(e) => {
          setPasswordError(
            !isStrongPassword(e.target.value, {
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
            }),
          )
        }}
        id="password"
        hasError={passwordError}
        errorMessage="Password should be at least 8 characters long"
      />
      <button
        type="submit"
        className={clsx(
          'focus-ring focus-within:ring-primary w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white focus-within:ring focus-within:ring-opacity-50 hover:bg-indigo-500 focus:outline-none sm:w-auto',
          {
            'cursor-not-allowed opacity-80':
              emailError ||
              passwordError ||
              nameError ||
              !email.length ||
              !password.length ||
              !name.length,
          },
        )}
      >
        Sign up
      </button>
      <p className="mt-8 font-light text-center">
        Already have an account?
        <Link
          href="/signIn"
          replace
          scroll={false}
          className="mx-2 text-indigo-600 dark:text-indigo-400 focus-ring rounded-xl hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}

export default SignUpForm
