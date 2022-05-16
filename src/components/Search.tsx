import { useRouter } from 'next/router'
import React, { FormEvent, useEffect, useState } from 'react'

type Props = {
  className?: string
}

const Search = ({ className }: Props) => {
  const router = useRouter()
  const [term, setTerm] = useState(router.query.searchQuery ?? '')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/blog?searchQuery=${term}`)
  }

  useEffect(() => {
    setTerm(router.query.searchQuery ?? '')
  }, [router])

  return (
    <div
      className={`ml-10 h-10 bg-white/80 border focus-ring rounded-xl focus-within:border-primary focus-within:ring focus-within:ring-primary focus-within:ring-opacity-50 ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-wrap justify-between">
        <input
          className="flex-1 w-60 px-2 m-1 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
          type="text"
          value={term}
          placeholder="Search Posts"
          onChange={(e) => setTerm(e.target.value)}
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
