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
      <div className="mx-auto my-8 box-border w-full px-4 text-base sm:w-[65ch] md:px-0 md:text-lg">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <Link
              href={`/author/${author?.name}`}
              passHref
              className="hover-ring-primary focus-ring-primary relative block h-12 w-12 rounded-full md:h-14 md:w-14 lg:h-16 lg:w-16"
            >
              <Image
                src={String(author?.image)}
                alt="Author image"
                className="rounded-full object-cover hover:cursor-pointer"
                fill={true}
              />
            </Link>
            <div className="flex flex-col">
              <Link
                href={`/author/${author?.name}`}
                className="focus-ring-primary inline-block rounded-lg font-medium hover:underline"
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
        <h1 className="mb-4 mt-5 text-3xl font-bold sm:mt-10 md:mb-7 md:text-4xl dark:text-white">
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
