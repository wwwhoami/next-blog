import Layout from '@/components/Layout'
import PostHeader from '@/components/PostHeader'
import fetcher from '@/lib/fetcher'
import { PostMdx, PostWithContent } from '@/types/Post'
import 'highlight.js/styles/atom-one-dark.css'
import { GetStaticPaths, GetStaticProps } from 'next'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import Image from 'next/image'
import { ParsedUrlQuery } from 'querystring'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeHighlight from 'rehype-highlight'
import rehypeImgSize from 'rehype-img-size'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'

type Props = {
  post: PostMdx
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
}

const PostPage = ({
  post: {
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
  },
}: Props) => {
  return (
    <Layout title={title}>
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
        <article className="w-full max-w-3xl mx-auto mt-2 prose prose-lg bg-white prose-a:no-underline hover:prose-a:underline prose-a:text-indigo-600">
          <MDXRemote {...content} components={components} />
        </article>
      )}
    </Layout>
  )
}

interface Params extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await fetcher<Array<{ slug: string }>>(
    `${process.env.NEXT_PUBLIC_API_URL}/post/slug`
  )
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

  const post = await fetcher<PostWithContent>(
    `${process.env.NEXT_PUBLIC_API_URL}/post/article/${slug}`
  )

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
        rehypeHighlight as any,
        rehypeCodeTitles,
        rehypeImgSize,
      ],
    },
  })

  return {
    props: {
      post: {
        ...post,
        content: mdxSource,
        readingTimeMinutes,
        createdAt: new Date(post.createdAt).toISOString(),
        updatedAt: new Date(post.updatedAt).toISOString(),
      },
    },
  }
}

export default PostPage
