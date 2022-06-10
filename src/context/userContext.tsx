import { UserApiResponse, UserSession } from '@/types/User'
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'

type UserContext = {
  user?: UserSession
  error?: Error | null
  refreshSession: () => Promise<void>
  setUser: Dispatch<SetStateAction<UserSession | undefined>>
  setError: Dispatch<SetStateAction<Error | null | undefined>>
}

const UserContext = createContext<UserContext>(undefined!)

UserContext.displayName = 'UserContext'

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

function UserProvider({ children }: Props) {
  const [user, setUser] = useState<UserSession>()
  const [error, setError] = useState<Error | null>()

  useEffect(() => {
    refreshSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      await getCurrentUserData(data.accessToken)
    }
  }

  const getCurrentUserData = async (accessToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data: UserApiResponse | Error = await res.json()

    if (!res.ok && 'message' in data) setError(data)

    if (res.ok && 'user' in data) {
      setUser((prev) => ({ ...prev, user: data.user }))
      setError(null)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        refreshSession,
        setUser,
        setError,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
