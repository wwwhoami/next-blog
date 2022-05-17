import CategorySelect from '@/components/CategorySelect'
import Layout from '@/components/Layout'
import PostCard from '@/components/PostCard'
import { fetchPosts } from '@/lib/fetchPost'
import { Post } from '@/types/Post'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { useInfiniteLoading } from 'src/hooks/useInfiniteLoading'

type Props = {}

const PAGE_SIZE = 8

const getKey = (
  pageIndex: number,
  previousPageData: Post[],
  searchQuery?: string,
  category?: string
) => {
  if (previousPageData && !previousPageData.length) return null

  return `${process.env.NEXT_PUBLIC_API_URL}post/search?${
    searchQuery ? `searchQuery=${searchQuery}&` : ''
  }${category ? `category=${category}&` : ''}take=${PAGE_SIZE}&skip=${
    pageIndex * PAGE_SIZE
  }`
}

const BlogPage: NextPage<Props> = (props) => {
  const router = useRouter()
  const query = router.query

  const { ref, isLoadingMore, isRefreshing, data, isEmpty } =
    useInfiniteLoading(
      (...args) =>
        getKey(...args, query.searchQuery as string, query.category as string),
      fetchPosts
    )

  const posts = data?.flatMap((page) => page) ?? []

  return (
    <Layout>
      <h1 className="text-4xl border-b-4 p-3 font-semibold">Posts</h1>
      <CategorySelect />

      {isEmpty && (
        <div className="flex flex-col items-center mt-20">
          <h1 className="text-6xl my-5">Whoops</h1>
          <h2 className="text-4xl text-gray-400">No posts found :(</h2>
        </div>
      )}
      <div className="grid my-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {posts?.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </div>

      <div ref={ref}></div>
    </Layout>
  )
}

export default BlogPage
