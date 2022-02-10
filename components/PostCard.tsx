import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Post } from 'types/Post'
import CategoryLabel from './CategoryLabel'

type Props = {
  post: Post
}

const PostCard = ({ post }: Props) => {
  return (
    <Link href={`/blog/${post.slug}`} passHref>
      <div className="w-full px-10 py-6 bg-white rounded-lg shadow-md mt-6 cursor-pointer hover:translate-y-[-.5rem] hover:shadow-xl transition-all duration-100 ease-in-out">
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
          <span className="text-gray-700 font-semibold hover:underline">
            {post.frontmatter.author}
          </span>
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
      </div>
    </Link>
  )
}

export default PostCard
