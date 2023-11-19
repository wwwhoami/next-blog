import { LogoutIcon } from '@heroicons/react/outline'
import React from 'react'
import { toast } from 'react-toastify'
import { useUser } from 'src/context/userContext'
import MenuItem from './MenuItem'

type Props = {}

const SignOut = (props: Props) => {
  const { setUser, setError, user } = useUser()

  const handleLogout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.accessToken}`,
      },
      credentials: 'include',
    })

    if (!res.ok) {
      const data: Error = await res.json()

      setError(data)

      toast.error('Something went wrong', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }

    if (res.ok) {
      setUser(undefined)
      setError(null)

      toast.success('🦄 Logged out', {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  return <MenuItem Icon={LogoutIcon} onClick={handleLogout} text="Log out" />
}

export default SignOut
