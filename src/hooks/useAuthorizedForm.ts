import { useUser } from '@/context/UserProvider'
import { FetchError } from '@/entities/FetchError'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import useForm, { UseFormProps } from './useForm'

export type UseAuthorizedFormProps<T extends {}, K extends keyof T> = Omit<
  UseFormProps<T, K>,
  'onSubmit'
> & {
  onSubmit: ({
    accessToken,
    e,
  }: {
    accessToken: string
    e: React.FormEvent<HTMLFormElement>
  }) => Promise<void>
}

const useAuthorizedForm = <T extends {}, K extends keyof T>({
  initialData,
  validators,
  onSubmit,
  onSubmitError,
}: UseAuthorizedFormProps<T, K>) => {
  const {
    data,
    setData,
    error,
    errorResponse,
    setErrorResponse,
    isValid,
    handleChange,
    handleBlur,
  } = useForm({
    initialData,
    validators,
    // won't be called, but needs to be passed to useForm
    onSubmit: async () => {
      return
    },
    onSubmitError,
  })
  const { user, setUser, refreshSession, setError: setUserError } = useUser()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // if form is not valid, do not submit and set error response
    if (!isValid) {
      setErrorResponse(new Error("There are errors in the form, can't submit"))
      return
    }

    // If the user has no access token, set the user error, clear user data, redirect to the login page
    if (user?.accessToken === undefined) {
      setUserError(new Error('Authentication token is missing'))
      setUser(undefined)

      router.replace('/signIn')
    } else {
      try {
        await onSubmit({ accessToken: user.accessToken, e })
      } catch (err: any) {
        // If access token is expired, refresh it and try again
        if (
          err instanceof FetchError &&
          err.status === 401 &&
          err.message === 'Unauthorized'
        ) {
          const newAccessToken = await refreshSession()

          // If the refresh was successful, try to patch the profile again
          if (newAccessToken) {
            try {
              await onSubmit({ accessToken: newAccessToken, e })
            } catch (err: any) {
              // If the second attempt failed, set the error response
              // And call the onSubmitError callback if it exists
              onSubmitError?.(err)
              setErrorResponse(err)
            }
          } else {
            // If the refresh failed, set the user error, clear user data, redirect to the login page
            const error = new Error('Session refresh failed, try logging in')
            setUserError(error)
            setUser(undefined)

            router.replace('/signIn')
            toast.error(error.message)
          }
        } else {
          // If the error is not related to the access token, set the error response
          // And call the onSubmitError callback if it exists
          onSubmitError?.(err)
          setErrorResponse(err)
        }
      }
    }

    setIsSubmitting(false)
  }

  return {
    data,
    setData,
    error,
    errorResponse,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}

export default useAuthorizedForm
