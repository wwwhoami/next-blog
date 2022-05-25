import debounce from 'lodash.debounce'
import { useRouter } from 'next/router'
import React, {
  FormEvent,
  MutableRefObject,
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
  const [term, setTerm] = useState('')
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (router.route !== '/blog')
      router.push(`/blog?searchQuery=${inputRef.current.value}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value)
  }

  const debouncedResults = useMemo(
    () => debounce(handleChange, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useEffect(() => {
    if (router.isReady)
      if (router.query.searchQuery) {
        console.log(`1 ${router.query.searchQuery}`)
        inputRef.current.value = router.query.searchQuery as string
        setTerm(router.query.searchQuery as string)
      }
  }, [router.isReady, router.query.searchQuery])

  useEffect(() => {
    if (router.isReady && router.route === '/blog') {
      const queryToSet = router.query

      if (!term) delete queryToSet.searchQuery
      else queryToSet.searchQuery = term

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, router.isReady])

  useEffect(() => {
    return () => {
      debouncedResults.cancel()
    }
  })

  return (
    <div
      className={`ml-10 h-10 bg-white/80 border focus-ring rounded-xl focus-within:border-primary focus-within:ring focus-within:ring-primary focus-within:ring-opacity-50 ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-wrap justify-between">
        <input
          className="flex-1 w-60 px-2 m-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
          type="text"
          placeholder="Search Posts"
          ref={inputRef}
          onChange={debouncedResults}
        />
        <button className="flex items-center justify-center p-2 m-1 text-white transition-colors duration-300 transform rounded-xl lg:w-8 lg:h-8 lg:p-0 bg-indigo-500 hover:bg-indigo-500/70 focus:outline-none focus:bg-indigo-500/70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>
    </div>
  )
}

export default Search
