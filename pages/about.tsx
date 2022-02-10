import Layout from '@/components/Layout'
import { NextPage } from 'next'
import React from 'react'

type Props = {}

const AboutPage: NextPage<Props> = (props) => {
  return (
    <Layout title="About NextBlog">
      <h1 className="text-5xl border-b-4 pb-5 font-bold">About</h1>

      <div className="bg-white shadow-md rounded-lg px-10 py-6 mt-6">
        <h2 className="text-2xl mb-5">NextBlog</h2>
        <p className="mb-3">This is a blog built with NextJs and Markdown</p>

        <p>
          <span className="font-bold">Version 1.0.0</span>
        </p>
      </div>
    </Layout>
  )
}

export default AboutPage
