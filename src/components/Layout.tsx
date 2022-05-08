import Head from 'next/head'
import React, { ReactNode } from 'react'
import Header from './Header'

type Props = {
  title: string
  children: ReactNode
  keywords: string
  description: string
}

const Layout = ({ title, children, keywords, description }: Props) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="keywords" content={keywords} />
        <meta name="description" content={description} />
        <link type="image/x-icon" rel="shortcut icon" href="favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <Header />

      <main className="container mx-auto my-7 px-5 max-w-6xl">{children}</main>
    </div>
  )
}

Layout.defaultProps = {
  title: 'Welcome to NextBlog',
  keywords: 'development, programming, IT',
  description: 'The next info and news in dev',
}

export default Layout
