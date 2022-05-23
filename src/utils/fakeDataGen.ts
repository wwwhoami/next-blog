import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import { categoryData } from 'data/seedData'
import slugify from 'slugify'
import { getRandomPostContent, getSlugs } from './mdx'

export function generateUuid(count: number) {
  if (count <= 0) throw new Error('Count should be positive integer')

  const uuids: string[] = []
  while (count > 0) {
    uuids.push(faker.unique(faker.datatype.uuid))
    count--
  }
  return uuids
}

export async function generateUsers(count: number, uuids: string[]) {
  let userData: Prisma.UserCreateWithoutPostsInput[] = []

  while (count > 0) {
    userData.push({
      id: uuids[count - 1],
      name: faker.unique(faker.name.firstName),
      email: faker.unique(faker.internet.email),
      password: '$2a$12$lCGhm3HSmjkFJFtViSPpSemPLvSGpak1ljgC5WyGoIh/l5Igfyl/K',
      image: faker.image.avatar(),
    })
    count--
  }

  return userData
}

export async function generatePosts(count: number, uuids: string[]) {
  if (count <= 0) throw new Error('Count should be positive integer')

  let postData: Prisma.PostCreateInput[] = []
  const slugs = await getSlugs()
  const contents = await getRandomPostContent(slugs, count)

  for (let i = 0; i < count; i++) {
    const randTitle = faker.unique(faker.lorem.sentence, [3])
    postData.push({
      createdAt: faker.datatype.datetime({
        min: 1589315917000,
        max: 1620851917000,
      }),
      title: randTitle,
      slug: slugify(randTitle, { lower: true }),
      excerpt: faker.lorem.sentence(15),
      content: contents[i],
      published: true,
      coverImage: faker.image.business(1200, 480),
      author: {
        connect: {
          id: uuids[Math.floor(Math.random() * uuids.length - 1) + 1],
        },
      },
      categories: {
        create: {
          category: {
            connect: {
              name: categoryData[
                Math.floor(Math.random() * categoryData.length)
              ].name,
            },
          },
        },
      },
    })
  }

  return postData
}
