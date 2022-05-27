import { useRouter } from 'next/router'
import React from 'react'
import { useUser } from 'src/context/userContext'

type Props = {}

const SignOut = (props: Props) => {
  const router = useRouter()
  const { error, logout } = useUser()

  const handleLogout = async () => {
    await logout()
    if (error) console.log(error)
    router.push('/', undefined)
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
