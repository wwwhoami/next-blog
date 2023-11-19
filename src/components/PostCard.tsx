import { Post } from '@/types/Post'
import dayjs from 'dayjs'
import Image from 'next/legacy/image'
import Link from 'next/link'
import React from 'react'
import CategoryLink from './CategoryLink'

type Props = {
  post: Post
}

const PostCard = ({
  post: { coverImage, slug, createdAt, title, excerpt, author, categories },
}: Props) => {
  const { image: authorImage, name: authorName } = author ?? {
    image: '',
    name: 'Deleted Author',
  }

  return (
    <Link href={`/blog/${slug}`} passHref legacyBehavior>
      <div
        className={`w-full cursor-pointer mt-6 rounded-xl hover-ring focus-ring bg-slate-100`}
        style={{
          ['--tw-ring-color' as any]: categories
            ? categories[0].category.hexColor
            : '#7c3aed',
        }}
      >
        <Image
          src={coverImage}
          alt="Cover image"
          height={420}
          width={600}
          className="object-cover mb-4 rounded-xl"
        />
        <div className="px-6 py-3">
          <div className="flex items-center gap-2 mt-1">
            <Image
              src={String(authorImage)}
              alt="author image"
              height={40}
              width={40}
              className="object-cover w-full mx-4 rounded-full"
            />
            <a className="font-semibold text-gray-700 hover:underline">
              {authorName}
            </a>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="font-light text-gray-600">
              {dayjs(createdAt).format('DD MMMM, YYYY')}
            </span>
            {categories?.map((category, index) => (
              <CategoryLink
                key={index}
                name={category.category.name}
                hexColor={category.category.hexColor}
              />
            ))}
          </div>
          <div className="mt-2">
            <a className="text-xl font-bold text-gray-700 hover:underline">
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
