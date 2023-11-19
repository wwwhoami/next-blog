import Layout from '@/components/Layout'
import SignUpForm from '@/components/SignUpForm'
import { NextPage } from 'next/types'
import React from 'react'

type Props = {}

const SignUp: NextPage<Props> = (props: Props) => {
  return (
    <Layout title="Sign Up">
      <div className="flex flex-col items-center justify-center">
        <div className="p-10 mt-32 bg-slate-50 rounded-2xl">
          <h1 className="mb-10 text-3xl font-bold">Sign Up</h1>
          <SignUpForm />
        </div>
      </div>
    </Layout>
  )
}

export default SignUp
