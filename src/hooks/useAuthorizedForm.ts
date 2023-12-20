import { useUser } from '@/context/UserProvider'
import { FetchError } from '@/entities/FetchError'
import { FormRecord } from '@/types/Form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import useForm, { UseFormProps } from './useForm'

export type UseAuthorizedFormProps<TFormData extends FormRecord> = Omit<
  UseFormProps<TFormData>,
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

/**
 * Hook for handling forms that require authentication.
 * Attempts to resubmit the form if the access token is expired,
 * retries with fresh access token if it is.
 * @param initialData Initial data for the form.
 * @param validators Validators for each field.
 * @param onSubmit Function to call when the form is submitted.
 * @param onSubmitError Function to call when the form submission fails.
 * @returns Form state, form status and handlers.
 */
const useAuthorizedForm = <TFormData extends FormRecord = FormRecord>({
  initialData,
  validators,
  onSubmit,
  onSubmitError,
}: UseAuthorizedFormProps<TFormData>) => {
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

  /**
   * Handles form submission.
   * Attempts to resubmit the form if the access token is expired,
   * refreshes the access token if it is.
   * @param e Form event.
   * @returns Promise that resolves when the form is submitted.
   */
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
