import Layout from '@/components/Layout'
import { NextPage } from 'next'
import Image from 'next/image'
import React from 'react'

type Props = {}

const InternalErrorPage: NextPage<Props> = (props) => {
  return (
    <Layout title="Internal Server Error">
      <div className="flex flex-col items-center mt-20">
        <Image src="/images/logo.png" alt="logo" width={140} height={70} />
        <h1 className="text-6xl my-5">Whoops</h1>
        <h2 className="text-4xl text-gray-400">Internal Server Error :(</h2>
      </div>
    </Layout>
  )
}

export default InternalErrorPage
