import { UserApiResponse } from '@/types/User'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useUser } from 'src/context/userContext'
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'
import FormInput from './FormInput'
import PasswordInput from './PasswordInput'

type Props = {
  closeModal?: () => void
}

const SignUpForm = ({ closeModal }: Props) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nameError, setNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [errorResponse, setErrorResponse] = useState<Error>()

  const router = useRouter()
  const { user, setUser, setError } = useUser()

  useEffect(() => {
    if (user) router.back()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data: UserApiResponse | Error = await res.json()

      if (!res.ok && 'message' in data) {
        setErrorResponse(data)
        setError(data)
      }

      if (res.ok && 'accessToken' in data) {
        setUser(data)
        setError(null)
        toast.success('🦄 Logged in successfully!', {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        if (closeModal) closeModal()
      }
    }
  }

  return (
    <form className="w-80" onSubmit={handleSubmit}>
      {!!errorResponse && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <span className="font-medium">{errorResponse.message}</span>
        </div>
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
              })
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
            })
          )
        }}
        id="password"
        hasError={passwordError}
        errorMessage="Password should be at least 8 characters long"
      />
      <button
        type="submit"
        className={`text-white bg-indigo-600 hover:bg-indigo-500 focus-ring focus:outline-none focus-within:ring focus-within:ring-primary focus-within:ring-opacity-50 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ${
          emailError ||
          passwordError ||
          nameError ||
          !email.length ||
          !password.length ||
          !name.length
            ? 'cursor-not-allowed opacity-80'
            : ''
        }`}
      >
        Sign up
      </button>
      <p className="mt-8 text-center font-light">
        Already have an account?
        <Link
          href="/signIn"
          className="text-indigo-600 focus-ring rounded-xl hover:underline mx-2"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}

export default SignUpForm
