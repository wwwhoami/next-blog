import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Search from './Search'

type Props = {}

const Header = (props: Props) => {
  return (
    <header className="shadow w-full backdrop-filter backdrop-blur-xl sticky z-50 top-0 bg-white bg-opacity-60 h-14 py-1">
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
          <Link href="/about">
            <a className="px-3 py-2 text-slate-700 rounded-lg hover:bg-slate-100 hover:text-slate-900">
              About
            </a>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
