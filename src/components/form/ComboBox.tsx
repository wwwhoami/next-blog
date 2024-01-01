import { Category } from '@/types/Category'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { Fragment, useMemo, useRef, useState } from 'react'

type Props = {
  categories: Array<Category>
  selected: Array<Category>
  handleAdd: (category: Category[]) => void
}

export default function MyCombobox({ categories, selected, handleAdd }: Props) {
  const [query, setQuery] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const mergedCategories = useMemo(
    () => Array.from(new Set(categories.concat(selected))),
    [categories, selected],
  )

  const filteredCategories = useMemo(
    () =>
      mergedCategories.filter((category) =>
        category.name.toLowerCase().startsWith(query.toLowerCase()),
      ),
    [mergedCategories, query],
  )

  function isSelected(categoryName: string) {
    return filteredCategories.some(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase(),
    )
  }

  return (
    <div className="flex-grow">
      <Combobox value={selected} onChange={handleAdd} multiple>
        <div className="relative mt-1">
          <div className="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full py-2 pl-3 pr-10 text-sm leading-5 border-none focus:ring-0"
              onChange={(event) => setQuery(event.target.value)}
              ref={inputRef}
              autoComplete="off"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {query !== '' && !isSelected(query) && (
                <Combobox.Option
                  key={query}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-teal-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={{
                    name: query,
                    hexColor: null,
                    description: '',
                  }}
                >
                  <span className="block truncate">Create: {query}</span>
                </Combobox.Option>
              )}
              {filteredCategories.map((category) => (
                <Combobox.Option
                  key={category.name}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-teal-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={category}
                >
                  {({ selected, active }) => (
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
                            active ? 'text-white' : 'text-teal-600'
                          }`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
