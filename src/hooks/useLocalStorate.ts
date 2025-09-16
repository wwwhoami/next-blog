import debounce from 'lodash.debounce'
import { useCallback, useEffect, useState } from 'react'

const debounceSaveContentWait = 500

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    // Load initial value from localStorage
    const json = localStorage.getItem(key)
    return json !== null ? JSON.parse(json) : defaultValue
  })

  const saveContent = useCallback(
    (value: T) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    [key],
  )

  const debounceSaveContent = debounce(saveContent, debounceSaveContentWait)

  useEffect(() => {
    debounceSaveContent(value)
  }, [debounceSaveContent, value])

  return [value, setValue] as const
}

export default useLocalStorage
