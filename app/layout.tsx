import Header from '@/components/Header'
import UserProvider from '@/context/UserProvider'
import '@/styles/globals.css'
import { Metadata } from 'next'
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

const RootLayout: FC<RootLayoutProps> = ({ children, modal }) => {
  return (
    <UserProvider>
      <html lang="en">
        <body>
          <Header />
          <ToastProvider>
            <main className="container px-5 mx-auto my-7 max-w-screen-2xl">
              {children}
            </main>
            {modal}
          </ToastProvider>
        </body>
      </html>
    </UserProvider>
  )
}

export default RootLayout
