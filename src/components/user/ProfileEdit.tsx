'use client'

import { useUser } from '@/context/UserProvider'
import { FetchError } from '@/entities/FetchError'
import fetcher from '@/lib/fetcher'
import { UserProfileResponse } from '@/types/User'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import isEmail from 'validator/lib/isEmail'
import FormInput from '../form/FormInput'

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
  const { user, setUser, setError, refreshSession } = useUser()
  const router = useRouter()

  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [nameError, setNameError] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [errorResponse, setErrorResponse] = useState<Error>()

  // Reinitialize name and email states on page refresh
  useEffect(() => {
    setName(user?.name)
    setEmail(user?.email)
  }, [user?.name, user?.email])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      user?.accessToken &&
      !nameError &&
      !emailError &&
      name?.length &&
      email?.length
    ) {
      const onSuccessfulPatch = (profileData: UserProfileResponse) => {
        setUser(profileData)
        setErrorResponse(undefined)

        toast.success('🦄 Profile data updated successfully!', {
          position: 'bottom-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })

        router.back()
      }

      try {
        const profileData = await patchProfile({
          accessToken: user.accessToken,
          name,
          email,
        })

        onSuccessfulPatch(profileData)
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
            patchProfile({
              accessToken: newAccessToken,
              name,
              email,
            })
              .then(onSuccessfulPatch)
              .catch(setErrorResponse)
          } else {
            // If the refresh failed, redirect to the login page
            const error = new Error('Session refresh failed, try logging in')
            setError(error)
            toast.error(error.message, {
              position: 'bottom-center',
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })

            router.replace('/signIn')
          }

          return
        }

        setErrorResponse(err)
      }
    } else if (user?.accessToken === undefined) {
      // If the user has no access token, redirect to the login page
      setError(new Error('Authentication token is missing'))
      router.replace('/signIn')
    }
  }

  return (
    <form className="w-80" onSubmit={handleSubmit}>
      {!!errorResponse && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          <span className="font-medium">{errorResponse.message}</span>
        </div>
      )}
      <FormInput
        label="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          if (nameError) setNameError(!e.target.value.length)
        }}
        onBlur={(e) => {
          setNameError(!e.target.value)
        }}
        type="text"
        id="name"
        placeholder="Enter preferred username"
        hasError={nameError}
        errorMessage="Name should not be empty"
      />
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
      <button
        type="submit"
        className={clsx(
          `focus-ring focus-within:ring-primary w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-center text-sm font-medium text-white focus-within:ring focus-within:ring-opacity-50 hover:bg-indigo-500 focus:outline-none sm:w-auto`,
          {
            'cursor-not-allowed opacity-80':
              emailError || nameError || !email?.length || !name?.length,
          },
        )}
      >
        Update profile
      </button>
    </form>
  )
}

export default ProfileEdit
