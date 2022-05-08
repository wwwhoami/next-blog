import Layout from '@/components/Layout'
import PostCard from '@/components/PostCard'
import { frontmatter } from '@/types/Post'
import { sortByDate } from '@/utils/post'
import fs from 'fs'
import matter from 'gray-matter'
import type { GetStaticProps, NextPage } from 'next'
import Link from 'next/link'
import path from 'path'

type Props = {
  posts: {
    slug: string
    frontmatter: frontmatter
  }[]
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
  const files = fs.readdirSync(path.join('posts'))

  const posts = files.map((filename) => {
    const slug = filename.slice(0, -3)

    const mardkDownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    )

    const { data } = matter(mardkDownWithMeta)
    const frontmatter = data as frontmatter

    return {
      slug,
      frontmatter,
    }
  })

  return {
    props: {
      posts: posts.sort(sortByDate).slice(0, 6),
    },
  }
}
