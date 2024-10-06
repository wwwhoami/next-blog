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

/**
 * @description The debounce wait time for the search query.
 */
const queryDebounceWait = 500

const Search = ({ className }: Props) => {
  const router = useRouter()
  const pathname = usePathname()
  const query = useSearchParams()

  const [term, setTerm] = useState(query.get('searchQuery') ?? '')

  /**
   * @description This ref prevents the search term from being loaded from the query
   * after the component has been mounted and the search term has been set from the query.
   */
  const termLoadedFromQuery = useRef(false)
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

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()

      setTerm('')
      inputRef.current?.blur()

      if (pathname === '/blog') debounceSetSearchQuery('')
    }
  }

  const handleClearButtonClick = () => {
    setTerm('')
    inputRef.current?.focus()

    if (pathname === '/blog') debounceSetSearchQuery('')
  }

  const setQueryParam = useCallback(
    (searchTerm: string) => {
      const searchParams = new URLSearchParams(query)

      if (!searchTerm) searchParams.delete('searchQuery')
      else
        searchParams.set('searchQuery', searchTerm.replace(/\s+/g, ' ').trim())

      router.push(`/blog?${searchParams.toString()}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  )

  const debounceSetSearchQuery = useMemo(
    () => debounce(setQueryParam, queryDebounceWait),
    [setQueryParam],
  )

  /**
   * @description This effect sets the search term from the query when the component is mounted.
   * It also prevents the search term from being loaded from the query after the component has been mounted
   * and the search term has been set from the query.
   */
  useEffect(() => {
    if (query.get('searchQuery') && !termLoadedFromQuery.current) {
      setTerm(query.get('searchQuery') || '')
      termLoadedFromQuery.current = true
    }

    return () => {
      debounceSetSearchQuery.cancel()
    }
  }, [debounceSetSearchQuery, query])

  /**
   * @description This effect focuses the input when the user presses the keyboard shortcut.
   */
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

  return (
    <div
      className={clsx(
        'focus-ring-primary focus-within:ring-primary mx-auto w-72 rounded-xl border border-indigo-100 bg-white shadow-md focus-within:bg-gray-50 focus-within:ring focus-within:ring-indigo-600/50 hover:bg-gray-50 dark:border-none dark:bg-gray-700/80 dark:focus-within:bg-gray-800 dark:focus-within:ring-indigo-600/80 dark:hover:bg-gray-800 md:ml-5 lg:ml-10',
        className,
      )}
    >
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-wrap items-center justify-between"
      >
        <MagnifyingGlassIcon className="mx-2 size-5" />
        <input
          className="my-1 h-8 flex-1 bg-transparent text-gray-700 placeholder:text-gray-400 focus:outline-none dark:text-gray-200"
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
            className="focus-ring-primary mr-2 inline size-5 rounded-full"
            onClick={handleClearButtonClick}
          >
            <XMarkIcon />
          </button>
        ) : (
          <kbd className="mx-2 inline font-sans text-sm font-semibold text-gray-500 dark:text-gray-400">
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
