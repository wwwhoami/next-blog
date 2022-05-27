import { Category } from '@/types/Post'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import CategoryLabel from './CategoryLabel'

type Props = {}

const categoryFetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) throw new Error(await res.text())

  const categories: Omit<Category, 'description'>[] = await res.json()

  return categories
}

const categoryCombinationsFetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) throw new Error(await res.text())

  const categoryCominations: string[][] = await res.json()

  return categoryCominations
}

const CategorySelect = ({}: Props) => {
  const router = useRouter()
  const searchQuery = router.query.searchQuery
    ? `?searchQuery=${router.query.searchQuery}`
    : ''
  const { mutate } = useSWRConfig()

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

      mutate(`${process.env.NEXT_PUBLIC_API_URL}/post/search`)

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
      <div className="mt-3 text-2xl font-medium text-black col-span-full mb-6">
        Search posts by topics
      </div>
      <div className="-mb-4 -mr-4 flex flex-wrap">
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
