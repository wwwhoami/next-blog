'use client'

import { useColor } from '@/context/ColorProvider'
import clsx from 'clsx'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const inter = Inter({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  subsets: ['latin'],
})

const Layout = ({ children }: Props) => {
  const { isDarkTheme } = useColor()

  return (
    <html
      lang="en"
      className={clsx(inter.className, isDarkTheme ? 'dark' : 'light')}
      style={isDarkTheme ? { colorScheme: 'dark' } : { colorScheme: 'light' }}
    >
      {children}
    </html>
  )
}

export default Layout
