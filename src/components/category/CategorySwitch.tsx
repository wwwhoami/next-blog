import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'

type Props = {
  name: string
  hexColor?: string | null
  setSelectedCategories?: React.Dispatch<React.SetStateAction<string[]>>
  onCategorySelect: (category: string) => void
  onCategoryDeselect: (category: string) => void
  available?: boolean
  selected?: boolean
}

const CategorySwitch = ({
  name,
  hexColor,
  onCategorySelect,
  onCategoryDeselect,
  available = true,
  selected = false,
}: Props) => {
  const [isChecked, setIsChecked] = useState(false)
  const ref = useRef() as MutableRefObject<HTMLInputElement>

  const handleChange = (checked: boolean) => {
    if (!available && !isChecked) return

    setIsChecked(checked)

    const value = name

    if (checked) {
      onCategorySelect(value)
    } else {
      onCategoryDeselect(value)
    }
  }

  useEffect(() => {
    setIsChecked(selected)
  }, [selected])

  return (
    <>
      <Switch
        checked={isChecked}
        disabled={!available && !isChecked}
        value={name}
        onChange={handleChange}
        className={clsx(
          `hover-ring focus-ring relative mb-4 mr-4 h-auto w-auto cursor-pointer rounded-full px-6 py-3 transition`,
          {
            'bg-black text-white dark:bg-slate-100 dark:text-black': isChecked,
            'bg-slate-100 text-black dark:bg-slate-700 dark:text-white':
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
        <span>{name}</span>
      </Switch>
    </>
  )
}

export default CategorySwitch
