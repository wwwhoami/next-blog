import { Frontmatter } from '@/types/Post'
import { getPostFromSlugForDb, getSlugs } from '@/utils/mdx'
import { Prisma, PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import slugify from 'slugify'

dayjs.extend(utc)
const prisma = new PrismaClient()

const userData: Prisma.UserCreateWithoutPostsInput[] = [
  {
    name: 'Alice Johnson',
    email: 'alice@prisma.io',
    password: '$2a$12$lCGhm3HSmjkFJFtViSPpSemPLvSGpak1ljgC5WyGoIh/l5Igfyl/K',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
  {
    name: 'John Doe',
    email: 'john@prisma.io',
    password: '$2a$12$lCGhm3HSmjkFJFtViSPpSemPLvSGpak1ljgC5WyGoIh/l5Igfyl/K',
    image: 'https://randomuser.me/api/portraits/men/12.jpg',
  },
  {
    name: 'Sam Smith',
    email: 'sam@prisma.io',
    password: '$2a$12$lCGhm3HSmjkFJFtViSPpSemPLvSGpak1ljgC5WyGoIh/l5Igfyl/K',
    image: 'https://randomuser.me/api/portraits/men/11.jpg',
  },
  {
    name: 'Mike Richards',
    email: 'mahmoud@prisma.io',
    password: '$2a$12$lCGhm3HSmjkFJFtViSPpSemPLvSGpak1ljgC5WyGoIh/l5Igfyl/K',
    image: 'https://randomuser.me/api/portraits/men/13.jpg',
  },
]

const categoryData: Prisma.CategoryCreateInput[] = [
  {
    name: 'Python',
    description: 'Python desc',
    hexColor: '#16a34a',
  },
  {
    name: 'JavaScript',
    description: 'JavaScript desc',
    hexColor: '#ca8a04',
  },
  {
    name: 'CSS',
    description: 'CSS desc',
    hexColor: '#2563eb',
  },
  {
    name: 'Ruby',
    description: 'Ruby desc',
    hexColor: '#dc2626',
  },
  {
    name: 'PHP',
    description: 'PHP desc',
    hexColor: '#9333ea',
  },
]

type PostFromFile = Frontmatter & {
  content: string
  slug: string
}

async function main() {
  console.log(`Start seeding ...`)

  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  for (const c of categoryData) {
    const category = await prisma.category.create({
      data: c,
    })
    console.log(`Created category with id: ${category.name}`)
  }

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

  for (const p of postData) {
    const post = await prisma.post.create({
      data: p,
    })
    console.log(`Created post with id: ${post.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
