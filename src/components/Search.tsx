import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
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
  const [term, setTerm] = useState(
    router.query.searchQuery ? (router.query.searchQuery as string) : ''
  )
  const termNotLoadedFromQuery = useRef(true)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (router.route !== '/blog')
      router.push(`/blog?searchQuery=${term.trim()}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value)
    if (router.route === '/blog') debounceSetSearchQuery(e.target.value)
  }

  useEffect(() => {
    if (router.isReady && router.query.searchQuery && termNotLoadedFromQuery) {
      setTerm(router.query.searchQuery as string)
      termNotLoadedFromQuery.current = false
    }
  }, [router.isReady, router.query.searchQuery])

  const setQueryParam = useCallback(
    (query: string) => {
      const queryToSet = router.query

      if (!query) delete queryToSet.searchQuery
      else queryToSet.searchQuery = query.trim()

      router.push(
        {
          pathname: '/blog',
          query: { ...queryToSet },
        },
        undefined,
        {
          shallow: true,
        }
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.query]
  )

  const debounceSetSearchQuery = useMemo(
    () => debounce(setQueryParam, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.query]
  )

  useEffect(() => {
    return () => {
      debounceSetSearchQuery.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query])

  return (
    <div
      className={`ml-10 bg-white/80 border focus-ring rounded-xl focus-within:border-primary focus-within:ring focus-within:ring-primary focus-within:ring-opacity-50 ${className}`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center justify-between"
      >
        <input
          className="flex-1 px-2 m-1 text-gray-700 placeholder-gray-400 bg-transparent w-60 focus:outline-none"
          type="text"
          placeholder="Search Posts"
          value={term}
          onChange={handleChange}
        />
        <button className="flex items-center justify-center p-2 m-0.5 text-white transition-colors duration-300 transform rounded-xl bg-indigo-500 hover:bg-indigo-500/70 focus:outline-none focus:bg-indigo-500/70">
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}

export default Search
