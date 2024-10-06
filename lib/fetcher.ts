import { FetchError } from 'src/entities/FetchError'

type Options = {
  cache?: 'force-cache' | 'no-store'
  next?: {
    revalidate?: false | 0 | number
    tags?: string[]
  }
}

/**
 * @param url The URL to fetch data from.
 * @param options [options={cache: 'force-cache'}] The options to use when fetching data.
 * @description Fetches data from the specified URL.
 * And parses the response as JSON.
 * @throws {FetchError} If the response is not OK.
 */
export default async function fetcher<T>(
  url: string,
  options: Options & RequestInit = {
    cache: 'force-cache',
  },
) {
  const res = await fetch(url, options)

  if (!res.ok) {
    const errorRes = await res.json()
    const message = errorRes?.message ?? 'An error occurred while fetching data'
    const error = new FetchError(message, res.status, errorRes)

    throw error
  }

  const data: T = await res.json()

  return data
}
