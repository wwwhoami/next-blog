import CategoryLabel from '@/components/CategoryLabel'
import Layout from '@/components/Layout'
import { Post, PostMdx } from '@/types/Post'
import dayjs from 'dayjs'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Image from 'next/image'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import React from 'react'
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
  post: { title, content, createdAt, coverImage, categories, author },
}: Props) => {
  return (
    <Layout title={title}>
      <header className="w-full">
        <Image
          src={coverImage}
          alt="Cover image"
          className="w-full z-1 rounded object-cover text-center"
          width={1200}
          height={420}
        />
        <div className="my-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-5 ">
            <Link href={`/author/${author.name}`} passHref>
              <a>
                <Image
                  src={author.image}
                  alt="Author image"
                  className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block hover:cursor-pointer"
                  width={40}
                  height={40}
                />
              </a>
            </Link>
            <div className="flex flex-col">
              <Link href={`/author/${author.name}`}>
                <a className="text-lg font-medium">{author.name}</a>
              </Link>
              <p className="text-lg font-medium text-gray-400">
                on {dayjs(createdAt).format('DD MMMM, YYYY')}
              </p>
            </div>
            <div className="ml-auto">
              {categories.map((category, index) => (
                <CategoryLabel
                  key={index}
                  name={category.category.name}
                  hexColor={category.category.hexColor}
                />
              ))}
            </div>
          </div>
          <h1 className="mx-auto text-5xl mb-7 font-bold mt-10 max-w-3xl">
            {title}
          </h1>
        </div>
      </header>
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
        createdAt: post.createdAt.toISOString(),
      },
    },
  }
}

export default PostPage
