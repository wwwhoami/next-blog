import { FetchError } from 'src/entities/FetchError'

type Options = {
  cache?: 'force-cache' | 'no-store'
  next?: {
    revalidate?: false | 0 | number
    tags?: string[]
  }
}

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
