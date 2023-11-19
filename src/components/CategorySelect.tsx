import fetcher from '@/lib/fetcher'
import { Category } from '@/types/Category'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import CategoryLabel from './CategoryLabel'

const categoryFetcher = async (url: string) => {
  return fetcher<Omit<Category, 'description'>[]>(url)
}

const categoryCombinationsFetcher = async (url: string) => {
  return fetcher<string[][]>(url)
}

type Props = {}

const CategorySelect = ({}: Props) => {
  const router = useRouter()
  const searchQuery = router.query.searchQuery
    ? `?searchQuery=${router.query.searchQuery}`
    : ''

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const selectedCategoriesNotLoadedFromQuery = useRef(true)

  const { data: categories } = useSWR<Omit<Category, 'description'>[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    categoryFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    }
  )

  const { data: categoryCombinations } = useSWR<string[][]>(
    `${process.env.NEXT_PUBLIC_API_URL}/category/combo${searchQuery}`,
    categoryCombinationsFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    }
  )

  const availableCategories = useMemo(() => {
    const hasCombination = categoryCombinations?.map((categories) =>
      selectedCategories?.length
        ? selectedCategories?.every((selected) => categories.includes(selected))
        : true
    )

    const availableCategories = categoryCombinations
      ?.flatMap((categories, index) => {
        if (hasCombination && hasCombination[index])
          return categories.filter(
            (category) => !selectedCategories?.includes(category)
          )
      })
      .filter((e) => e) as string[]

    return availableCategories
  }, [categoryCombinations, selectedCategories])

  useEffect(() => {
    if (
      router.isReady &&
      router.query.category &&
      selectedCategoriesNotLoadedFromQuery
    ) {
      setSelectedCategories((router.query.category as string).split(' '))
      selectedCategoriesNotLoadedFromQuery.current = false
    }
  }, [router.isReady, router.query.category])

  useEffect(() => {
    if (router.isReady) {
      const selectedCategoryQuery = selectedCategories.join(' ')
      const queryToSet = router.query

      if (selectedCategories.length === 0) delete queryToSet.category
      else queryToSet.category = selectedCategoryQuery

      router.push(
        {
          pathname: '/blog',
          query: { ...queryToSet },
        },
        undefined,
        {
          shallow: true,
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories])

  return (
    <>
      <div className="mt-3 mb-6 text-2xl font-medium text-black col-span-full">
        Search posts by topics
      </div>
      <div className="flex flex-wrap -mb-4 -mr-4">
        {categories?.map((category, index) => (
          <CategoryLabel
            key={index}
            name={category.name}
            hexColor={category.hexColor}
            setSelectedCategories={setSelectedCategories}
            available={availableCategories?.some(
              (availableCategory) => availableCategory === category.name
            )}
            selected={selectedCategories?.some(
              (selectedCategory) => selectedCategory === category.name
            )}
          />
        ))}
      </div>
    </>
  )
}

export default CategorySelect
