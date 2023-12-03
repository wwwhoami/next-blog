'use_client'

import fetcher from '@/lib/fetcher'
import { Category } from '@/types/Category'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import useSWR from 'swr'
import CategorySwitch from './CategorySwitch'

const categoryFetcher = async (url: string) => {
  return fetcher<Omit<Category, 'description'>[]>(url, { cache: 'no-store' })
}

const getCategoryCombinationsKey = (
  searchQuery?: string,
  categories?: string[],
) => {
  const query = new URLSearchParams()
  if (searchQuery) query.set('searchTerm', searchQuery)
  if (categories?.length) query.set('categories', categories.join(' '))

  return `${process.env.NEXT_PUBLIC_API_URL}/category/combo?${query.toString()}`
}

const categoryCombinationsFetcher = async (url: string) => {
  const categoryCombinations = await fetcher<Array<string>>(`${url}`)

  const categoryCombinationsSet = new Set<string>(categoryCombinations)

  return categoryCombinationsSet
}

type Props = {}

const CategorySelect = ({}: Props) => {
  const router = useRouter()
  const query = useSearchParams()

  const selectedCategories = useMemo(
    () => new Set(query.get('category')?.split(' ')),
    [query],
  )

  const { data: categories } = useSWR<Omit<Category, 'description'>[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    categoryFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    },
  )

  const searchQuery = query.get('searchQuery') ?? undefined

  const { data: categoryCombinations } = useSWR<Set<string>>(
    () =>
      getCategoryCombinationsKey(searchQuery, Array.from(selectedCategories)),
    categoryCombinationsFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    },
  )

  const handleSelectedCategoriesChange = (categories: string[]) => {
    const queryToSet = new URLSearchParams(query)

    if (categories.length === 0) queryToSet.delete('category')
    else {
      const selectedCategoryQuery = categories.join(' ')
      queryToSet.set('category', selectedCategoryQuery)
    }

    router.push(`/blog?${queryToSet.toString()}`)
  }

  const handleCategorySelect = (category: string) => {
    const nextSelectedCategories = Array.from(selectedCategories)
    nextSelectedCategories.push(category)
    handleSelectedCategoriesChange(nextSelectedCategories)
  }

  const handleCategoryDeselect = (category: string) => {
    selectedCategories.delete(category)
    const nextSelectedCategories = Array.from(selectedCategories)
    handleSelectedCategoriesChange(nextSelectedCategories)
  }

  return (
    <>
      <h2 className="mt-3 mb-6 text-2xl font-medium text-black col-span-full">
        Search posts by topics
      </h2>
      <div className="flex flex-wrap -mb-4 -mr-4">
        {categories?.map((category, index) => (
          <CategorySwitch
            key={index}
            name={category.name}
            hexColor={category.hexColor}
            onCategoryDeselect={handleCategoryDeselect}
            onCategorySelect={handleCategorySelect}
            available={categoryCombinations?.has(category.name)}
            selected={selectedCategories.has(category.name)}
          />
        ))}
      </div>
    </>
  )
}

export default CategorySelect
