import { generatePosts, generateUsers } from '@/utils/fakeDataGen'
import { getPostData } from '@/utils/post'
import { PrismaClient } from '@prisma/client'
import { categoryData, userData } from 'data/seedData'

const prisma = new PrismaClient()

async function main() {
  const handmadeData = parseInt(process.argv[2]) || 1
  const userDataCount = parseInt(process.argv[3]) || 100
  const postDataCount = parseInt(process.argv[4]) || 1000
  const postData = await getPostData()
  console.log(userDataCount)
  console.log(postDataCount)

  console.log('Data generating...')

  const randUserData = await generateUsers(userDataCount)
  const randPostData = await generatePosts(postDataCount, userDataCount)

  console.log('Data generation completed')

  console.log(`Start seeding ...`)

  for (const c of categoryData) {
    const category = await prisma.category.create({
      data: c,
    })
    console.log(`Created category with id: ${category.name}`)
  }

  for (const u of randUserData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }

  for (const p of randPostData) {
    const post = await prisma.post.create({
      data: p,
    })
    console.log(`Created post with id: ${post.id}`)
  }

  if (handmadeData) {
    for (const u of userData) {
      const user = await prisma.user.create({
        data: u,
      })
      console.log(`Created user with id: ${user.id}`)
    }

    for (const p of postData) {
      const post = await prisma.post.create({
        data: p,
      })
      console.log(`Created post with id: ${post.id}`)
    }
  }

  console.log(`Seeding completed.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
