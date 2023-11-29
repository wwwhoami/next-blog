'use client'

import { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'

type Props = {
  children: ReactNode
}

export default function ToastProvider({ children }: Props) {
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
      />
    </>
  )
}
