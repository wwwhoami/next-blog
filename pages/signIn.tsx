import Layout from '@/components/Layout'
import SignInForm from '@/components/SignInForm'
import { NextPage } from 'next/types'
import React from 'react'

type Props = {}

const signIn: NextPage<Props> = (props: Props) => {
  return (
    <Layout title="Sign In">
      <div className="flex items-center justify-center flex-col">
        <div className="mt-32 p-10 bg-slate-50 rounded-2xl">
          <h1 className="text-3xl font-bold mb-10">Sign In</h1>
          <SignInForm />
        </div>
      </div>
    </Layout>
  )
}

export default signIn
