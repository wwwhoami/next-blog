import React, { useEffect, useRef, useState } from 'react'
import fs from 'fs'
import path from 'path'
import { GetStaticPaths, GetStaticProps } from 'next'
import { frontmatter } from '@/types/Post'
import { ParsedUrlQuery } from 'querystring'
import matter from 'gray-matter'
import Layout from '@/components/Layout'
import Link from 'next/link'
import Image from 'next/image'
import CategoryLabel from '@/components/CategoryLabel'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

type Props = {
  slug: string
  frontmatter: frontmatter
  content: string
}

const PostPage = ({ frontmatter, content, slug }: Props) => {
  const { title, cover_image, author_image, author, date, category } =
    frontmatter
  const [cleanContent, setCleanContent] = useState('')

  useEffect(() => {
    setCleanContent(DOMPurify.sanitize(content))
  }, [content])

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
      {cleanContent && (
        <article
          className="w-full bg-white rounded-lg mt-2 max-w-3xl mx-auto blog-post"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        ></article>
      )}
    </Layout>
  )
}

interface Params extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const files = fs.readdirSync(path.join('posts'))

  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.md', ''),
    },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  const slug = params!.slug

  const markdownWithMeta = fs.readFileSync(
    path.join('posts', slug + '.md'),
    'utf-8'
  )

  let { data, content } = matter(markdownWithMeta)
  const frontmatter = data as frontmatter

  content = marked(content)

  return {
    props: {
      frontmatter,
      content,
      slug,
    },
  }
}

export default PostPage
