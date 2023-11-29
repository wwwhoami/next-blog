'use_client'

import fetcher from '@/lib/fetcher'
import { Category } from '@/types/Category'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import useSWR from 'swr'
import CategorySwitch from './CategorySwitch'

const categoryFetcher = async (url: string) => {
  return fetcher<Omit<Category, 'description'>[]>(url)
}

const categoryCombinationsFetcher = async (url: string) => {
  return fetcher<string[][]>(url)
}

type Props = {}

const CategorySelect = ({}: Props) => {
  const router = useRouter()
  const query = useSearchParams()

  const selectedCategories = useMemo(
    () => query.get('category')?.split(' ') ?? [],
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

  const searchQuery = query.has('searchQuery')
    ? `?searchTerm=${query.get('searchQuery')}`
    : ''

  const { data: categoryCombinations } = useSWR<string[][]>(
    `${process.env.NEXT_PUBLIC_API_URL}/category/combo${searchQuery}`,
    categoryCombinationsFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    },
  )

  const availableCategories = useMemo(() => {
    const hasCombination = categoryCombinations?.map((categories) =>
      selectedCategories?.length
        ? selectedCategories?.every((selected) => categories.includes(selected))
        : true,
    )

    return categoryCombinations
      ?.flatMap((categories, index) => {
        if (hasCombination?.length && hasCombination[index])
          return categories.filter(
            (category) => !selectedCategories?.includes(category),
          )
      })
      .filter((e): e is string => e !== undefined)
  }, [categoryCombinations, selectedCategories])

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
    const nextSelectedCategories = [...selectedCategories, category]
    handleSelectedCategoriesChange(nextSelectedCategories)
  }

  const handleCategoryDeselect = (category: string) => {
    const nextSelectedCategories = selectedCategories.filter(
      (selectedCategory) => selectedCategory !== category,
    )
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
            available={availableCategories?.some(
              (availableCategory) => availableCategory === category.name,
            )}
            selected={selectedCategories?.some(
              (selectedCategory) => selectedCategory === category.name,
            )}
          />
        ))}
      </div>
    </>
  )
}

export default CategorySelect
