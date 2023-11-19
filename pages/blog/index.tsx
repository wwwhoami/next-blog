import CategorySelect from '@/components/CategorySelect'
import Layout from '@/components/Layout'
import PostCard from '@/components/PostCard'
import { fetchPosts } from '@/lib/fetchPost'
import { Post } from '@/types/Post'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { useInfiniteLoading } from 'src/hooks/useInfiniteLoading'

type Props = {
  fallbackData: Post[][]
}

const PAGE_SIZE = 8

const getKey = (
  pageIndex: number,
  previousPageData: Post[],
  searchQuery?: string,
  category?: string
) => {
  if (previousPageData && !previousPageData.length) return null

  return `${process.env.NEXT_PUBLIC_API_URL}/post?${
    searchQuery ? `searchTerm=${searchQuery}&` : ''
  }${category ? `category=${category}&` : ''}take=${PAGE_SIZE}&skip=${
    pageIndex * PAGE_SIZE
  }`
}

const BlogPage: NextPage<Props> = ({ fallbackData }: Props) => {
  const router = useRouter()
  const { searchQuery, category } = router.query

  const { ref, isLoadingMore, isRefreshing, data, isEmpty } =
    useInfiniteLoading(
      (...args) => getKey(...args, searchQuery as string, category as string),
      fetchPosts,
      fallbackData
    )

  const posts = data?.flatMap((page) => page) ?? []

  return (
    <Layout>
      <h1 className="p-3 text-4xl font-semibold border-b-4">Posts</h1>
      <CategorySelect />

      {isEmpty && (
        <div className="flex flex-col items-center mt-20">
          <h1 className="my-5 text-6xl">Whoops</h1>
          <h2 className="text-4xl text-gray-400">No posts found :(</h2>
        </div>
      )}
      <div className="grid gap-5 my-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div ref={ref}></div>
    </Layout>
  )
}

export default BlogPage

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/post?${
    query.searchQuery ? `searchTerm=${query.searchQuery}&` : ''
  }${query.category ? `category=${query.category}` : ''}`

  const posts = await fetchPosts(url)

  return {
    props: {
      fallbackData: [posts],
    },
  }
}
