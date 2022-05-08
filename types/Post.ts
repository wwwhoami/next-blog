export interface Post {
  slug: string
  frontmatter: frontmatter & {
    [key: string]: any
  }
}

export type frontmatter = {
  title: string
  date: string
  excerpt: string
  cover_image: string
  category: string
  author: string
  author_image: string
}
