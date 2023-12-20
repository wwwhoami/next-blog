'use client'

import { useUser } from '@/context/UserProvider'
import useAuthorizedForm from '@/hooks/useAuthorizedForm'
import fetcher from '@/lib/fetcher'
import { UserProfileResponse } from '@/types/User'
import validatePassword from '@/utils/validatePassword'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import FormErrorResponse from '../form/FormErrorResponse'
import FormSubmit from '../form/FormSubmit'
import PasswordInput from '../form/PasswordInput'

const patchProfilePassword = ({
  accessToken,
  oldPassword,
  newPassword,
}: {
  accessToken: string
  oldPassword: string
  newPassword: string
}) =>
  fetcher<UserProfileResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        password: oldPassword,
        newPassword,
      }),
    },
  )

type Props = {}

const PasswordChange = ({}: Props) => {
  const { setUser } = useUser()
  const router = useRouter()
  const {
    data: formData,
    error: formError,
    errorResponse,
    isValid: formIsValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useAuthorizedForm({
    initialData: {
      oldPassword: '',
      newPassword: '',
    },
    validators: {
      oldPassword: validatePassword,
      newPassword: validatePassword,
    },
    onSubmit,
  })
  const { oldPassword, newPassword } = formData

  async function onSubmit({ accessToken }: { accessToken: string }) {
    const profileData = await patchProfilePassword({
      accessToken,
      oldPassword,
      newPassword,
    })
    setUser(profileData)

    toast.success('🦄 Password changed successfully!')

    router.back()
  }

  return (
    <form className="w-80" onSubmit={handleSubmit}>
      {errorResponse?.message && (
        <FormErrorResponse error={errorResponse.message} />
      )}
      <PasswordInput
        label="Old password"
        value={oldPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        type="text"
        id="oldPassword"
        placeholder="************"
        hasError={formError.oldPassword}
        errorMessage="Password should be at least 8 characters long"
      />
      <PasswordInput
        label="New password"
        value={newPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        id="newPassword"
        placeholder="************"
        hasError={formError.newPassword}
        errorMessage="Password should be at least 8 characters long"
      />

      <FormSubmit formIsValid={formIsValid} isSubmitting={isSubmitting}>
        Change password
      </FormSubmit>
    </form>
  )
}

export default PasswordChange
