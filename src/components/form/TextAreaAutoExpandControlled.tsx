'use client'

import { Description, Field, Label, Textarea } from '@headlessui/react'
import { useEffect, useRef } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const textarea = tv({
  base: 'my-2 w-full resize-none overflow-hidden rounded-md border-b-2 border-gray-300 p-2 text-3xl focus:outline-none dark:border-gray-600 dark:bg-gray-800',
  variants: {
    invalid: {
      true: 'focus-ring-danger border-red-500 dark:border-red-400',
      false: 'focus-ring-primary',
    },
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
  defaultVariants: { invalid: false, size: 'md', weight: 'normal' },
})

type Props = VariantProps<typeof textarea> & {
  text: string
  setText: (s: string) => void
  label?: string
  description?: string
  error?: string
  placeholder?: string
  rows?: number
  cols?: number
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>
}

export function TextAreaAutoExpandControlled({
  text,
  setText,
  placeholder,
  size,
  rows,
  cols,
  label,
  description,
  error,
  onBlur,
  weight,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null) // Add type for textareaRef

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [])

  const handleInput: React.InputEventHandler<HTMLTextAreaElement> = (e) => {
    e.currentTarget.style.height = 'auto'
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`

    setText(e.currentTarget.value)
  }

  return (
    <Field>
      {label && <Label className="sr-only">{label}</Label>}
      {description && (
        <Description className="sr-only">{description}</Description>
      )}
      <Textarea
        rows={rows || 1}
        cols={cols}
        placeholder={placeholder}
        value={text}
        aria-label={label || 'Text area'}
        invalid={Boolean(error)}
        onInput={handleInput}
        onBlur={onBlur}
        className={textarea({ invalid: Boolean(error), size, weight })}
        ref={textareaRef}
      />
      {error && (
        <Description className="text-sm text-red-600 dark:text-red-400">
          {error}
        </Description>
      )}
    </Field>
  )
}
