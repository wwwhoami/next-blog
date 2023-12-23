import Button from '../Button'
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
    <Button
      disabled={disabled}
      variant="solid"
      color="primary"
      className="w-full mt-3 sm:w-auto"
    >
      {isSubmitting && <LoadingSpinner size="md" />}
      {children}
    </Button>
  )
}
