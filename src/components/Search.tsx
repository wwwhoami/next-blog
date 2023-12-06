'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import debounce from 'lodash.debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type Props = {
  className?: string
}

const Search = ({ className }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const query = useSearchParams()
  const [term, setTerm] = useState(query.get('searchQuery') ?? '')
  const termNotLoadedFromQuery = useRef(true)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pathname !== '/blog') router.push(`/blog?searchQuery=${term.trim()}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value)
    if (pathname === '/blog') debounceSetSearchQuery(e.target.value)
  }

  const setQueryParam = useCallback(
    (searchTerm: string) => {
      const queryToSet = new URLSearchParams()

      if (!searchTerm) queryToSet.delete('searchQuery')
      else queryToSet.set('searchQuery', searchTerm.trim())

      router.push(`/blog?${queryToSet.toString()}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  )

  const debounceSetSearchQuery = useMemo(
    () => debounce(setQueryParam, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  )

  useEffect(() => {
    if (query.get('searchQuery') && termNotLoadedFromQuery) {
      setTerm(query.get('searchQuery') || '')
      termNotLoadedFromQuery.current = false
    }

    return () => {
      debounceSetSearchQuery.cancel()
    }
  }, [debounceSetSearchQuery, query])

  return (
    <div
      className={clsx(
        'focus-ring focus-within:border-primary focus-within:ring-primary ml-10 rounded-xl bg-indigo-50/80 hover:bg-white focus-within:bg-white dark:bg-gray-700/80 dark:hover:bg-gray-800 dark:focus-within:bg-gray-800 focus-within:ring focus-within:ring-opacity-50 dark:focus-within:ring-opacity-80 shadow-md border-indigo-100 border dark:border-none',
        className,
      )}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center justify-between"
      >
        <input
          className="flex-1 px-2 m-1 text-gray-700 placeholder-gray-400 bg-transparent dark:text-gray-200 w-60 focus:outline-none"
          type="text"
          placeholder="Type to find posts..."
          value={term}
          onChange={handleChange}
        />
        <button className="m-0.5 flex transform items-center justify-center rounded-xl bg-indigo-500 p-2 text-white transition-colors duration-300 hover:bg-indigo-500/70 focus:bg-indigo-500/70 focus:outline-none">
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

export default Search
