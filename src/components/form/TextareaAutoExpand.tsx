'use client'

import { useEffect, useRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const textarea = tv({
  base: 'focus-ring-primary my-2 w-full resize-none overflow-hidden rounded-md border-b-2 border-gray-300 p-2 text-3xl focus:outline-none dark:border-gray-600 dark:bg-gray-800',
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '7xl': 'text-7xl',
      '8xl': 'text-8xl',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },
  defaultVariants: { size: 'md', weight: 'normal' },
})

type Props = VariantProps<typeof textarea> & {
  placeholder?: string
  rows?: number
  cols?: number
}

export function TextareaAutoExpand({
  placeholder,
  size,
  rows,
  cols,
  weight,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null) // Add type for textareaRef

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <textarea
      rows={rows || 1}
      cols={cols}
      placeholder={placeholder}
      className={textarea({ size, weight })}
      onInput={handleInput}
      ref={textareaRef}
    />
  )
}
