import { Frontmatter } from '@/types/Post'
import { Prisma } from '@prisma/client'
import { userData } from 'data/seedData'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import slugify from 'slugify'
import { getPostFromSlugForDb, getSlugs } from './mdx'

type PostFromFile = Frontmatter & {
  content: string
  slug: string
}

dayjs.extend(utc)

export async function getPostData() {
  const slugs = await getSlugs()

  const posts: PostFromFile[] = []
  for (let slug of slugs) {
    let { frontmatter, content } = await getPostFromSlugForDb(slug)
    posts.push({ ...frontmatter, slug, content })
  }

  const postData: Prisma.PostCreateInput[] = posts.map((post) => ({
    createdAt: dayjs.utc(post.date, 'YYYY-MM-DD').format(),
    title: post.title,
    slug: slugify(post.title, { lower: true }),
    excerpt: post.excerpt,
    content: post.content,
    published: true,
    coverImage: post.cover_image,
    author: {
      connect: {
        id: userData.findIndex((user) => user.name === post.author) + 1,
      },
    },
    categories: {
      create: {
        category: {
          connect: {
            name: post.category,
          },
        },
      },
    },
  }))

  return postData
}
