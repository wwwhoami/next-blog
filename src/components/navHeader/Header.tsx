'use client'

import { useUser } from '@/context/UserProvider'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserMenu from '../menu/UserMenu'
import ColorThemeSwitch from './ColorThemeSwitch'

const Search = dynamic(() => import('../Search'), {
  ssr: false,
})

type Props = {}

const Header = (props: Props) => {
  const pathname = usePathname()
  const { user } = useUser()
  const navLinkClass =
    'lg:px-3 md:px-1 py-2 rounded-lg focus-ring text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:hover:text-gray-900 dark:text-gray-100'

  return (
    <header className="lg:px-2 sticky top-0 z-20 w-full py-1 bg-gray-50 shadow dark:border-gray-50/[0.06] bg-opacity-60 backdrop-blur backdrop-filter dark:bg-gray-900/80 supports-backdrop-blur:bg-white/95">
      <div className="flex flex-col flex-wrap items-center h-16 mx-auto max-w-screen-2xl md:flex-row">
        <Link
          href="/"
          passHref
          className="ml-3 text-2xl font-light dark:text-white focus-ring rounded-xl"
        >
          <span className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500">
            Next
          </span>
          Blog
        </Link>
        <Search />
        <nav className="flex flex-wrap items-center justify-end mr-3 space-x-4 text-base md:ml-auto">
          <Link href="/blog" className={navLinkClass}>
            Blog
          </Link>
          <Link href="/about" className={navLinkClass}>
            About
          </Link>
          <ColorThemeSwitch />
          {!user?.id && (
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
          {user && <UserMenu />}
        </nav>
      </div>
    </header>
  )
}

export default Header
