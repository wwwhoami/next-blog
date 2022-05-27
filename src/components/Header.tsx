import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useUser } from 'src/context/userContext'
import AuthModal from './AuthModal'
import Search from './Search'
import SignInForm from './SignInForm'
import SignOut from './SignOut'
import SignUpForm from './SignUpForm'

type Props = {}

const Header = (props: Props) => {
  const router = useRouter()
  const { user } = useUser()

  return (
    <header className="shadow w-full backdrop-filter backdrop-blur-xl sticky z-50 top-0 bg-white bg-opacity-60 py-1">
      <div className="container mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <Link href="/" passHref>
          <a className="text-2xl  ml-3">
            <span className="text-indigo-600 font-semibold hover:text-indigo-700">
              Next
            </span>
            Blog
          </a>
        </Link>
        <Search />
        <nav className="flex flex-wrap items-center justify-end text-base md:ml-auto space-x-4">
          <Link href="/blog">
            <a className="px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">
              Blog
            </a>
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
              >
                <a className="px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">
                  Sign up
                </a>
              </Link>
              <Link
                href={`/?signIn=true&referer=${router.asPath.replaceAll(
                  '&',
                  '|'
                )}`}
                as="/signIn"
                shallow={true}
                passHref
              >
                <a className="px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">
                  Sign in
                </a>
              </Link>
            </>
          )}
          {user && <SignOut />}
          <Link href="/about">
            <a className="px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">
              About
            </a>
          </Link>
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
