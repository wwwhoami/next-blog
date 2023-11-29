'use client'

import CategorySelect from '@/components/category/CategorySelect'
import PostCard from '@/components/post/PostCard'
import fetcher from '@/lib/fetcher'
import { Post } from '@/types/Post'
import { useSearchParams } from 'next/navigation'
import { useInfiniteLoading } from 'src/hooks/useInfiniteLoading'

const PAGE_SIZE = 8

const getKey = (
  pageIndex: number,
  previousPageData: Post[],
  searchQuery?: string,
  category?: string,
) => {
  if (previousPageData && !previousPageData.length) return null

  return `${process.env.NEXT_PUBLIC_API_URL}/post?${
    searchQuery ? `searchTerm=${searchQuery}&` : ''
  }${category ? `category=${category}&` : ''}take=${PAGE_SIZE}&skip=${
    pageIndex * PAGE_SIZE
  }`
}

type Props = {
  fallbackData: Post[][]
}

export default function BlogPage({ fallbackData }: Props) {
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get('searchQuery') ?? ''
  const category = searchParams.get('category') ?? ''

  const { ref, data, isEmpty } = useInfiniteLoading(
    (...args) => getKey(...args, searchQuery, category),
    fetcher,
    fallbackData,
  )

  const posts = data?.flatMap((page) => page) ?? []

  return (
    <>
      <h1 className="border-b-4 p-3 text-4xl font-semibold">Posts</h1>
      <CategorySelect />
      {isEmpty && (
        <div className="mt-20 flex flex-col items-center">
          <h1 className="my-5 text-6xl">Whoops</h1>
          <h2 className="text-4xl text-gray-400">No posts found :(</h2>
        </div>
      )}
      <div className="my-3 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts?.map((post) => <PostCard key={post.id} post={post} />)}
      </div>
      <div ref={ref}></div>
    </>
  )
}
