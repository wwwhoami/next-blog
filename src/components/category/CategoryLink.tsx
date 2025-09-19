import Link from 'next/link'

type Props = {
  name: string
  hexColor?: string | null
}

const CategoryLink = ({ name, hexColor }: Props) => {
  return (
    <Link
      href={`/blog?category=${name}`}
      passHref
      className={`rounded-lg px-2 py-1 font-bold focus-ring-primary hover-ring-primary`}
      style={{
        ['--tw-ring-color' as any]: hexColor,
        ['color' as any]: hexColor,
      }}
    >
      {name}
    </Link>
  )
}

export default CategoryLink
