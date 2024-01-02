import { Post } from '@/types/Post'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import CategoryLink from '../category/CategoryLink'

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
    <Link
      href={`/blog/${slug}`}
      className="hover-ring-primary focus-ring-primary mt-6 rounded-xl"
    >
      <object
        className={`h-full w-full cursor-pointer rounded-xl bg-gray-50 shadow-lg dark:bg-gray-800/50`}
        style={{
          ['--tw-ring-color' as any]: categories
            ? categories[0].category.hexColor
            : '#7c3aed',
        }}
      >
        <Image
          src={coverImage}
          alt="Cover image"
          width={600}
          height={420}
          className="mb-4 w-full rounded-xl object-cover object-center sm:h-96"
        />
        <div className="px-6 py-3">
          <Link
            className="focus-ring-primary mt-1 inline-flex items-center gap-2 rounded-xl hover:underline"
            href={''}
          >
            <Image
              src={String(authorImage)}
              alt="author image"
              height={45}
              width={45}
              className="rounded-full object-cover"
            />
            <b className="font-semibold text-gray-700 dark:text-gray-300">
              {authorName}
            </b>
          </Link>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-light text-gray-600 dark:text-gray-300">
              {dayjs(createdAt).format('DD MMMM, YYYY')}
            </span>

            <div>
              {categories?.map((category, index) => (
                <CategoryLink
                  key={index}
                  name={category.category.name}
                  hexColor={category.category.hexColor}
                />
              ))}
            </div>
          </div>
          <div className="mt-2">
            <a className="text-2xl font-bold text-gray-700 hover:underline dark:text-gray-200">
              {title}
            </a>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{excerpt}</p>
          </div>
        </div>
      </object>
    </Link>
  )
}

export default PostCard
