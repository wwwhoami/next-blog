import clsx from 'clsx'
import LoadingSpinner from '../LoadingSpinner'

type Props = {
  formIsValid: boolean
  isSubmitting: boolean
  children: React.ReactNode
}

export default function FormSubmit({
  formIsValid,
  isSubmitting,
  children,
}: Props) {
  const disabled = !formIsValid || isSubmitting

  return (
    <button
      type="submit"
      disabled={disabled}
      className={clsx(
        `inline-flex items-center focus-ring focus-within:ring-primary w-full justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-center font-medium text-sm text-white focus-within:ring focus-within:ring-opacity-50 hover:bg-indigo-500 focus:outline-none sm:w-auto`,
        {
          'cursor-not-allowed opacity-80': disabled,
        },
      )}
    >
      {isSubmitting && <LoadingSpinner color="white" size="md" />}
      {children}
    </button>
  )
}
