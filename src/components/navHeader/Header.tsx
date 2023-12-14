import dynamic from 'next/dynamic'
import Link from 'next/link'
import HeaderNav from './HeaderNav'

const Search = dynamic(() => import('../Search'), {
  ssr: false,
})

type Props = {}

const Header = (props: Props) => {
  return (
    <header className="lg:px-2 sticky top-0 z-20 w-full bg-gray-50 shadow dark:border-gray-50/[0.06] bg-opacity-60 backdrop-blur backdrop-filter dark:bg-gray-900/80 supports-backdrop-blur:bg-white/95">
      <div className="flex flex-col flex-wrap items-center mx-auto md:h-16 max-w-screen-2xl md:flex-row">
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
        <HeaderNav />
      </div>
    </header>
  )
}

export default Header
