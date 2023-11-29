'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
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
    (query: string) => {
      const queryToSet = new URLSearchParams()

      if (!query) queryToSet.delete('searchQuery')
      else queryToSet.set('searchQuery', query.trim())

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
      className={`focus-ring focus-within:border-primary focus-within:ring-primary ml-10 rounded-xl border bg-white/80 focus-within:ring focus-within:ring-opacity-50 ${className}`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center justify-between"
      >
        <input
          className="m-1 w-60 flex-1 bg-transparent px-2 text-gray-700 placeholder-gray-400 focus:outline-none"
          type="text"
          placeholder="Search Posts"
          value={term}
          onChange={handleChange}
        />
        <button className="m-0.5 flex transform items-center justify-center rounded-xl bg-indigo-500 p-2 text-white transition-colors duration-300 hover:bg-indigo-500/70 focus:bg-indigo-500/70 focus:outline-none">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}

export default Search
