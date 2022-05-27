import { Post } from '@/types/Post'

export const fetchPosts = async (url: RequestInfo) => {
  const res = await fetch(url)

  if (!res.ok) throw new Error(await res.json())

  const posts: Post[] = await res.json()

  return posts
}
