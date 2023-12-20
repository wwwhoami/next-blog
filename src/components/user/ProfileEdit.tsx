'use client'

import { useUser } from '@/context/UserProvider'
import useAuthorizedForm from '@/hooks/useAuthorizedForm'
import fetcher from '@/lib/fetcher'
import { UserProfileResponse } from '@/types/User'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import isEmail from 'validator/lib/isEmail'
import FormErrorResponse from '../form/FormErrorResponse'
import FormInput from '../form/FormInput'
import FormSubmit from '../form/FormSubmit'

const patchProfile = ({
  accessToken,
  name,
  email,
}: {
  accessToken: string
  name: string
  email: string
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
        name,
        email,
      }),
    },
  )

type Props = {}

const ProfileEdit = ({}: Props) => {
  const { user, setUser } = useUser()
  const router = useRouter()
  const {
    data: formData,
    setData: setFormData,
    error: formError,
    errorResponse,
    isValid: formIsValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useAuthorizedForm({
    initialData: {
      name: '',
      email: '',
    },
    validators: {
      name: (value: string) => value.length > 0,
      email: isEmail,
    },
    onSubmit,
  })
  const { name, email } = formData

  // Reinitialize name and email formData states on page refresh
  useEffect(() => {
    setFormData({
      ...formData,
      name: user?.name ?? '',
      email: user?.email ?? '',
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name, user?.email])

  async function onSubmit({ accessToken }: { accessToken: string }) {
    const profileData = await patchProfile({
      accessToken,
      name,
      email,
    })

    setUser(profileData)

    router.back()
    toast.success('🦄 Profile data updated successfully!')
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

      <FormSubmit formIsValid={formIsValid} isSubmitting={isSubmitting}>
        Update profile
      </FormSubmit>
    </form>
  )
}

export default ProfileEdit
