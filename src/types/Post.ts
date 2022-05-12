export interface Post {
  createdAt: string
  title: string
  slug: string
  excerpt: string
  content?: string
  viewCount: number
  coverImage: string
  author: Author
  categories: CategoryElement[]
}

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
  hexColor: string
}

export type Frontmatter = {
  title: string
  date: string
  excerpt: string
  cover_image: string
  category: string
  author: string
}
