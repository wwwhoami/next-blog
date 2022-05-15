import { useEffect, useRef } from 'react'
import useSWRInfinite, { SWRInfiniteKeyLoader } from 'swr/infinite'
import useOnScreen from './useOnscreen'

type Props<T> = {
  getKey: SWRInfiniteKeyLoader
  fetcher: (...args: any) => Promise<T>
  fallbackData?: T[]
}

export const useInfiniteLoading = <T>({
  getKey,
  fetcher,
  fallbackData,
}: Props<T>) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>
  const isVisible = useOnScreen(ref)
  const { data, error, size, setSize, isValidating } = useSWRInfinite<T>(
    (pageIndex, ...args) => getKey(pageIndex, ...args),
    fetcher,
    { fallbackData }
  )

  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined')
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
    data,
  }
}
