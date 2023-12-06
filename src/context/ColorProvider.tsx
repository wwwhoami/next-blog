'use client'

import clsx from 'clsx'
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

type Props = {
  children: React.ReactNode
}

type ColorContext = {
  isDarkTheme?: boolean
  setIsDarkTheme: Dispatch<SetStateAction<boolean>>
}

const ColorContext = createContext<ColorContext | undefined>(undefined)

export function useColor() {
  const context = useContext(ColorContext)

  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider')
  }

  return context
}

export default function ColorProvider({ children }: Props) {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false)

  useEffect(() => {
    const initialState = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    setIsDarkTheme(initialState)
  }, [])

  return (
    <ColorContext.Provider value={{ isDarkTheme, setIsDarkTheme }}>
        {children}
    </ColorContext.Provider>
  )
}
