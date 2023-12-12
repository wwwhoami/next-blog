'use client'

import { createContext, memo, useContext, useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
}

type ThemeContext = {
  isDarkTheme?: boolean
  changeTheme: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContext | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider')
  }

  return context
}

export default function ThemeProvider({ children }: Props) {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false)

  const changeTheme = (isDark: boolean) => {
    setIsDarkTheme(isDark)

    // Get the DOM root element
    const d = window.document.documentElement

    // Add or remove the "dark" class based on if the media query matches
    if (isDark) {
      d.classList.add('dark')
    } else {
      d.classList.remove('dark')
    }

    // Update the color scheme meta tag
    d.style.colorScheme = isDark ? 'dark' : 'light'
  }

  // Set the initial theme based on the user's OS preference
  useEffect(() => {
    const initialState = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches

    changeTheme(initialState)
  }, [])

  return (
    <ThemeContext.Provider value={{ isDarkTheme, changeTheme }}>
      <ThemeScript />
      {children}
    </ThemeContext.Provider>
  )
}

// Used to set the initial theme based on the user's OS preference
// to prevent the flash of light theme on page load when the user
// prefers dark color scheme
const ThemeScript = memo(
  function ThemeScript() {
    const themeScript = () => {
      try {
        const isDarkMode = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches
        const d = document.documentElement

        if (isDarkMode) {
          d.classList.add('dark')
        } else {
          d.classList.remove('dark')
        }

        d.style.colorScheme = isDarkMode ? 'dark' : 'light'
      } catch (e) {
        console.error(e)
      }
    }

    // Wrap in Immediately Invoked Function Expression (IIFE)
    const codeToRunOnClient = `(${themeScript.toString()})()`

    return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
  },
  () => true,
)
