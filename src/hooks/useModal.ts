import { useState } from 'react'

export const useModal = (shown = false) => {
  const [isShown, setIsShown] = useState(shown)

  const toggle = () => setIsShown(!isShown)

  return [isShown, toggle] as const
}

export default useModal
