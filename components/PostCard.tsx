import { getCategoryColor } from '@/utils/post'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Post } from 'types/Post'
import CategoryLabel from './CategoryLabel'

type Props = {
  post: Post
}

const PostCard = ({ post: { frontmatter, slug } }: Props) => {
  const categoryColor = getCategoryColor(frontmatter.category)

  return (
    <Link href={`/blog/${slug}`}>
      <a
        className={`w-full px-10 py-6 cursor-pointer mt-6 rounded-lg hover-ring focus-ring`}
        style={{
          ['--tw-ring-color' as any]: categoryColor,
        }}
      >
        <Image
          src={frontmatter.cover_image}
          alt="cover image"
          height={420}
          width={600}
          className="mb-4 rounded"
        />
        <div className="flex items-center mt-1 gap-2">
          <Image
            src={frontmatter.author_image}
            alt="author image"
            height={40}
            width={40}
            className="rounded-full mx-4 object-cover"
          />
          <a className="text-gray-700 font-semibold hover:underline">
            {frontmatter.author}
          </a>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="font-light text-gray-600">{frontmatter.date}</span>

          <CategoryLabel category={frontmatter.category} />
        </div>
        <div className="mt-2">
          <a className="text-xl text-gray-700 font-bold hover:underline">
            {frontmatter.title}
          </a>
          <p className="mt-2 text-gray-600">{frontmatter.excerpt}</p>
        </div>
      </a>
    </Link>
  )
}

export default PostCard
