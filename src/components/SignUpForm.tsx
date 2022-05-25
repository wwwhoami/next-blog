import { useRouter } from 'next/router'
import React, { useState } from 'react'
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'
import FormInput from './FormInput'
import Modal from './Modal'
import PasswordInput from './PasswordInput'

type Props = {}

const SignUpForm = (props: Props) => {
  const router = useRouter()
  const { signUp } = router.query

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <form className="w-80" onSubmit={handleSubmit}>
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
          emailError || passwordError || !email.length || !password.length
            ? 'cursor-not-allowed opacity-80'
            : ''
        }`}
      >
        Sign up
      </button>
    </form>
  )
}

export default SignUpForm
