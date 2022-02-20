import Link from 'next/link'
import React from 'react'

type Props = {
  children: string
}

const CategoryLabel = ({ children }: Props) => {
  const colorKey = {
    JavaScript: 'text-yellow-600',
    PHP: 'text-purple-600',
    CSS: 'text-blue-600',
    Python: 'text-green-600',
    Ruby: 'text-red-600',
  }

  const color = (colorKey as any)[children] || 'text-gray-600'

  return (
    <div className={`px-2 py-1 text-c font-bold ${color} hover:underline`}>
      <Link href={`/blog/category/${children.toLowerCase()}`}>
        <a>#{children}</a>
      </Link>
    </div>
  )
}

export default CategoryLabel
