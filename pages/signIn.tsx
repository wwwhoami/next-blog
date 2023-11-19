import Layout from '@/components/Layout'
import SignInForm from '@/components/SignInForm'
import { NextPage } from 'next/types'
import React from 'react'

type Props = {}

const SignIn: NextPage<Props> = (props: Props) => {
  return (
    <Layout title="Sign In">
      <div className="flex flex-col items-center justify-center">
        <div className="p-10 mt-32 bg-slate-50 rounded-2xl">
          <h1 className="mb-10 text-3xl font-bold">Sign In</h1>
          <SignInForm />
        </div>
      </div>
    </Layout>
  )
}

export default SignIn
