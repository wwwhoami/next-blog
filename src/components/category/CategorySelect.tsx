'use_client'

import RovingTab from '@/context/rovingTab/RovingTab'
import fetcher from '@/lib/fetcher'
import { Category } from '@/types/Category'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef } from 'react'
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

  /** @description
   * Ref of previously selected categories.
   * Used to restore the selected categories intersecting with the category combinations.
   */
  const prevSelectedCategories = useRef<Array<string>>(new Array())

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

  /**
   * @param categories - The selected categories to update the query with.
   * @description Updates the query with the selected categories. If there are no
   * selected categories, the category query parameter is removed from the query.
   */
  const handleSelectedCategoriesChange = useCallback(
    (categories: string[]) => {
      const queryToSet = new URLSearchParams(query)

      if (categories.length === 0) queryToSet.delete('category')
      else {
        const selectedCategoryQuery = categories.join(' ')
        queryToSet.set('category', selectedCategoryQuery)
      }

      router.push(`/blog?${queryToSet.toString()}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query],
  )

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

  /**
   * @description This effect is used to update the selected categories when the category combinations change.
   * If the category combinations are empty and there are selected categories, then clear the selected categories.
   * If the category combinations are not empty and there are selected categories that are not in the category combinations,
   * then remove the selected categories that are not in the category combinations and update the query with the new selected categories.
   * This effect is used to ensure that the selected categories are always in the category combinations.
   */
  useEffect(() => {
    if (!categoryCombinations) return

    // If the category combinations are empty and there are selected categories,
    // then clear the selected categories, while keeping track of them in the ref.
    if (categoryCombinations.size === 0) {
      prevSelectedCategories.current = Array.from(selectedCategories)

      handleSelectedCategoriesChange([])
    }

    // If the category combinations are not empty, there are no currently selected categories,
    // and there are previously selected categories, then set the previously selected categories,
    // intersecting with the category combinations as the new selected categories.
    if (
      categoryCombinations.size > 0 &&
      prevSelectedCategories.current.length > 0 &&
      selectedCategories.size === 0
    ) {
      const newSelectedCategories = prevSelectedCategories.current.filter(
        (category) => categoryCombinations.has(category),
      )
      // Reset the previous selected categories to an empty array.
      prevSelectedCategories.current = []

      handleSelectedCategoriesChange(newSelectedCategories)
    }
  }, [categoryCombinations, handleSelectedCategoriesChange, selectedCategories])

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
