import { FetchError } from '@/entities/FetchError'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import { toast } from 'react-toastify'
import { useUser } from 'src/context/UserContext'
import MenuItemButton from '../menu/MenuItemButton'

async function logout(accessToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: 'include',
  })

  if (!res.ok) {
    const errorRes = await res.json()
    const message = errorRes?.message ?? 'An error occurred while fetching data'
    const error = new FetchError(message, res.status, errorRes)

    throw error
  }
}

type Props = {}

const SignOut = (props: Props) => {
  const { setUser, setError, user } = useUser()

  const handleLogout = async () => {
    const onSuccessfulLogout = () => {
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

    if (user?.accessToken) {
      try {
        await logout(user.accessToken)

        onSuccessfulLogout()
      } catch (err: any) {
        // If the error is a FetchError and the status is 401,
        // it means the user's access token is invalid,
        // so we clear the user's session
        if (err instanceof FetchError && err.status === 401) {
          onSuccessfulLogout()
          return
        }

        setError(err)

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
    } else {
      // If the user has no access token, we just clear the session
      onSuccessfulLogout()
    }
  }

  return (
    <MenuItemButton
      Icon={ArrowRightOnRectangleIcon}
      onClick={handleLogout}
      text="Log out"
    />
  )
}

export default SignOut
