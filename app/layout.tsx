import Header from '@/components/navHeader/Header'
import ThemeProvider from '@/context/ThemeProvider'
import UserProvider from '@/context/UserProvider'
import '@/styles/globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { FC, ReactNode } from 'react'
import 'react-toastify/dist/ReactToastify.min.css'
import ToastProvider from 'src/context/ToastProvider'

interface RootLayoutProps {
  children: ReactNode
  modal: ReactNode
}

export const metadata: Metadata = {
  title: 'NextBlog',
  keywords: 'development, programming, IT',
  description: 'The next info and news in dev',
}

const inter = Inter({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
  subsets: ['latin'],
})

const RootLayout: FC<RootLayoutProps> = ({ children, modal }) => {
  return (
    <html lang="en" className={`${inter.className}`} suppressHydrationWarning>
      <body className="bg-white text-black dark:text-gray-300 dark:bg-gray-900/[0.97]">
        <UserProvider>
          <ThemeProvider>
            <ToastProvider>
              <Header />
              <main className="mx-auto max-w-screen-2xl">{children}</main>
              {modal}
            </ToastProvider>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}

export default RootLayout
