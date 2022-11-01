import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useUser } from 'src/context/userContext'
import AuthModal from './AuthModal'
import Search from './Search'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import UserMenu from './UserMenu'

type Props = {}

const Header = (props: Props) => {
  const router = useRouter()
  const { user } = useUser()

  return (
    <header className="shadow w-full backdrop-filter backdrop-blur-xl sticky z-50 top-0 bg-white bg-opacity-60 py-1">
      <div className="container mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <Link
          href="/"
          passHref
          className="focus-ring rounded-xl text-2xl  ml-3"
        >
          <span className="text-indigo-600 font-semibold hover:text-indigo-700">
            Next
          </span>
          Blog
        </Link>
        <Search />
        <nav className="flex flex-wrap items-center justify-end text-base md:ml-auto space-x-4">
          <Link
            href="/blog"
            className="focus-ring px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="focus-ring px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900"
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
                className="focus-ring px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900"
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
                className="focus-ring px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900"
              >
                Sign in
              </Link>
            </>
          )}
          {user?.user && <UserMenu />}
        </nav>

        <AuthModal
          isOpen={!!router.query.signUp || !!router.query.signIn}
          closeModal={() =>
            router.push(
              router.query.referer?.toString().replaceAll('|', '&') || '/',
              undefined,
              {
                shallow: true,
              }
            )
          }
          title={
            !!router.query.signUp
              ? 'Sign Up'
              : !!router.query.signIn
              ? 'Sign In'
              : ''
          }
        >
          {!!router.query.signUp ? (
            <SignUpForm
              closeModal={() =>
                router.push(
                  router.query.referer?.toString().replaceAll('|', '&') || '/',
                  undefined,
                  {
                    shallow: true,
                  }
                )
              }
            />
          ) : !!router.query.signIn ? (
            <SignInForm
              closeModal={() =>
                router.push(
                  router.query.referer?.toString().replaceAll('|', '&') || '/',
                  undefined,
                  {
                    shallow: true,
                  }
                )
              }
            />
          ) : (
            ''
          )}
        </AuthModal>
      </div>
    </header>
  )
}

export default Header
