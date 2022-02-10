import { Post } from '@/types/Post'

export const sortByDate = (a: Post, b: Post) => {
  return (
    new Date(b.frontmatter.date).getTime() -
    new Date(a.frontmatter.date).getTime()
  )
}
