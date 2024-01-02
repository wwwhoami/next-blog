import dynamic from 'next/dynamic'
import Link from 'next/link'
import HeaderNav from './HeaderNav'

const Search = dynamic(() => import('../Search'), {
  ssr: false,
})

type Props = {}

const Header = (props: Props) => {
  return (
    <header className="supports-backdrop-blur:bg-white/95 sticky top-0 z-20 w-full bg-gray-50/60 shadow backdrop-blur dark:border-gray-50/[0.06] dark:bg-gray-900/80 lg:px-2">
      <div className="mx-auto flex max-w-screen-2xl flex-col flex-wrap items-center md:h-16 md:flex-row">
        <Link
          href="/"
          passHref
          className="focus-ring-primary ml-3 rounded-xl text-2xl font-light dark:text-white"
        >
          <span className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-500">
            Next
          </span>
          Blog
        </Link>
        <Search />
        <HeaderNav />
      </div>
    </header>
  )
}

export default Header
