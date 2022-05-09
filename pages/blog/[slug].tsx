import CategoryLabel from '@/components/CategoryLabel'
import Layout from '@/components/Layout'
import { Frontmatter } from '@/types/Post'
import { getPostFromSlug, getSlugs } from '@/utils/mdx'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Image from 'next/image'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'
import React from 'react'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

type Props = {
  slug: string
  frontmatter: Frontmatter
  content: MDXRemoteSerializeResult<Record<string, unknown>>
}

const PostPage = ({ frontmatter, content, slug }: Props) => {
  const { title, cover_image, author_image, author, date, category } =
    frontmatter

  return (
    <Layout title={title}>
      <header className="w-full">
        <Image
          src={cover_image}
          alt="Cover image"
          className="w-full z-1 rounded object-cover text-center"
          width={1200}
          height={420}
        />
        <div className="my-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-5 ">
            <Link href={`/author/${author}`} passHref>
              <a>
                <Image
                  src={author_image}
                  alt="Author image"
                  className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block hover:cursor-pointer"
                  width={40}
                  height={40}
                />
              </a>
            </Link>
            <div className="flex flex-col">
              <Link href={`/author/${author}`}>
                <a className="text-lg font-medium">{author}</a>
              </Link>
              <p className="text-lg font-medium text-gray-400">on {date}</p>
            </div>
            <div className="ml-auto">
              <CategoryLabel category={category} />
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

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = (await getSlugs()).map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const slug = params!.slug

  const { content, frontmatter } = await getPostFromSlug(slug)

  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
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
      frontmatter,
      content: mdxSource,
      slug,
    },
  }
}

export default PostPage
