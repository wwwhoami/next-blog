import { PostMdx } from '@/types/Post'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import CategoryLink from './CategoryLink'

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
      <span className="box-border relative block overflow-hidden w-full lg:h-[420px] h-72 sm:h-80 md:h-96">
        <Image
          src={coverImage}
          alt="Cover image"
          fill={true}
          sizes="100vw"
          className="object-cover object-center w-full text-center rounded-xl"
        />
      </span>
      <div className="max-w-3xl mx-auto my-8">
        <div className="flex items-center gap-5 ">
          <Link href={`/author/${author?.name}`} passHref>
            <Image
              src={String(author?.image)}
              alt="Author image"
              className="hidden object-cover w-full h-auto rounded-full sm:block hover:cursor-pointer"
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
        <h1 className="max-w-3xl mt-10 text-5xl font-bold mb-7">{title}</h1>
        <p className="text-xl font-medium">{excerpt}</p>
      </div>
    </header>
  )
}

export default PostHeader
