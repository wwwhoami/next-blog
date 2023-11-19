import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useUser } from 'src/context/userContext'
import AuthModal from './AuthModal'
import Search from './Search'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import UserMenu from './UserMenu'
import useRouterReferer from 'src/hooks/useRouterReferer'

type Props = {}

const Header = (props: Props) => {
  const router = useRouter()
  const { backToReferer } = useRouterReferer()
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full py-1 bg-white shadow backdrop-filter backdrop-blur-xl bg-opacity-60">
      <div className="container flex flex-col flex-wrap items-center mx-auto md:flex-row">
        <Link href="/" passHref className="ml-3 text-2xl focus-ring rounded-xl">
          <span className="font-semibold text-indigo-600 hover:text-indigo-700">
            Next
          </span>
          Blog
        </Link>
        <Search />
        <nav className="flex flex-wrap items-center justify-end space-x-4 text-base md:ml-auto">
          <Link
            href="/blog"
            className="px-3 py-2 rounded-lg focus-ring text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="px-3 py-2 rounded-lg focus-ring text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            About
          </Link>
          {!user && (
            <>
              <Link
                href={`/?signUp=true&referer=${router.asPath.replaceAll(
                  '&',
                  '|'
                )}`}
                as="/signUp"
                shallow={true}
                passHref
                className="px-3 py-2 rounded-lg focus-ring text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Sign up
              </Link>
              <Link
                href={`/?signIn=true&referer=${router.asPath.replaceAll(
                  '&',
                  '|'
                )}`}
                as="/signIn"
                shallow={true}
                passHref
                className="px-3 py-2 rounded-lg focus-ring text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                Sign in
              </Link>
            </>
          )}
          {user && <UserMenu />}
        </nav>

        <AuthModal
          isOpen={!!router.query.signUp || !!router.query.signIn}
          closeModal={backToReferer}
          title={
            !!router.query.signUp
              ? 'Sign Up'
              : !!router.query.signIn
              ? 'Sign In'
              : ''
          }
        >
          {!!router.query.signUp ? (
            <SignUpForm />
          ) : !!router.query.signIn ? (
            <SignInForm />
          ) : (
            ''
          )}
        </AuthModal>
      </div>
    </header>
  )
}

export default Header
