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

const SignUpForm = ({}: Props) => {
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
      name: '',
      email: '',
      password: '',
    },
    validators: {
      name: (value: string) => value.length > 0,
      email: isEmail,
      password: validatePassword,
    },
    onSubmit,
    onSubmitError: (err: any) => {
      setError(err)
    },
  })
  const { name, email, password } = formData

  async function onSubmit() {
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
  }

  return (
    <form className="w-80" onSubmit={handleSubmit}>
      {errorResponse?.message && (
        <FormErrorResponse error={errorResponse.message} />
      )}
      <FormInput
        label="Name"
        value={name}
        onChange={handleChange}
        onBlur={handleBlur}
        type="text"
        id="name"
        placeholder="Enter preferred username"
        hasError={formError.name}
        errorMessage="Name should not be empty"
      />
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
        Sign up
      </FormSubmit>
      <p className="mt-8 font-light text-center">
        Already have an account?
        <Link
          href="/signIn"
          replace
          scroll={false}
          className="mx-2 text-indigo-600 dark:text-indigo-400 focus-ring-primary rounded-xl hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}

export default SignUpForm
