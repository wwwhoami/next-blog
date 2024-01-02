'use_client'

import RovingTab from '@/context/rovingTab/RovingTab'
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
      <h2 className="col-span-full mb-6 mt-3 text-2xl font-medium dark:text-slate-200">
        Search posts by topics
      </h2>
      <RovingTab className="flex flex-wrap gap-x-4 gap-y-2" as="ul">
        {categories?.map((category, index) => (
          <RovingTab.Item key={category.name} as="li" className="py-3">
            {({ tabIndex, ref }) => (
              <CategorySwitch
                key={index}
                name={category.name}
                hexColor={category.hexColor}
                onCategoryDeselect={handleCategoryDeselect}
                onCategorySelect={handleCategorySelect}
                available={categoryCombinations?.has(category.name)}
                selected={selectedCategories.has(category.name)}
                ref={ref as React.Ref<HTMLInputElement>}
                tabIndex={tabIndex}
              />
            )}
          </RovingTab.Item>
        ))}
      </RovingTab>
    </>
  )
}

export default CategorySelect
