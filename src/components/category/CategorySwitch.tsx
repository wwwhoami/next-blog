import clsx from 'clsx'
import React, { forwardRef, useEffect, useState } from 'react'

type Props = {
  name: string
  hexColor?: string | null
  setSelectedCategories?: React.Dispatch<React.SetStateAction<string[]>>
  onCategorySelect: (category: string) => void
  onCategoryDeselect: (category: string) => void
  available?: boolean
  selected?: boolean
  tabIndex?: number
}

const CategorySwitch = forwardRef<HTMLInputElement, Props>(
  (
    {
      name,
      hexColor,
      onCategorySelect,
      onCategoryDeselect,
      available = true,
      selected = false,
      tabIndex,
    },
    ref,
  ) => {
    const [isChecked, setIsChecked] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!available && !isChecked) return

      setIsChecked(e.target.checked)

      const value = e.target.value
      if (e.target.checked) {
        onCategorySelect(value)
      } else if (!e.target.checked) {
        onCategoryDeselect(value)
      }
    }

    useEffect(() => {
      setIsChecked(selected)
    }, [selected])

    return (
      <label
        className={clsx(
          `focus-within:ring hover-ring-primary focus-ring-primary relative h-auto w-auto cursor-pointer rounded-full px-6 py-3 transition`,
          {
            'bg-black text-white dark:bg-slate-100 dark:text-black': isChecked,
            'bg-slate-100 text-black dark:bg-gray-700 dark:text-white':
              !isChecked,
          },
          {
            'cursor-default opacity-20': !available && !isChecked,
            'opacity-100': available || isChecked,
          },
        )}
        style={{
          ['--tw-ring-color' as any]: hexColor,
        }}
      >
        <input
          type="checkbox"
          value={name}
          checked={isChecked}
          disabled={!available && !isChecked}
          className="sr-only"
          onChange={handleChange}
          ref={ref}
          tabIndex={tabIndex}
        />
        <span>{name}</span>
      </label>
    )
  },
)

CategorySwitch.displayName = 'CategorySwitch'

export default CategorySwitch
