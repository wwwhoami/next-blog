import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

type order = 'asc' | 'desc'
type Post = {
  createdAt: Date
  title: string
  slug: string
  excerpt: string
  viewCount: string
  coverImage: string
  authorName: string
  authorImage: string
  category: string
  hexColor: string
}
type GetPostsQueryParams = {
  take?: number
  skip?: number
  order?: order
  orderBy?: string
  content?: boolean
}

export async function getPosts({
  take = 10,
  skip = 0,
  order = 'desc',
  orderBy = 'createdAt',
  content = false,
}: GetPostsQueryParams) {
  try {
    const posts = await prisma.post.findMany({
      select: {
        createdAt: true,
        title: true,
        slug: true,
        excerpt: true,
        content,
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
      },
      where: {
        published: true,
      },
      orderBy: {
        [orderBy]: order,
      },
      skip,
      take,
    })

    return posts
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message)
    }
    throw error
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findFirst({
      select: {
        createdAt: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
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
      },
      where: {
        published: true,
      },
    })

    return post
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message)
    }
    throw error
  }
}
