import { Category } from '@/types/Category'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { Fragment, useMemo, useRef, useState } from 'react'

type Props = {
  categories: Array<Category>
  selected: Array<Category>
  handleAdd: (category: Category[]) => void
}

const normalizeCategoryName = (name: string) => name.trim().toLowerCase()

export default function MyCombobox({ categories, selected, handleAdd }: Props) {
  const [query, setQuery] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const mergedCategories = useMemo(
    () => {
      const uniqueCategories = new Map<string, Category>()

      for (const category of selected.concat(categories)) {
        const key = normalizeCategoryName(category.name)

        if (!uniqueCategories.has(key)) {
          uniqueCategories.set(key, category)
        }
      }

      return Array.from(uniqueCategories.values())
    },
    [categories, selected],
  )

  const filteredCategories = useMemo(
    () =>
      mergedCategories.filter((category) =>
        normalizeCategoryName(category.name).startsWith(
          normalizeCategoryName(query),
        ),
      ),
    [mergedCategories, query],
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
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <ComboboxInput
              className="w-full border-none py-2 pr-10 pl-3 text-sm leading-5 focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
              ref={inputRef}
              autoComplete="off"
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
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
            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {query !== '' && !isSelected(query) && (
                <ComboboxOption
                  key={query}
                  className={({ focus }) =>
                    `relative cursor-default py-2 pr-4 pl-10 select-none ${
                      focus ? 'bg-teal-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={{
                    name: query,
                    hexColor: null,
                    description: '',
                  }}
                >
                  <span className="block truncate">Create: {query}</span>
                </ComboboxOption>
              )}
              {filteredCategories.map((category) => (
                <ComboboxOption
                  key={category.name}
                  className={({ focus }) =>
                    `relative cursor-default py-2 pr-4 pl-10 select-none ${
                      focus ? 'bg-teal-600 text-white' : 'text-gray-900'
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
                            focus ? 'text-white' : 'text-teal-600'
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
