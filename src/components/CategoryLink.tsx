import Link from 'next/link'
import React from 'react'

type Props = {
  name: string
  hexColor?: string | null
}

const CategoryLink = ({ name, hexColor }: Props) => {
  return (
    <Link href={`/blog?category=${name}`} passHref>
      <a
        className={`rounded-lg px-2 py-1 text-c font-bold hover-ring focus-ring`}
        style={{
          ['--tw-ring-color' as any]: hexColor,
          ['color' as any]: hexColor,
        }}
      >
        {name}
      </a>
    </Link>
  )
}

export default CategoryLink
