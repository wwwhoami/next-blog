import React, { MutableRefObject, useEffect, useRef, useState } from 'react'

type Props = {
  name: string
  hexColor?: string | null
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >
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
  const ref: MutableRefObject<HTMLInputElement> = useRef()

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

  // useEffect(() => {
  //   if (isChecked)
  //     setSelectedCategories((prev) =>
  //       prev ? [...prev, ref.current.value] : [ref.current.value]
  //     )
  //   else if (!isChecked)
  //     setSelectedCategories((prev) =>
  //       prev?.filter((val) => val !== ref.current.value)
  //     )
  // }, [isChecked, setSelectedCategories])

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
