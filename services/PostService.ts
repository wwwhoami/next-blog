import prisma from '@/lib/prisma'
type order = 'asc' | 'desc'

type GetPostsQueryParams = {
  take?: number
  skip?: number
  order?: order
  orderBy?: string
  content?: boolean
  searchQuery?: string
}

type GetPostsByCategoriesQueryParams = GetPostsQueryParams & {
  category?: string
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

export async function getPostIds({
  take = undefined,
  skip = 0,
  order = 'desc',
  orderBy = 'createdAt',
  content = false,
  searchQuery,
}: GetPostsQueryParams) {
  const search = searchQuery ? searchQuery.split(' ').join(' & ') : undefined

  let posts

  if (!search) {
    posts = await prisma.post.findMany({
      select: {
        id: true,
      },
      where: {
        published: true,
      },
      orderBy: {
        [orderBy]: order,
      },
      take,
      skip,
    })
  } else {
    posts = await prisma.post.findMany({
      select: {
        id: true,
      },
      where: {
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
      take,
      skip,
    })
  }

  return posts
}

export async function getPosts({
  take = 10,
  skip = 0,
  order = 'desc',
  orderBy = 'createdAt',
  content = false,
  searchQuery,
}: GetPostsQueryParams) {
  const search = searchQuery ? searchQuery.split(' ').join(' & ') : undefined

  let posts

  if (typeof search === 'undefined') {
    posts = await prisma.post.findMany({
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
      take,
      skip,
    })
  } else {
    posts = await prisma.post.findMany({
      select: {
        ...selectPostWithAuthorCategories,
        content,
      },
      where: {
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
      orderBy: [
        {
          _relevance: {
            fields: ['title', 'excerpt'],
            search,
            sort: order,
          },
        },
        {
          [orderBy]: order,
        },
      ],
      take,
      skip,
    })
  }

  return posts
}

export async function getPostsByCategories({
  take = 10,
  skip = 0,
  order = 'desc',
  orderBy = 'createdAt',
  content = false,
  searchQuery,
  category,
}: GetPostsByCategoriesQueryParams) {
  if (!category) throw new Error('Category param is undefined')

  const categories = category.split(' ')

  // Get postIds with cardinality >= categories count
  const groupedPosts = await prisma.postToCategory.groupBy({
    by: ['postId'],
    having: {
      categoryName: {
        _count: {
          gte: categories.length,
        },
      },
    },
  })

  if (groupedPosts.length === 0) return

  const search = searchQuery ? searchQuery.split(' ').join(' & ') : undefined
  const postIds = groupedPosts.map((data) => data.postId)

  let posts

  if (typeof search === 'undefined') {
    posts = await prisma.post.findMany({
      select: {
        ...selectPostWithAuthorCategories,
        content,
      },
      where: {
        id: {
          in: postIds,
        },
        published: true,
        categories: {
          some: {
            categoryName: {
              in: categories,
              mode: 'insensitive',
            },
          },
        },
      },
      orderBy: {
        [orderBy]: order,
      },
      take,
      skip,
    })
  } else {
    posts = await prisma.post.findMany({
      select: {
        ...selectPostWithAuthorCategories,
        content,
      },
      where: {
        id: {
          in: groupedPosts.map((data) => data.postId),
        },
        published: true,
        categories: {
          some: {
            categoryName: {
              in: categories,
              mode: 'insensitive',
            },
          },
        },
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
      orderBy: [
        {
          _relevance: {
            fields: ['title', 'excerpt'],
            search,
            sort: order,
          },
        },
        {
          [orderBy]: order,
        },
      ],
      take,
      skip,
    })
  }

  return posts
}

export async function countPosts() {
  const postsCount = await prisma.post.count({
    where: {
      published: true,
    },
  })

  return postsCount
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
