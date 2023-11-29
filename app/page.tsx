import fetcher from '@/lib/fetcher'
import { Post } from '@/types/Post'
import { Metadata } from 'next'
import HomePage from './homePage'

export const metadata: Metadata = {
  title: 'NextBlog',
  keywords: 'development, programming, IT',
  description: 'The next info and news in dev',
}

type Props = {
  fallbackData: Post[][]
}

const PAGE_SIZE = 8

async function getPosts(): Promise<{ fallbackData: Post[][] }> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/post?take=${PAGE_SIZE}&skip=0`

  const posts = await fetcher<Post[]>(url)

  return {
    fallbackData: [posts],
  }
}

export default async function Page() {
  const { fallbackData } = await getPosts()

  return <HomePage fallbackData={fallbackData} />
}
