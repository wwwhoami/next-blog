import { UserApiResponse, UserSession } from '@/types/User'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

type UserContext = {
  user?: UserSession
  error?: Error | null
  refreshSession: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  updateUserData: (
    name: string,
    email: string,
    password: string,
    image: string
  ) => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContext | null>(null)

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

type Props = {
  children: ReactNode
}

type AccessTokenResponse = {
  accessToken: string
  accessTokenExpiry: number
}

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<UserSession>()
  const [error, setError] = useState<Error | null>()

  useEffect(() => {
    refreshSession()
  }, [])

  const refreshSession = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/refreshSession`
    )

    const data: AccessTokenResponse | Error = await res.json()

    if (!res.ok && 'message' in data) setError(data)

    if (res.ok && 'accessToken' in data) {
      setUser((prev) => ({ ...prev, accessToken: data.accessToken }))
      setError(null)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    const data: UserApiResponse | Error = await res.json()

    if (!res.ok && 'message' in data) setError(data)

    if (res.ok && 'accessToken' in data) {
      setUser(data)
      setError(null)
    }
  }

  const login = async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data: UserApiResponse | Error = await res.json()

    if (!res.ok && 'message' in data) setError(data)

    if (res.ok && 'accessToken' in data) {
      setUser(data)
      setError(null)
    }
  }

  const logout = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })

    const data: any | Error = await res.json()

    if (!res.ok && 'message' in data) setError(data)

    if (res.ok) {
      setUser(undefined)
      setError(null)
    }
  }

  const updateUserData = async (
    name: string,
    email: string,
    password: string,
    image: string
  ) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.accessToken}`,
      },
      body: JSON.stringify({
        name,
        email,
        password,
        image,
      }),
    })

    const data: UserApiResponse | Error = await res.json()

    if (!res.ok && 'message' in data) setError(data)

    if (res.ok && 'accessToken' in data) {
      setUser(data)
      setError(null)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        refreshSession,
        register,
        login,
        logout,
        updateUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
