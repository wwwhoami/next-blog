import { Category } from '@/types/Post'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
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

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>()

  const { data: categories } = useSWR<Omit<Category, 'description'>[]>(
    `${process.env.NEXT_PUBLIC_API_URL}category`,
    categoryFetcher
  )

  const { data: categoryCombinations } = useSWR<string[][]>(
    `${process.env.NEXT_PUBLIC_API_URL}category/combo`,
    categoryCombinationsFetcher
  )

  useEffect(() => {
    const selectedCategoryQuery = selectedCategories.join(' ')
    const currentQuery = router.query

    if (selectedCategories.length === 0) delete currentQuery.category
    else currentQuery.category = selectedCategoryQuery

    router.push(
      {
        pathname: '/blog',
        query: { ...currentQuery },
      },
      undefined,
      {
        shallow: true,
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories])

  useEffect(() => {
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

    if (availableCategories) {
      setAvailableCategories(availableCategories)
    }
  }, [categoryCombinations, selectedCategories])

  useEffect(() => {
    if (router.query.category) {
      setSelectedCategories((router.query.category as string).split(' '))
    }
  }, [router.query.category])

  return (
    <>
      <div className="mt-3 text-2xl font-medium text-black col-span-full mb-6">
        Search posts by topics
      </div>
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
    </>
  )
}

export default CategorySelect
