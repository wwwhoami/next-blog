import prisma from '@/lib/prisma'

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    select: {
      name: true,
      hexColor: true,
    },
  })

  return categories
}

export async function getCategoryCombinations() {
  const categoryComb: Record<'category_list', string>[] =
    await prisma.$queryRaw`
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
FROM
    T`

  const categoryLists = categoryComb.map((category) =>
    category.category_list.split(',')
  )

  return categoryLists
}
