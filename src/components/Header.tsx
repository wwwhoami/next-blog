'use client'

import { useUser } from '@/context/UserProvider'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Search from './Search'
import UserMenu from './menu/UserMenu'

type Props = {}

const Header = (props: Props) => {
  const pathname = usePathname()
  const { user } = useUser()
  const navLinkClass =
    'px-3 py-2 rounded-lg focus-ring text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-100'

  return (
    <header className="sticky top-0 z-50 w-full py-2 bg-white shadow dark:border-slate-50/[0.06] bg-opacity-60 backdrop-blur-xl backdrop-filter dark:bg-slate-900/75">
      <div className="container flex flex-col flex-wrap items-center mx-auto md:flex-row">
        <Link
          href="/"
          passHref
          className="ml-3 text-2xl font-light text-white focus-ring rounded-xl"
        >
          <span className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500">
            Next
          </span>
          Blog
        </Link>
        <Search />
        <nav className="flex flex-wrap items-center justify-end space-x-4 text-base md:ml-auto">
          <Link href="/blog" className={navLinkClass}>
            Blog
          </Link>
          <Link href="/about" className={navLinkClass}>
            About
          </Link>
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
