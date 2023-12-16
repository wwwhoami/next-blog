'use client'

import { useUser } from '@/context/UserProvider'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function withAuth<T>(Component: React.FC<T>) {
  return function AuthenticatedComponent(props: React.PropsWithChildren<T>) {
    const router = useRouter()
    const { user, isLoading } = useUser()
    // If user is undefined, we are not logged in
    // If user isLoading, we are waiting for the auth response from the server
    const isLoggedIn = user !== undefined || isLoading

    useEffect(() => {
      // If we are not logged in, redirect to /signIn
      if (!isLoggedIn) {
        router.replace('/signIn')
      }
    }, [isLoggedIn, router])

    // ? Perhaps add some loading component later...
    return isLoggedIn ? <Component {...props} /> : null
  }
}
