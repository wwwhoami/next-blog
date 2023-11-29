import { Switch } from '@headlessui/react'
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
        className={`hover-ring focus-ring relative mb-4 mr-4 h-auto w-auto cursor-pointer rounded-full px-6 py-3 transition ${
          isChecked ? 'bg-black text-white' : 'bg-slate-100 text-black'
        } ${
          !available && !isChecked ? 'cursor-default opacity-20' : 'opacity-100'
        }`}
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
