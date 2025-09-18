import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'

function useLocalStorage<T>(key: string, defaultValue: T, saveDelay = 500) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return // SSR guard

    try {
      const raw = localStorage.getItem(key)
      if (raw !== null) {
        setValue(JSON.parse(raw) as T)
      }
    } catch (err) {
      console.warn('useLocalStorage: read error for key', key, err)
    } finally {
      setIsReady(true)
    }
  }, [key])

  const write = useCallback(
    (v: T) => {
      if (typeof window === 'undefined') return

      try {
        localStorage.setItem(key, JSON.stringify(v))
      } catch (err) {
        console.warn(`useLocalStorage: write error for key ${key}`, err)
      }
    },
    [key],
  )

  const debouncedWrite = useMemo(
    () => debounce(write, saveDelay),
    [write, saveDelay],
  )

  useEffect(() => () => debouncedWrite.cancel(), [debouncedWrite])

  useEffect(() => {
    if (!isReady) return

    debouncedWrite(value)
  }, [value, isReady, debouncedWrite])

  return [value, setValue, isReady] as const
}

export default useLocalStorage
