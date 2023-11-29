import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { CategoryNoDescription } from './Category'

export enum PostEntityKeysEnum {
  id = 'id',
  title = 'title',
  content = 'content',
  published = 'published',
  coverImage = 'coverImage',
  authorId = 'authorId',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  excerpt = 'excerpt',
  slug = 'slug',
  likesCount = 'likesCount',
}

export type Post = {
  id: number
  title: string
  content?: string
  coverImage: string
  createdAt: string
  updatedAt: string
  excerpt: string
  slug: string
  author?: Author
  categories?: PostCategory[]
  likesCount: number
}

export type PostWithContent = Post & {
  content: string
}

export type PostMdx = Omit<Post, 'content' | 'slug'> & {
  content: MDXRemoteSerializeResult<Record<string, unknown>>
  readingTimeMinutes: number
}

export type Slug = {
  slug: string
}

type Author = {
  name: string
  image: string | null
}

export type PostCategory = {
  category: CategoryNoDescription
}

export type PostLike = Pick<Post, 'id' | 'likesCount'>
