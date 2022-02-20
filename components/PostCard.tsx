import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Post } from 'types/Post'

type Props = {
  post: Post
}

const PostCard = ({ post }: Props) => {
  return (
    <Link href={`/blog/${post.slug}`} passHref>
      <a
        className={`w-full px-10 py-6 cursor-pointer mt-6 rounded-lg hover-ring focus-ring`}
        style={{
          ['--tw-ring-color' as any]: post.categoryColor,
        }}
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

          <Link
            href={`/blog/category/${post.frontmatter.category.toLowerCase()}`}
          >
            <a
              className={`rounded-lg px-2 py-1 text-c font-bold focus-ring hover:underline`}
              style={{
                ['--tw-ring-color' as any]: post.categoryColor,
                ['color' as any]: post.categoryColor,
              }}
            >
              {post.frontmatter.category}
            </a>
          </Link>
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
