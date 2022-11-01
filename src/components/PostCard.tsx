import { Post } from '@/types/Post'
import dayjs from 'dayjs'
import Image from "next/legacy/image";
import Link from 'next/link'
import React from 'react'
import CategoryLink from './CategoryLink'

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
    <Link href={`/blog/${slug}`} passHref legacyBehavior>
      <div
        className={`w-full cursor-pointer mt-6 rounded-xl hover-ring focus-ring bg-slate-100`}
        style={{
          ['--tw-ring-color' as any]: categories[0].category.hexColor,
        }}
      >
        <Image
          src={coverImage}
          alt="Cover image"
          height={420}
          width={600}
          className="mb-4 rounded-xl object-cover"
        />
        <div className="px-6 py-3">
          <div className="flex items-center mt-1 gap-2">
            <Image
              src={authorImage}
              alt="author image"
              height={40}
              width={40}
              className="rounded-full w-full mx-4 object-cover"
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
              <CategoryLink
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
      </div>
    </Link>
  )
}

export default PostCard
