import { Category } from '@/types/Category'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
  Transition,
} from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { Fragment, useMemo, useState } from 'react'

type Props = {
  categories: Array<Category>
  selected: Array<Category>
  handleAdd: (category: Category[]) => void
}

const normalizeCategoryName = (name: string) => name.trim().toLowerCase()

export default function MyCombobox({ categories, selected, handleAdd }: Props) {
  const [query, setQuery] = useState('')

  const categoryName = query.trim()
  const normalizedQuery = normalizeCategoryName(categoryName)

  const mergedCategories = useMemo(() => {
    const uniqueCategories = new Map<string, Category>()

    for (const category of selected.concat(categories)) {
      const key = normalizeCategoryName(category.name)

      if (!uniqueCategories.has(key)) {
        uniqueCategories.set(key, category)
      }
    }

    return Array.from(uniqueCategories.values())
  }, [categories, selected])

  const filteredCategories = useMemo(
    () =>
      mergedCategories.filter((category) =>
        normalizeCategoryName(category.name).startsWith(normalizedQuery),
      ),
    [mergedCategories, normalizedQuery],
  )

  function isSelected(categoryName: string) {
    return mergedCategories.some(
      (category) =>
        normalizeCategoryName(category.name) ===
        normalizeCategoryName(categoryName),
    )
  }

  return (
    <div className="grow">
      <Combobox value={selected} onChange={handleAdd} multiple>
        <div className="relative mt-1">
          <div className="focus-ring-primary relative w-full cursor-default overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-md focus-within:ring sm:text-sm dark:border-slate-700 dark:bg-slate-700">
            <Label className="sr-only">Add category</Label>
            <ComboboxInput
              className="w-full border-none bg-transparent py-2 pr-10 pl-3 text-sm leading-5 text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:text-gray-200 dark:placeholder:text-gray-400"
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200">
              <ChevronUpDownIcon
                className="size-5 text-gray-400"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 text-base text-gray-900 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200">
              {normalizedQuery !== '' && !isSelected(normalizedQuery) && (
                <ComboboxOption
                  key={normalizedQuery}
                  className={({ focus }) =>
                    `relative cursor-default py-2 pr-4 pl-10 select-none ${
                      focus
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-900 dark:text-gray-200'
                    }`
                  }
                  value={{
                    name: categoryName,
                    hexColor: null,
                    description: '',
                  }}
                >
                  <span className="block truncate">Create: {categoryName}</span>
                </ComboboxOption>
              )}
              {filteredCategories.map((category) => (
                <ComboboxOption
                  key={category.name}
                  className={({ focus }) =>
                    `relative cursor-default py-2 pr-4 pl-10 select-none ${
                      focus
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-900 dark:text-gray-200'
                    }`
                  }
                  value={category}
                >
                  {({ selected, focus }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {category.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            focus ? 'text-white' : 'text-indigo-400'
                          }`}
                        >
                          <CheckIcon className="size-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
