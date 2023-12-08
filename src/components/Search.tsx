'use client'

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid'
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
  const inputRef = useRef<HTMLInputElement>(null)

  const isMacOsNavigator = navigator.platform.indexOf('Mac') === 0

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (pathname !== '/blog') router.push(`/blog?searchQuery=${term.trim()}`)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value)
    if (pathname === '/blog') debounceSetSearchQuery(e.target.value)
  }

  const handleClearButtonClick = () => {
    setTerm('')
    inputRef.current?.focus()
    if (pathname === '/blog') debounceSetSearchQuery('')
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

  useEffect(() => {
    const handleKeyDownMac = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    const handleKeyDownWindows = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.ctrlKey) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    const handleKeyDown =
      navigator.platform.indexOf('Mac') === 0
        ? handleKeyDownMac
        : handleKeyDownWindows

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setTerm('')
      inputRef.current?.blur()
    }
  }

  return (
    <div
      className={clsx(
        'focus-ring focus-within:border-primary focus-within:ring-primary mx-auto md:ml-5 lg:ml-10 rounded-xl bg-white hover:bg-gray-50 focus-within:bg-gray-50 dark:bg-gray-700/80 dark:hover:bg-gray-800 dark:focus-within:bg-gray-800 focus-within:ring focus-within:ring-opacity-50 dark:focus-within:ring-opacity-80 shadow-md border-indigo-100 border dark:border-none w-72',
        className,
      )}
    >
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-wrap items-center justify-between"
      >
        <MagnifyingGlassIcon className="w-5 h-5 mx-2" />
        <input
          className="flex-1 h-8 my-1 text-gray-700 placeholder-gray-400 bg-transparent dark:text-gray-200 focus:outline-none"
          type="text"
          placeholder="Type to find posts..."
          value={term}
          ref={inputRef}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        {term.length !== 0 ? (
          <button
            type="button"
            className="inline w-5 h-5 mr-2 rounded-full focus-ring"
            onClick={handleClearButtonClick}
          >
            <XMarkIcon />
          </button>
        ) : (
          <kbd className="inline mx-2 font-sans text-sm font-semibold text-gray-500 dark:text-gray-400">
            {isMacOsNavigator ? (
              <abbr
                title="Command"
                className="text-gray-500 no-underline dark:text-gray-400"
              >
                ⌘
              </abbr>
            ) : (
              <abbr
                title="Control"
                className="text-xs text-gray-500 no-underline dark:text-gray-400"
              >
                Ctrl
              </abbr>
            )}{' '}
            K
          </kbd>
        )}
      </form>
    </div>
  )
}

export default Search
