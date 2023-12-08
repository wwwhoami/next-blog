'use client'

import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import { useColor } from './ColorProvider'

type Props = {
  children: ReactNode
}

export default function ToastProvider({ children }: Props) {
  const { isDarkTheme } = useColor()

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
