import RovingTab from '@/context/rovingTab/RovingTab'
import { Category } from '@/types/Category'
import { XMarkIcon } from '@heroicons/react/20/solid'
import CategoryLabel from './CategoryLabel'

type Props = {
  categories: Array<Category>
  setCategories: React.Dispatch<React.SetStateAction<Array<Category>>>
}

export default function CategoryList({ categories, setCategories }: Props) {
  const onRemove = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <RovingTab as="ul" className="flex flex-wrap gap-1">
      {categories.map((category, index) => (
        <RovingTab.Item key={category.name} as="li">
          {({ tabIndex, ref, refocus }) => (
            <CategoryLabel key={category.name} hexColor={category.hexColor}>
              {category.name}
              <button
                type="button"
                className="ml-3 inline size-6 rounded-full hover:bg-red-500 focus:bg-red-500 focus:outline-none"
                ref={ref as React.RefObject<HTMLButtonElement>}
                onClick={() => {
                  onRemove(index)
                  refocus()
                }}
                onKeyDown={(event) => {
                  switch (event.code) {
                    case 'Backspace':
                    case 'Delete':
                      onRemove(index)
                      refocus()
                      break
                    default:
                      return
                  }
                }}
                tabIndex={tabIndex}
              >
                <XMarkIcon className="text-gray-700 group-hover:text-black dark:text-gray-50" />
              </button>
            </CategoryLabel>
          )}
        </RovingTab.Item>
      ))}
    </RovingTab>
  )
}
