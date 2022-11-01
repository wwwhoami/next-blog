import Layout from '@/components/Layout'
import PostHeader from '@/components/PostHeader'
import { PostMdx } from '@/types/Post'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Image from "next/legacy/image";
import { ParsedUrlQuery } from 'querystring'
import React from 'react'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import { getPostBySlug, getPostsSlugs } from 'services/PostService'

type Props = {
  post: PostMdx
}

const PostPage = ({
  post: {
    title,
    content,
    createdAt,
    coverImage,
    categories,
    author,
    excerpt,
    readingTimeMinutes,
  },
}: Props) => {
  return (
    <Layout title={title}>
      <PostHeader
        postHeader={{
          title,
          createdAt,
          coverImage,
          categories,
          author,
          excerpt,
          readingTimeMinutes,
        }}
      />
      {content && (
        <article className="w-full bg-white mt-2 max-w-3xl mx-auto prose prose-lg prose-a:no-underline hover:prose-a:underline prose-a:text-indigo-600">
          <MDXRemote {...content} components={{ Image }} />
        </article>
      )}
    </Layout>
  )
}

interface Params extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getPostsSlugs()
  const paths = slugs.map((slug) => ({ params: { ...slug } }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const slug = params!.slug

  const post = await getPostBySlug(slug)

  const readingTimeMinutes = Math.round(readingTime(post.content).minutes)

  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSanitize,
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
          },
        ],
        rehypeHighlight,
        rehypeCodeTitles,
      ],
    },
  })

  return {
    props: {
      post: {
        ...post,
        content: mdxSource,
        readingTimeMinutes,
        createdAt: post.createdAt.toISOString(),
      },
    },
  }
}

export default PostPage
