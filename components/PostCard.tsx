import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Post } from 'types/Post'
import CategoryLabel from './CategoryLabel'

type Props = {
  post: Post
}

const PostCard = ({ post }: Props) => {
  const colorKey = {
    JavaScript: 'ring-yellow-600',
    PHP: 'ring-purple-600',
    CSS: 'ring-blue-600',
    Python: 'ring-green-600',
    Ruby: 'ring-red-600',
  }

  const ringColor =
    (colorKey as any)[post.frontmatter.category] || 'ring-gray-600'

  return (
    <Link href={`/blog/${post.slug}`} passHref>
      <a
        className={`w-full px-10 py-6 cursor-pointer mt-6 rounded-lg focus:outline-none ${ringColor} hover:ring-2  hover:ring-offset-2 focus:ring-2  focus:ring-offset-2 transition-all duration-300 ease-in-out`}
      >
        <Image
          src={post.frontmatter.cover_image}
          alt="cover image"
          height={420}
          width={600}
          className="mb-4 rounded"
        />
        <div className="flex items-center mt-1 gap-2">
          <Image
            src={post.frontmatter.author_image}
            alt="author image"
            height={40}
            width={40}
            className="rounded-full mx-4 object-cover"
          />
          <a className="text-gray-700 font-semibold hover:underline">
            {post.frontmatter.author}
          </a>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="font-light text-gray-600">
            {post.frontmatter.date}
          </span>
          <CategoryLabel>{post.frontmatter.category}</CategoryLabel>
        </div>
        <div className="mt-2">
          <a className="text-xl text-gray-700 font-bold hover:underline">
            {post.frontmatter.title}
          </a>
          <p className="mt-2 text-gray-600">{post.frontmatter.excerpt}</p>
        </div>
      </a>
    </Link>
  )
}

export default PostCard
