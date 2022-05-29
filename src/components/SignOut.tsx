import React from 'react'
import { toast } from 'react-toastify'
import { useUser } from 'src/context/userContext'

type Props = {}

const SignOut = (props: Props) => {
  const { setUser, setError } = useUser()

  const handleLogout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const data: { id: string } | Error = await res.json()

    if (!res.ok && 'message' in data) {
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

    if (res.ok && 'id' in data) {
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

  return (
    <a
      href="#"
      className="px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900"
      onClick={handleLogout}
    >
      Sign out
    </a>
  )
}

export default SignOut
function setError(data: Error) {
  throw new Error('Function not implemented.')
}
