'use client'

import { useUser } from '@/context/UserProvider'
import { usePathname } from 'next/navigation'
import UserMenu from '../menu/UserMenu'
import NavLink from './NavLink'
import ThemeSwitch from './ThemeSwitch'

type Props = {}

export default function HeaderNav({}: Props) {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <nav className="mr-3 flex flex-wrap items-center justify-end gap-x-4 text-base md:ml-auto">
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/about">About</NavLink>
      <ThemeSwitch />
      {user !== undefined ? (
        <UserMenu />
      ) : (
        <>
          <NavLink
            href="/signUp"
            scroll={false}
            replace={pathname === '/signIn' || pathname === '/signUp'}
          >
            Sign up
          </NavLink>
          <NavLink
            href="/signIn"
            scroll={false}
            replace={pathname === '/signIn' || pathname === '/signUp'}
          >
            Sign in
          </NavLink>
        </>
      )}
    </nav>
  )
}
