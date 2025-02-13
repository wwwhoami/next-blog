'use client'

import { useRouter } from 'next/navigation'
import { FC, ReactNode } from 'react'
import ModalDialog from './ModalDialog'

type Props = {
  title?: string
  children: ReactNode
}

const AuthModal: FC<Props> = ({ title, children }) => {
  const router = useRouter()

  return (
    <ModalDialog title={title} isOpen onClose={() => router.back()}>
      {children}
    </ModalDialog>
  )
}

export default AuthModal
