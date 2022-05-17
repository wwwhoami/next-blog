import React, { useState } from 'react'

type Props = {
  name: string
  hexColor?: string | null
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >
  available: boolean
}

const CategoryLabel = ({
  name,
  hexColor,
  setSelectedCategories,
  available = true,
}: Props) => {
  const [isChecked, setIsChecked] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!available && !isChecked) return

    const value = e.target.value
    if (e.target.checked) {
      setSelectedCategories((prev) => (prev ? [...prev, value] : [value]))
    } else {
      setSelectedCategories((prev) => prev?.filter((val) => val !== value))
    }
    setIsChecked(e.target.checked)
  }

  return (
    <label
      className={`relative mb-4 mr-4 h-auto w-auto cursor-pointer rounded-full px-6 py-3 transition hover-ring focus-ring ${
        isChecked ? 'text-white bg-black' : 'text-black bg-slate-100'
      } ${
        !available && !isChecked ? 'opacity-20 cursor-default' : 'opacity-100'
      }`}
      style={{
        ['--tw-ring-color' as any]: hexColor,
      }}
    >
      <input
        type="checkbox"
        value={name}
        className="sr-only"
        onChange={handleChange}
      />
      <span>{name}</span>
    </label>
  )
}

export default CategoryLabel
