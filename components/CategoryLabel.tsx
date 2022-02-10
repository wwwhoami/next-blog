import Link from 'next/link'
import React from 'react'

type Props = {
  children: string
}

const CategoryLabel = ({ children }: Props) => {
  const colorKey = {
    JavaScript: 'bg-yellow-600',
    PHP: 'bg-purple-600',
    CSS: 'bg-blue-600',
    Python: 'bg-green-600',
    Ruby: 'bg-red-600',
  }

  const bgColor = (colorKey as any)[children] || 'bg-neutral-600'

  return (
    <div className={`px-2 py-1 text-gray-100 font-bold rounded ${bgColor}`}>
      <Link href={`/blog/category/${children.toLowerCase()}`}>{children}</Link>
    </div>
  )
}

export default CategoryLabel
