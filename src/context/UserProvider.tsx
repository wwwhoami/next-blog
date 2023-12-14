'use client'

import fetcher from '@/lib/fetcher'
import { UserProfileResponse, UserSession } from '@/types/User'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type UserContext = {
  user?: UserSession
  error?: Error | null
  isLoading: boolean
  refreshSession: () => Promise<string | undefined>
  setUser: Dispatch<SetStateAction<UserSession | undefined>>
  setError: Dispatch<SetStateAction<Error | undefined | null>>
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const UserContext = createContext<UserContext | undefined>(undefined)

UserContext.displayName = 'UserContext'

export function useUser() {
  const context = useContext(UserContext)

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}

type AccessTokenResponse = {
  accessToken: string
}

type Props = {
  children: ReactNode
}

function UserProvider({ children }: Props) {
  const [user, setUser] = useState<UserSession>()
  const [error, setError] = useState<Error | null>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getCurrentUserData = useCallback(async (accessToken: string) => {
    try {
      setIsLoading(true)
      const userResponse = await fetcher<UserProfileResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      setUser((prev) => ({
        ...userResponse,
        accessToken: prev?.accessToken,
      }))
      setIsLoading(false)
      setError(undefined)
    } catch (err: any) {
      setIsLoading(false)
      setError(err)
    }
  }, [])

  const refreshSession = useCallback(
    async (refetchProfile: boolean = false) => {
      try {
        setIsLoading(true)
        const accessTokenReponse = await fetcher<AccessTokenResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            credentials: 'include',
          },
        )

        setUser((prev) => ({
          ...prev,
          accessToken: accessTokenReponse.accessToken,
        }))
        setIsLoading(false)
        setError(undefined)

        if (refetchProfile) {
          await getCurrentUserData(accessTokenReponse.accessToken)
        }

        return accessTokenReponse.accessToken
      } catch (err: any) {
        setIsLoading(false)
        setError(err)
      }
    },
    [getCurrentUserData],
  )

  useEffect(() => {
    let ignore = false

    if (!ignore) {
      refreshSession(true)
    }

    return () => {
      ignore = true
    }
  }, [refreshSession])

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        isLoading,
        refreshSession,
        setUser,
        setError,
        setIsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
