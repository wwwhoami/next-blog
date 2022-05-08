import { getCategoryColor } from '@/utils/post'
import Link from 'next/link'
import React from 'react'

type Props = {
  category: string
}

const CategoryLabel = ({ category }: Props) => {
  const categoryColor = getCategoryColor(category)

  return (
    <Link href={`/blog/category/${category.toLowerCase()}`} passHref>
      <a
        className={`rounded-lg px-2 py-1 text-c font-bold hover-ring focus-ring`}
        style={{
          ['--tw-ring-color' as any]: categoryColor,
          ['color' as any]: categoryColor,
        }}
      >
        {category}
      </a>
    </Link>
  )
}

export default CategoryLabel
