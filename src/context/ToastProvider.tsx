'use client'

import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import { useTheme } from './ThemeProvider'

type Props = {
  children: ReactNode
}

export default function ToastProvider({ children }: Props) {
  const { isDarkTheme } = useTheme()

  return (
    <>
      {children}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkTheme ? 'dark' : 'light'}
      />
    </>
  )
}
