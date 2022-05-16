import { Post } from '@/types/Post'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoryLabel from './CategoryLabel'

type Props = {
  post: Post
}

const PostCard = ({
  post: {
    coverImage,
    slug,
    createdAt,
    title,
    excerpt,
    author: { image: authorImage, name: authorName },
    categories,
  },
}: Props) => {
  return (
    <Link href={`/blog/${slug}`} passHref>
      <div
        className={`w-full px-6 py-3 cursor-pointer mt-6 rounded-lg hover-ring focus-ring`}
        style={{
          ['--tw-ring-color' as any]: categories[0].category.hexColor,
        }}
      >
        <Image
          src={coverImage}
          alt="Cover image"
          height={420}
          width={600}
          className="mb-4 rounded object-cover"
        />
        <div className="flex items-center mt-1 gap-2">
          <Image
            src={authorImage}
            alt="author image"
            height={40}
            width={40}
            className="rounded-full mx-4 object-cover"
          />
          <a className="text-gray-700 font-semibold hover:underline">
            {authorName}
          </a>
        </div>
        <div className="flex justify-between items-center mt-3">
          <span className="font-light text-gray-600">
            {dayjs(createdAt).format('DD MMMM, YYYY')}
          </span>

          {categories.map((category, index) => (
            <CategoryLabel
              key={index}
              name={category.category.name}
              hexColor={category.category.hexColor}
            />
          ))}
        </div>
        <div className="mt-2">
          <a className="text-xl text-gray-700 font-bold hover:underline">
            {title}
          </a>
          <p className="mt-2 text-gray-600">{excerpt}</p>
        </div>
      </div>
    </Link>
  )
}

export default PostCard
