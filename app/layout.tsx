import Layout from '@/components/Layout'
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
        <Layout>
          <body className="bg-white text-black dark:text-gray-300 dark:bg-gray-900/[0.97]">
            <Header />
            <ToastProvider>
              <main className="mx-auto max-w-screen-2xl">{children}</main>
              {modal}
            </ToastProvider>
          </body>
        </Layout>
      </ColorProvider>
    </UserProvider>
  )
}

export default RootLayout
