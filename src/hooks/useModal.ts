'use client'

import { useState } from 'react'

export const useModal = (initiallyOpen = false) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)

  const toggle = () => setIsOpen(!isOpen)

  return [isOpen, toggle] as const
}

export default useModal
