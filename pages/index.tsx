import Layout from '@/components/Layout'
import PostCard from '@/components/PostCard'
import { fetchPosts } from '@/lib/fetchPost'
import { Post } from '@/types/Post'
import { GetStaticProps, NextPage } from 'next'
import { useInfiniteLoading } from 'src/hooks/useInfiniteLoading'
import { SWRInfiniteKeyLoader } from 'swr/infinite/dist/infinite/types'

type Props = {
  fallbackData: Post[][]
}

const PAGE_SIZE = 8

const getKey: SWRInfiniteKeyLoader = (
  pageIndex: number,
  previousPageData: Post[]
) => {
  if (previousPageData && !previousPageData.length) return null

  return `${process.env.NEXT_PUBLIC_API_URL}post?take=${PAGE_SIZE}&skip=${
    pageIndex * PAGE_SIZE
  }`
}

const Home: NextPage<Props> = ({ fallbackData }) => {
  const { ref, isLoadingInitialData, isLoadingMore, isRefreshing, data } =
    useInfiniteLoading(getKey, fetchPosts, fallbackData)
  const posts = data?.flatMap((page) => page) ?? []

  return (
    <Layout>
      <h1 className="text-4xl border-b-4 p-3 font-semibold">Latest Posts</h1>
      <div className="grid my-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div ref={ref}>
        {isLoadingMore ? 'Loading...' : isRefreshing ? 'Refreshing...' : ''}
      </div>
    </Layout>
  )
}

export default Home

export const getStaticProps: GetStaticProps<Props> = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}post?take=${PAGE_SIZE}&skip=0`

  const posts = await fetchPosts(url)

  return {
    props: {
      fallbackData: [posts],
    },
  }
}
