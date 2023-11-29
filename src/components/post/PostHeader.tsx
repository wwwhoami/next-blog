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
          className="w-full rounded-xl object-cover object-center text-center"
        />
      </span>
      <div className="mx-auto my-8 max-w-3xl">
        <div className="flex items-center gap-5 ">
          <Link href={`/author/${author?.name}`} passHref>
            <Image
              src={String(author?.image)}
              alt="Author image"
              className="hidden h-auto w-full rounded-full object-cover hover:cursor-pointer sm:block"
              width={50}
              height={50}
            />
          </Link>
          <div className="flex flex-col">
            <Link
              href={`/author/${author?.name}`}
              className="text-lg font-medium"
            >
              {author?.name ?? 'Deleted Author'}
            </Link>
            <p className="text-lg font-medium text-gray-500">
              on {dayjs(createdAt).format('DD MMMM, YYYY')} —{' '}
              {readingTimeMinutes} min read
            </p>
          </div>
          <div className="ml-auto">
            {categories?.map((category, index) => (
              <CategoryLink
                key={index}
                name={category.category.name}
                hexColor={category.category.hexColor}
              />
            ))}
          </div>
        </div>
        <h1 className="mb-7 mt-10 max-w-3xl text-5xl font-bold">{title}</h1>
        <p className="text-xl font-medium">{excerpt}</p>
      </div>
    </header>
  )
}

export default PostHeader
