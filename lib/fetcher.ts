export default async function fetcher<T>(url: string) {
  const res = await fetch(url)

  if (!res.ok) {
    console.error(await res.json())
    throw new Error(await res.json())
  }

  const data: T = await res.json()

  return data
}
