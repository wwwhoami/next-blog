import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getPostIds } from './PostService'

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      hexColor: true,
    },
  })

  return categories
}

export async function getCategoriesForPostSearchterm(search: string) {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      hexColor: true,
    },
    where: {
      PostToCategory: {
        some: {
          post: {
            published: true,
            OR: [
              {
                title: {
                  search,
                },
              },
              {
                excerpt: {
                  search,
                },
              },
            ],
          },
        },
      },
    },
  })

  return categories
}

export async function getCategoryCombinations(searchQuery?: string) {
  let categoryComb: Record<'category_list', string>[] = []
  let postIds: number[] = []

  if (searchQuery) {
    postIds = (await getPostIds({ searchQuery, take: undefined })).map(
      (post) => post.id
    )
    if (postIds.length) {
      categoryComb = await prisma.$queryRaw`
        WITH T AS (
          SELECT
              "public"."PostToCategory"."post_id",
              STRING_AGG (category_name, ',') category_list
          FROM
              "public"."PostToCategory"
          WHERE "public"."PostToCategory"."post_id" IN (${Prisma.join(postIds)})
          GROUP BY
              "public"."PostToCategory"."post_id"
        )
        SELECT
            DISTINCT T.category_list
        FROM T`
    }
  } else {
    categoryComb = await prisma.$queryRaw`
      WITH T AS (
        SELECT
            "public"."PostToCategory"."post_id",
            STRING_AGG (category_name, ',') category_list
        FROM
            "public"."PostToCategory"
        GROUP BY
            "public"."PostToCategory"."post_id"
      )
      SELECT
          DISTINCT T.category_list
      FROM T`
  }

  const categoryLists = categoryComb.map((category) =>
    category.category_list.split(',')
  )

  return categoryLists
}
