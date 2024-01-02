import fetcher from '@/lib/fetcher'
import { Category } from '@/types/Category'
import { useState } from 'react'
import useSWR from 'swr'
import MyCombobox from '../form/ComboBox'
import CategoryList from './CategoryList'

type Props = {}

const categoryFetcher = async (url: string) =>
  fetcher<Array<Category>>(url, { cache: 'no-store' })

export default function CategoryInput({}: Props) {
  const { data: categories } = useSWR<Array<Category>>(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    categoryFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
    },
  )

  const [selectedCategories, setSelectedCategories] = useState<Array<Category>>(
    [],
  )

  return (
    <div className="flex w-full shrink flex-wrap gap-2">
      <CategoryList
        categories={selectedCategories}
        setCategories={setSelectedCategories}
      />

      <MyCombobox
        categories={categories ?? []}
        selected={selectedCategories}
        handleAdd={(categories: Array<Category>) => {
          setSelectedCategories(categories)
        }}
      />
    </div>
  )
}
