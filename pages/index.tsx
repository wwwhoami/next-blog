import Layout from '@/components/Layout'
import PostCard from '@/components/PostCard'
import { Post } from '@/types/Post'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'

type Props = {
  posts: Post[]
}

const Home: NextPage<Props> = ({ posts }) => {
  return (
    <Layout>
      <h1 className="text-4xl border-b-4 p-3 font-semibold">Latest Posts</h1>
      <div className="grid my-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {posts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </div>

      <Link href="/blog">
        <a className="mt-8 block text-center border border-gray-500 text-gray-800 rounded-md py-4 my-5 transition duration-500 ease select-none hover:text-white hover:bg-gray-900 focus:outline-none focus:shadow-outline w-full">
          All posts
        </a>
      </Link>
    </Layout>
  )
}

export default Home

export const getStaticProps: GetStaticProps<Props> = async () => {
  const url = process.env.NEXT_PUBLIC_API_URL + '/post'
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(await res.json())
  }

  const posts: Post[] = await res.json()

  return {
    props: {
      posts,
    },
  }
}
