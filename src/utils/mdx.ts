import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { Frontmatter } from '@/types/Post'

// import { sync } from 'glob'

const postsPath = path.join('data/posts')

export async function getSlugs() {
  const files = fs.readdirSync(path.join(postsPath))

  return files.map((filename) => filename.replace(/\.mdx$/, ''))
}

export async function getFrontmatterFromSlug(slug: string) {
  const postDir = path.join(postsPath, `${slug}.mdx`)
  const source = fs.readFileSync(postDir, 'utf-8')
  const { data } = matter(source)
  const frontmatter = data as Frontmatter

  return {
    frontmatter: {
      ...frontmatter,
      readingTime: readingTime(source).text,
    },
  }
}

export async function getPostFromSlug(slug: string) {
  const postDir = path.join(postsPath, `${slug}.mdx`)
  const source = fs.readFileSync(postDir, 'utf-8')
  const { content, data } = matter(source)
  const frontmatter = data as Frontmatter

  return {
    content,
    frontmatter: {
      ...frontmatter,
      readingTime: readingTime(source).text,
    },
  }
}
