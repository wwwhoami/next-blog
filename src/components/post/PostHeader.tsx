import { PostMdx } from '@/types/Post'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import CategoryLink from '../category/CategoryLink'

type Props = {
  postHeader: Omit<PostMdx, 'content' | 'id'>
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
      <span className="relative block h-64 w-full overflow-hidden sm:h-80 md:h-96 lg:h-[420px]">
        <Image
          src={coverImage}
          alt="Cover image"
          fill={true}
          sizes="100vw"
          className="object-cover"
        />
      </span>
      <div className="sm:w-[65ch] w-full px-4 mx-auto my-8 text-base md:px-0 md:text-lg box-border">
        <div className="flex flex-col gap-5 md:items-center md:flex-row">
          <div className="flex items-center gap-5">
            <Link
              href={`/author/${author?.name}`}
              passHref
              className="relative block w-12 h-12 rounded-full hover-ring focus-ring md:w-14 md:h-14 lg:w-16 lg:h-16"
            >
              <Image
                src={String(author?.image)}
                alt="Author image"
                className="object-cover rounded-full hover:cursor-pointer"
                fill={true}
              />
            </Link>
            <div className="flex flex-col">
              <Link
                href={`/author/${author?.name}`}
                className="inline-block font-medium rounded-lg focus-ring hover:underline"
              >
                {author?.name ?? 'Deleted Author'}
              </Link>
              <p className="font-medium text-gray-500 dark:text-gray-400">
                on {dayjs(createdAt).format('DD MMMM, YYYY')} —{' '}
                {readingTimeMinutes} min read
              </p>
            </div>
          </div>
          <div className="md:ml-auto">
            {categories?.map((category, index) => (
              <CategoryLink
                key={index}
                name={category.category.name}
                hexColor={category.category.hexColor}
              />
            ))}
          </div>
        </div>
        <h1 className="mt-5 mb-4 text-3xl font-bold sm:mt-10 md:text-4xl md:mb-7 dark:text-white">
          {title}
        </h1>
        <p className="text-base font-medium text-gray-900 md:text-lg dark:text-gray-200">
          {excerpt}
        </p>
      </div>
    </header>
  )
}

export default PostHeader
