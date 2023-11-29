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
      className="mt-6 hover-ring focus-ring rounded-xl"
    >
      <object
        className={`w-full cursor-pointer rounded-xl bg-slate-100`}
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
          className="object-cover object-center w-full mb-4 rounded-xl sm:h-96"
        />
        <div className="px-6 py-3">
          <Link
            className="inline-flex items-center gap-2 mt-1 rounded-xl focus-ring hover:underline"
            href={''}
          >
            <Image
              src={String(authorImage)}
              alt="author image"
              height={45}
              width={45}
              className="object-cover rounded-full"
            />
            <b className="font-semibold text-gray-700">{authorName}</b>
          </Link>
          <div className="flex items-center justify-between mt-3">
            <span className="font-light text-gray-600">
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
            <a className="text-xl font-bold text-gray-700 hover:underline">
              {title}
            </a>
            <p className="mt-2 text-gray-600">{excerpt}</p>
          </div>
        </div>
      </object>
    </Link>
  )
}

export default PostCard
