import { Prisma } from '@prisma/client'

export const userData: Prisma.UserCreateWithoutPostsInput[] = [
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

export const categoryData: Prisma.CategoryCreateInput[] = [
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
