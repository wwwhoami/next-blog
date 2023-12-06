import PostHeader from '@/components/post/PostHeader'
import fetcher from '@/lib/fetcher'
import { PostWithContent } from '@/types/Post'
import clsx from 'clsx'
import 'highlight.js/styles/atom-one-dark.css'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import Link from 'next/link'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeHighlight from 'rehype-highlight'
import rehypeImgSize from 'rehype-img-size'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'

export const metadata: Metadata = {
  title: 'About Next Blog',
  description: 'This is an about page for Next Blog',
}

type Props = {
  params: { slug: string }[]
}

const components = {
  img: (props: any) => (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      width={1200}
      height={420}
      layout="responsive"
      loading="lazy"
      {...props}
    />
  ),
  a: (props: any) => (
    <Link
      {...props}
      className={clsx(props.className, 'rounded-lg focus-ring')}
    />
  ),
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params as any)
  const {
    title,
    content,
    coverImage,
    categories,
    author,
    excerpt,
    readingTimeMinutes,
    createdAt,
    updatedAt,
    likesCount,
  } = post

  return (
    <section className="max-w-full bg-gray-50 dark:bg-zinc-800/90">
      <PostHeader
        postHeader={{
          title,
          coverImage,
          categories,
          author,
          excerpt,
          readingTimeMinutes,
          createdAt,
          updatedAt,
          likesCount,
        }}
      />
      {content && (
        <article className="relative w-full max-w-screen-md px-4 mx-auto mt-2 prose prose-lg lg:px-0 dark:prose-invert prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline">
          <MDXRemote
            source={content}
            options={
              (post.content,
              {
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
                    rehypeHighlight as any,
                    rehypeCodeTitles,
                    rehypeImgSize,
                  ],
                },
              })
            }
            components={components}
          />
        </article>
      )}
    </section>
  )
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await fetcher<Array<{ slug: string }>>(
    `${process.env.NEXT_PUBLIC_API_URL}/post/slug`,
  )

  return slugs
}

async function getPost(params: { slug: string }) {
  const slug = params.slug

  const post = await fetcher<PostWithContent>(
    `${process.env.NEXT_PUBLIC_API_URL}/post/article/${slug}`,
  )

  const readingTimeMinutes = Math.round(readingTime(post.content).minutes)

  return {
    ...post,
    readingTimeMinutes,
    createdAt: new Date(post.createdAt).toISOString(),
    updatedAt: new Date(post.updatedAt).toISOString(),
  }
}
