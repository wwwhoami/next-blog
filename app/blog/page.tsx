import fetcher from '@/lib/fetcher'
import { Post } from '@/types/Post'
import { Metadata } from 'next'
import BlogPage from './blogPage'

export const metadata: Metadata = {
  title: 'Browse posts',
  description: 'Page to browse posts',
}

type SearchParams = {
  searchQuery?: string
  category?: string
}

type Props = {
  searchParams: SearchParams
}

async function getPosts(query: SearchParams) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/post?${
    query.searchQuery ? `searchTerm=${query.searchQuery}&` : ''
  }${query.category ? `category=${query.category}` : ''}`

  const posts = await fetcher<Post[]>(url, { cache: 'no-store' })

  return [posts]
}

export default async function Page({ searchParams }: Props) {
  const fallbackData = await getPosts(searchParams)

  return <BlogPage fallbackData={fallbackData} />
}
