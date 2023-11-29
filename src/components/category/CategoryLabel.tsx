import React, { MutableRefObject, useEffect, useRef, useState } from 'react'

type Props = {
  name: string
  hexColor?: string | null
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>
  available?: boolean
  selected?: boolean
}

const CategoryLabel = ({
  name,
  hexColor,
  setSelectedCategories,
  available = true,
  selected = false,
}: Props) => {
  const [isChecked, setIsChecked] = useState(false)
  const ref = useRef() as MutableRefObject<HTMLInputElement>

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!available && !isChecked) return

    setIsChecked(e.target.checked)

    const value = e.target.value
    if (e.target.checked) {
      setSelectedCategories((prev) => (prev ? [...prev, value] : [value]))
    } else if (!e.target.checked) {
      setSelectedCategories((prev) => prev?.filter((val) => val !== value))
    }
  }

  useEffect(() => {
    setIsChecked(selected)
  }, [selected])

  return (
    <label
      className={`hover-ring focus-ring relative mb-4 mr-4 h-auto w-auto cursor-pointer rounded-full px-6 py-3 transition ${
        isChecked ? 'bg-black text-white' : 'bg-slate-100 text-black'
      } ${
        !available && !isChecked ? 'cursor-default opacity-20' : 'opacity-100'
      }`}
      style={{
        ['--tw-ring-color' as any]: hexColor,
      }}
    >
      <input
        type="checkbox"
        value={name}
        checked={isChecked}
        className="sr-only"
        onChange={handleChange}
        ref={ref}
      />
      <span>{name}</span>
    </label>
  )
}

export default CategoryLabel
