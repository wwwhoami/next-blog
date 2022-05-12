import prisma from '@/lib/prisma'

type order = 'asc' | 'desc'

type GetPostsQueryParams = {
  take?: number
  skip?: number
  order?: order
  orderBy?: string
  content?: boolean
}

const selectPostWithAuthorCategories = {
  createdAt: true,
  title: true,
  slug: true,
  excerpt: true,
  viewCount: true,
  coverImage: true,
  author: {
    select: {
      name: true,
      image: true,
    },
  },
  categories: {
    select: {
      category: {
        select: {
          name: true,
          hexColor: true,
        },
      },
    },
  },
}

export async function getPosts(
  take = 10,
  skip = 0,
  order = 'desc',
  orderBy = 'createdAt',
  content = false
) {
  const posts = await prisma.post.findMany({
    select: {
      ...selectPostWithAuthorCategories,
      content,
    },
    where: {
      published: true,
    },
    orderBy: {
      [orderBy]: order,
    },
    skip,
  })

  return posts
}

export async function getPostsSlugs() {
  const slugs = await prisma.post.findMany({
    select: {
      slug: true,
    },
    where: {
      published: true,
    },
  })

  return slugs
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findFirst({
    select: {
      ...selectPostWithAuthorCategories,
      content: true,
    },
    where: {
      slug,
      published: true,
    },
    rejectOnNotFound: true,
  })

  return post
}

export async function deletePostBySlug(slug: string) {
  const post = await prisma.post.delete({
    where: {
      slug,
    },
    select: {
      ...selectPostWithAuthorCategories,
    },
  })

  return post
}

export async function publishPostBySlug(slug: string) {
  const post = prisma.post.update({
    where: {
      slug,
    },
    data: {
      published: true,
    },
    select: {
      ...selectPostWithAuthorCategories,
      content: false,
    },
  })

  return post
}
