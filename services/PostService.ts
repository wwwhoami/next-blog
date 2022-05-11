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

async function getPostsFrontmatter(
  limit: number = 10,
  offset: number = 0,
  order: order = 'desc',
  orderBy: string = 'createdAt'
) {
  try {
    const posts = await prisma.$queryRaw<Post[]>`
    SELECT
      P.created_at as "createdAt",
      P.title,
      P.slug,
      P.excerpt,
      P.view_count AS "viewCount",
      P.cover_image AS "coverImage",
      U.name AS "authorName",
      U.image AS "authorImage",
      PC.name AS category,
      PC.hex_color AS "hexColor"
    FROM
      "Post" AS P
    JOIN "User" AS U ON U.id = P.author_id
    JOIN (
      SELECT
          PTC.post_id,
          C.name,
          C.hex_color
      FROM
          "PostToCategory" AS PTC
      JOIN "Category" AS C ON C.name = PTC.category_name
    ) AS PC ON PC.post_id = P.id
    WHERE P.published = TRUE
    ORDER BY ${orderBy} ${order} 
    LIMIT ${limit} OFFSET ${offset}`

    return posts
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(error.message)
    }
    throw error
  }
}

async function getPostBySlug(slug: string) {
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
