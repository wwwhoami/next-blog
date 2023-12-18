import cloneWithDefaultValues from '@/utils/cloneWithDefaultValues'
import React, { useMemo } from 'react'

export type UseFormProps<T extends {}, K extends keyof T> = {
  initialData: T
  validators?: Record<K, (value: string) => boolean | undefined>
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>
  onSubmitError?: (error: Error) => void
}

/**
 * Hook for handling forms.
 * @param initialData Initial data for the form.
 * @param validators Validators for each field.
 * @param onSubmit Function to call when the form is submitted.
 * @param onSubmitError Function to call when the form submission fails.
 * @returns Form state, form status and handlers.
 */
const useForm = <T extends {}, K extends keyof T>({
  initialData,
  validators,
  onSubmit,
  onSubmitError,
}: UseFormProps<T, K>) => {
  const [data, setData] = React.useState<T>(initialData)
  const [error, setError] = React.useState<Record<keyof T, boolean>>(
    cloneWithDefaultValues(initialData, false),
  )
  const [errorResponse, setErrorResponse] = React.useState<Error>()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // if there are any errors or missing fields, form is not valid
  const isValid = useMemo(() => {
    const hasErrors = Object.keys(error).some((key) => error[key as K])
    const hasMissingFields = Object.keys(data).some(
      (key) => data[key as K] === '',
    )
    return !hasErrors && !hasMissingFields
  }, [error, data])

  /**
   * Handles change event in form fields.
   * Updates data and error state.
   * @param e Change event.
   */
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target

    // update data for field with the new value
    setData({
      ...data,
      [name]: value,
    })

    // if valirator for this field exists, validate it
    // otherwise, do nothing
    const validator = validators ? validators[name as K] : undefined
    if (validator === undefined) return

    const isValid = validator(value)
    setError({
      ...error,
      [name]: !isValid,
    })
  }

  /**
   * Handles blur event in form fields.
   * Updates error state.
   * @param e Blur event.
   */
  const handleBlur = (e: React.FocusEvent<any>) => {
    const { name, value } = e.target

    // if valirator for this field exists, validate it
    // otherwise, do nothing
    const validator = validators ? validators[name as K] : undefined
    if (validator === undefined) return

    const isValid = validator(value)
    setError({
      ...error,
      [name]: !isValid,
    })
  }

  /**
   * Handles form submission.
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

    try {
      await onSubmit(e)
    } catch (err: any) {
      onSubmitError?.(err)
      setErrorResponse(err)
    }

    setIsSubmitting(false)
  }

  return {
    data,
    setData,
    error,
    errorResponse,
    setErrorResponse,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  }
}

export default useForm
