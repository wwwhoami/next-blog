import { useEffect, useRef } from 'react'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'
import useOnScreen from './useOnScreen'

export const useInfiniteLoading = <T extends any[]>(
  getKey: SWRInfiniteKeyLoader,
  fetcher: (...args: any) => Promise<T>,
  fallbackData?: T[]
) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>
  const isVisible = useOnScreen(ref)
  const { data, error, size, setSize, isValidating } = useSWRInfinite<T>(
    (...args) => getKey(...args),
    fetcher,
    { fallbackData }
  )

  const isEmpty = data?.[0]?.length === 0
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined' && !isEmpty)
  const isRefreshing = isValidating && data && data.length === size

  useEffect(() => {
    if (isVisible && !isRefreshing) {
      setSize(size + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, isRefreshing])

  return {
    ref,
    isLoadingInitialData,
    isLoadingMore,
    isRefreshing,
    isEmpty,
    data,
    size,
  }
}
