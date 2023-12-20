'use client'

import { useUser } from '@/context/UserProvider'
import useForm from '@/hooks/useForm'
import fetcher from '@/lib/fetcher'
import { UserSignInResponse } from '@/types/User'
import validatePassword from '@/utils/validatePassword'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import isEmail from 'validator/lib/isEmail'
import FormErrorResponse from '../form/FormErrorResponse'
import FormInput from '../form/FormInput'
import FormSubmit from '../form/FormSubmit'
import PasswordInput from '../form/PasswordInput'

type Props = {}

const SignInForm = ({}: Props) => {
  const router = useRouter()
  const { setUser, setError } = useUser()
  const {
    data: formData,
    error: formError,
    errorResponse,
    isValid: formIsValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialData: {
      email: '',
      password: '',
    },
    validators: {
      email: isEmail,
      password: validatePassword,
    },
    onSubmit,
    onSubmitError: (err: any) => {
      setError(err)
    },
  })
  const { email, password } = formData

  async function onSubmit() {
    const loginRes = await fetcher<UserSignInResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      },
    )

    setUser(loginRes)
    setError(null)

    toast.success('🦄 Logged in successfully!')

    router.back()
  }

  return (
    <>
      <form className="w-80" onSubmit={handleSubmit}>
        {errorResponse?.message && (
          <FormErrorResponse error={errorResponse.message} />
        )}
        <FormInput
          label="Email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          type="email"
          id="email"
          placeholder="somemail@example.com"
          hasError={formError.email}
          errorMessage="Wrong email format"
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={handleChange}
          onBlur={handleBlur}
          id="password"
          hasError={formError.password}
          errorMessage="Password should be at least 8 characters long"
        />
        <FormSubmit formIsValid={formIsValid} isSubmitting={isSubmitting}>
          Sign in
        </FormSubmit>
        <p className="mt-8 font-light text-center">
          No account yet?
          <Link
            href="/signUp"
            replace
            scroll={false}
            className="mx-2 text-indigo-600 dark:text-indigo-400 focus-ring rounded-xl hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </>
  )
}

export default SignInForm
