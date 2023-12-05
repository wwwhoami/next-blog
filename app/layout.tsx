import Header from '@/components/navHeader/Header'
import ColorProvider from '@/context/ColorProvider'
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
      <ColorProvider>
        <body className="dark:text-slate-300 dark:bg-gray-900">
          <Header />
          <ToastProvider>
            <main className="container px-5 mx-auto my-4 max-w-screen-2xl">
              {children}
            </main>
            {modal}
          </ToastProvider>
        </body>
      </ColorProvider>
    </UserProvider>
  )
}

export default RootLayout
