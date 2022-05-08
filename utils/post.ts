import { Post } from '@/types/Post'

export const sortByDate = (a: Post, b: Post) => {
  return (
    new Date(b.frontmatter.date).getTime() -
    new Date(a.frontmatter.date).getTime()
  )
}

export const getCategoryColor = (category: string) => {
  const colorKey = {
    JavaScript: '#ca8a04',
    PHP: '#9333ea',
    CSS: '#2563eb',
    Python: '#16a34a',
    Ruby: '#dc2626',
  }

  const categoryColor: string | null = (colorKey as any)[category] || null

  return categoryColor
}
