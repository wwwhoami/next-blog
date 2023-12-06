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
      <span className="relative box-border block h-72 w-full overflow-hidden sm:h-80 md:h-96 lg:h-[420px]">
        <Image
          src={coverImage}
          alt="Cover image"
          fill={true}
          sizes="100vw"
          className="object-cover object-center w-full text-center"
        />
      </span>
      <div className="max-w-3xl px-4 mx-auto my-8 lg:px-0">
        <div className="flex flex-col gap-5 md:items-center md:flex-row">
          <div className="flex items-center gap-5">
            <Link
              href={`/author/${author?.name}`}
              passHref
              className="rounded-full focus-ring"
            >
              <Image
                src={String(author?.image)}
                alt="Author image"
                className="block object-cover rounded-full hover:cursor-pointer hover-ring focus-ring"
                width={55}
                height={55}
              />
            </Link>
            <div className="flex flex-col">
              <Link
                href={`/author/${author?.name}`}
                className="inline-block text-lg font-medium rounded-lg focus-ring hover:underline"
              >
                {author?.name ?? 'Deleted Author'}
              </Link>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                on {dayjs(createdAt).format('DD MMMM, YYYY')} —{' '}
                {readingTimeMinutes} min read
              </p>
            </div>
          </div>
          <div className="text-lg md:ml-auto">
            {categories?.map((category, index) => (
              <CategoryLink
                key={index}
                name={category.category.name}
                hexColor={category.category.hexColor}
              />
            ))}
          </div>
        </div>
        <h1 className="max-w-3xl mt-10 text-5xl font-bold mb-7 dark:text-white">
          {title}
        </h1>
        <p className="text-xl font-medium text-gray-900 dark:text-gray-200">
          {excerpt}
        </p>
      </div>
    </header>
  )
}

export default PostHeader
