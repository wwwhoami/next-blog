import { Category } from '@/types/Post'
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

const CategorySelect = (props: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>()
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
    const hasCombination = categoryCombinations?.map((categories) =>
      selectedCategories?.every((selected) => categories.includes(selected))
    )

    const availableCategories = categoryCombinations
      ?.flatMap((categories, index) => {
        if (hasCombination && hasCombination[index])
          return categories.filter(
            (category) => !selectedCategories?.includes(category)
          )
      })
      .filter((e) => e) as string[]

    setAvailableCategories(availableCategories)
  }, [selectedCategories])

  useEffect(() => {
    setAvailableCategories(categories?.map((category) => category.name))
  }, [categories])

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
          available={
            availableCategories?.length
              ? availableCategories.some(
                  (availableCategory) => availableCategory === category.name
                )
              : false
          }
        />
      ))}
    </>
  )
}

export default CategorySelect
