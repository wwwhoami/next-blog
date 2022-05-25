import Layout from '@/components/Layout'
import SignUpForm from '@/components/SignUpForm'
import { NextPage } from 'next/types'
import React from 'react'

type Props = {}

const signUp: NextPage<Props> = (props: Props) => {
  return (
    <Layout title="Sign Up">
      <div className="flex items-center justify-center flex-col">
        <div className="mt-32 p-10 bg-slate-50 rounded-2xl">
          <h1 className="text-3xl font-bold mb-10">Sign Up</h1>
          <SignUpForm />
        </div>
      </div>
    </Layout>
  )
}

export default signUp
