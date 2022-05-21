import { MDXRemoteSerializeResult } from 'next-mdx-remote/dist/types'

export interface Post {
  id: string
  createdAt: string
  title: string
  slug: string
  excerpt: string
  viewCount: number
  coverImage: string
  author: Author
  content?: string
  categories: CategoryElement[]
}

export type PostMdx = Omit<Post, 'content' | 'slug'> & {
  content: MDXRemoteSerializeResult<Record<string, unknown>>
  readingTimeMinutes: number
}

export type PostHeader = Omit<PostMdx, 'content' | 'viewCount'>

export interface Author {
  name: string
  email?: string
  image: string
}

export interface CategoryElement {
  category: Category
}

export interface Category {
  name: string
  description?: string
  hexColor?: string | null
}

export type Frontmatter = {
  title: string
  date: string
  excerpt: string
  cover_image: string
  category: string
  author: string
}
