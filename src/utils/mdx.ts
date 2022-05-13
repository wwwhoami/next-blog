import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { Frontmatter } from '@/types/Post'

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

export async function getPostFromSlugForDb(slug: string) {
  const postDir = path.join(postsPath, `${slug}.mdx`)
  const source = fs.readFileSync(postDir, 'utf-8')
  const { content, data } = matter(source)
  const frontmatter = data as Frontmatter

  return {
    content,
    frontmatter,
  }
}

export async function getRandomPostContent(slugs: string[], count: number) {
  if (count <= 0) throw new Error('Count should be positive integer')
  const postDirs = slugs.map((slug) => path.join(postsPath, `${slug}.mdx`))
  let postContents: string[] = []
  while (count > 0) {
    const randPostDir = postDirs[Math.floor(Math.random() * postDirs.length)]
    const source = fs.readFileSync(randPostDir, 'utf-8')
    const { content } = matter(source)
    postContents.push(content)
    count--
  }

  return postContents
}
