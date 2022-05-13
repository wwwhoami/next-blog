import { PostHeader } from '@/types/Post'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import CategoryLabel from './CategoryLabel'

type Props = {
  postHeader: PostHeader
}

const PostHeader = ({
  postHeader: {
    title,
    createdAt,
    coverImage,
    categories,
    author,
    excerpt,
    readingTimeMinutes,
  },
}: Props) => {
  return (
    <header className="w-full">
      <Image
        src={coverImage}
        alt="Cover image"
        className="w-full z-1 rounded object-cover text-center"
        width={1200}
        height={420}
      />
      <div className="my-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-5 ">
          <Link href={`/author/${author.name}`} passHref>
            <a>
              <Image
                src={author.image}
                alt="Author image"
                className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block hover:cursor-pointer"
                width={40}
                height={40}
              />
            </a>
          </Link>
          <div className="flex flex-col">
            <Link href={`/author/${author.name}`}>
              <a className="text-lg font-medium">{author.name}</a>
            </Link>
            <p className="text-lg font-medium text-gray-500">
              on {dayjs(createdAt).format('DD MMMM, YYYY')} —{' '}
              {readingTimeMinutes} min read
            </p>
          </div>
          <div className="ml-auto">
            {categories.map((category, index) => (
              <CategoryLabel
                key={index}
                name={category.category.name}
                hexColor={category.category.hexColor}
              />
            ))}
          </div>
        </div>
        <h1 className="mx-auto text-5xl mb-7 font-bold mt-10 max-w-3xl">
          {title}
        </h1>
        <p className="text-xl font-medium">{excerpt}</p>
      </div>
    </header>
  )
}

export default PostHeader
