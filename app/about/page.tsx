import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Next Blog',
  description: 'This is an about page for Next Blog',
}

export default function AboutPage() {
  return (
    <>
      <h1 className="border-b-4 pb-5 text-5xl font-bold">About</h1>
      <div className="mt-6 rounded-lg bg-white px-10 py-6 shadow-md">
        <h2 className="mb-5 text-2xl">NextBlog</h2>
        <p className="mb-3">This is a blog built with NextJs and Markdown</p>
        <p>
          <span className="font-bold">Version 1.0.0</span>
        </p>
      </div>
    </>
  )
}
