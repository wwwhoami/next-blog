import Link, { LinkProps } from 'next/link'

type Props = LinkProps & {
  children: React.ReactNode
}

export default function NavLink({ children, ...props }: Props) {
  return (
    <Link
      {...props}
      className={`px-3 py-2 rounded-lg focus-ring-primary text-gray-700 dark:text-gray-100
  hover:bg-gray-200 hover:text-gray-900 dark:hover:text-gray-900
  focus:bg-gray-200 focus:text-gray-900 dark:focus:text-gray-900`}
    >
      {children}
    </Link>
  )
}
