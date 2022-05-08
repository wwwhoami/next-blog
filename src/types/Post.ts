export interface Post {
  slug: string
  frontmatter: Frontmatter & {
    [key: string]: any
  }
}

export type Frontmatter = {
  title: string
  date: string
  excerpt: string
  cover_image: string
  category: string
  author: string
  author_image: string
  reading_time: string
}
