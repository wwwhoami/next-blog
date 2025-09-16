import fetcher from '@/lib/fetcher'
import { Category } from '@/types/Category'
import useSWR from 'swr'
import MyCombobox from '../form/ComboBox'
import CategoryList from './CategoryList'

type Props = {
  selectedCategories: Array<Category>
  setSelectedCategories: React.Dispatch<React.SetStateAction<Array<Category>>>
}

const categoryFetcher = async (url: string) =>
  fetcher<Array<Category>>(url, { cache: 'no-store' })

export default function CategoryInput({
  selectedCategories,
  setSelectedCategories,
}: Props) {
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
