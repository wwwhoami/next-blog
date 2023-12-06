import PageHeading from '@/components/PageHeading'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Next Blog',
  description: 'This is an about page for Next Blog',
}

export default function AboutPage() {
  return (
    <section className="px-5 mx-auto">
      <PageHeading title="About" />
      <div className="px-10 py-6 mt-6 rounded-lg shadow-md">
        <h2 className="mb-5 text-2xl dark:text-slate-100">NextBlog</h2>
        <p className="mb-3">This is a blog built with NextJs and Markdown</p>
        <p>
          <span className="font-bold dark:text-slate-200">Version 1.0.0</span>
        </p>
      </div>
    </section>
  )
}
