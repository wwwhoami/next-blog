import { Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import React from 'react'

type Props = {
  options: string[] | number[]
  value?: string | number | readonly string[]
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  ariaLabel?: string
}

function ToolbarSelect({ options, value, onChange, ariaLabel }: Props) {
  return (
    <div className="relative text-gray-700 focus-within:text-gray-900 hover:text-gray-900 dark:text-gray-100 dark:focus-within:text-gray-900 dark:hover:text-gray-900">
      <Select
        onChange={onChange}
        value={value}
        className={
          'focus-ring-secondary w-full appearance-none rounded-lg bg-transparent p-2 pr-6 text-sm font-normal focus-within:ring hover:bg-gray-300 focus:bg-gray-300 focus:outline-none'
        }
        aria-label={ariaLabel}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
      <ChevronDownIcon className="pointer-events-none absolute right-1.5 top-2.5 size-4" />
    </div>
  )
}

export default ToolbarSelect
