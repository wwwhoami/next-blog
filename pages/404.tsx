import Layout from '@/components/Layout'
import { NextPage } from 'next'
import Image from 'next/image'
import React from 'react'

type Props = {}

const NotFoundPage: NextPage<Props> = (props) => {
  return (
    <Layout title="Page Not Found">
      <div className="flex flex-col items-center mt-20">
        <Image src="/images/logo.png" alt="logo" width={140} height={70} />
        <h1 className="my-5 text-6xl">Whoops</h1>
        <h2 className="text-4xl text-gray-400">This page does not exist :(</h2>
      </div>
    </Layout>
  )
}

export default NotFoundPage
