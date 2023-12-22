'use client'

import { useUser } from '@/context/UserProvider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserMenu from '../menu/UserMenu'
import ThemeSwitch from './ThemeSwitch'

type Props = {}

export default function HeaderNav({}: Props) {
  const pathname = usePathname()
  const { user } = useUser()

  const navLinkClass = `px-3 py-2 rounded-lg focus-ring-primary text-gray-700 
  hover:bg-gray-200 hover:text-gray-900 dark:hover:text-gray-900 dark:text-gray-100
  focus:bg-gray-200 focus:text-gray-900 dark:focus:text-gray-900`

  return (
    <nav className="flex flex-wrap items-center justify-end mr-3 text-base gap-x-4 md:ml-auto">
      <Link href="/blog" className={navLinkClass}>
        Blog
      </Link>
      <Link href="/about" className={navLinkClass}>
        About
      </Link>
      <ThemeSwitch />
      {user !== undefined ? (
        <UserMenu />
      ) : (
        <>
          <Link
            href="/signUp"
            scroll={false}
            replace={pathname === '/signIn' || pathname === '/signUp'}
            className={navLinkClass}
          >
            Sign up
          </Link>
          <Link
            href="/signIn"
            scroll={false}
            replace={pathname === '/signIn' || pathname === '/signUp'}
            className={navLinkClass}
          >
            Sign in
          </Link>
        </>
      )}
    </nav>
  )
}
