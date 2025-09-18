import PostHeader from '@/components/post/PostHeader'
import PostPre from '@/components/post/PostPre'
import fetcher from '@/lib/fetcher'
import { PostWithContent } from '@/types/Post'
import clsx from 'clsx'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import Link from 'next/link'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeImgSize from 'rehype-img-size'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import { visit } from 'unist-util-visit'

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
      className={clsx(props.className, 'rounded-lg focus-ring-primary')}
    />
  ),
  div: (props: any) =>
    props['data-rehype-pretty-code-fragment'] != null ? (
      props.children
    ) : (
      <div {...props} />
    ),
  pre: (props: any) => <PostPre {...props} />,
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
    <section className="w-full max-w-full bg-gray-50 dark:bg-zinc-800/90">
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
        <article className="article">
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
                    // extract raw code from all code elements inside pre
                    // and forward it to pretty code in raw property
                    () => (tree) => {
                      visit(tree, (node) => {
                        if (
                          node?.type === 'element' &&
                          node?.tagName === 'pre'
                        ) {
                          const [codeEl] = node.children

                          if (codeEl.tagName !== 'code') return

                          node.raw = codeEl.children?.[0].value
                        }
                      })
                    },
                    [
                      rehypePrettyCode,
                      {
                        // will create two div elements with dark and light themes respectively
                        theme: { dark: 'one-dark-pro', light: 'github-light' },
                      },
                    ],
                    // forward raw property to both pretty code div elements
                    () => (tree) => {
                      visit(tree, (node) => {
                        if (
                          node?.type === 'element' &&
                          node?.tagName === 'div'
                        ) {
                          if (
                            !(
                              'data-rehype-pretty-code-fragment' in
                              node.properties
                            )
                          ) {
                            return
                          }

                          for (const child of node.children) {
                            if (child.tagName === 'pre') {
                              child.properties['raw'] = node.raw
                            }
                          }
                        }
                      })
                    },
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
