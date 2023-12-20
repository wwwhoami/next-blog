import clsx from 'clsx'
import React from 'react'

type Props = {
  value?: string | number | readonly string[]
  type?: React.HTMLInputTypeAttribute
  id?: string
  name?: string
  label?: string
  placeholder?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  hasError?: boolean
  errorMessage?: string
  className?: string
}

const FormInput = ({
  value,
  type,
  id,
  name,
  label,
  placeholder,
  onChange,
  onBlur,
  hasError,
  errorMessage,
  className = 'border focus-ring rounded-xl focus-within:border-primary focus-within:ring focus-within:ring-primary focus-within:ring-opacity-50 text-sm block w-full p-2.5',
}: Props) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block mb-2 text-sm font-medium">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        id={id}
        name={name ?? id}
        className={clsx(
          className,
          {
            'dark:text-gray-200 dark:placeholder:text-gray-400 dark:focus-within:ring-opacity-80 dark:border-none dark:bg-slate-700 dark:autofill:bg-slate-700 dark:autofill:text-gray-200':
              !hasError,
          },
          {
            'focus-ring-error border dark:border-solid dark:bg-red-950/10 dark:text-gray-200 dark:placeholder-red-400 border-red-500 bg-red-50 text-red-900 placeholder-red-700':
              hasError,
          },
        )}
      />
      {hasError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default FormInput
