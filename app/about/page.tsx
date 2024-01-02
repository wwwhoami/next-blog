import PageHeading from '@/components/PageHeading'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Next Blog',
  description: 'This is an about page for Next Blog',
}

export default function AboutPage() {
  return (
    <section className="mx-auto px-5">
      <PageHeading title="About" />
      <div className="mt-6 rounded-lg px-10 py-6 shadow-md">
        <h2 className="mb-5 text-2xl dark:text-slate-100">NextBlog</h2>
        <p className="mb-3">This is a blog built with NextJs and Markdown</p>
        <p>
          <span className="font-bold dark:text-slate-200">Version 1.0.0</span>
        </p>
      </div>
    </section>
  )
}
