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
  className = 'border rounded-xl focus-within:border-primary focus-within:ring focus-within:ring-opacity-50 text-sm block w-full p-2.5',
}: Props) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
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
            'focus-ring-primary dark:border-none dark:bg-slate-700 dark:text-gray-200 dark:placeholder:text-gray-400 dark:autofill:bg-slate-700 dark:autofill:text-gray-200 dark:focus-within:ring-indigo-600/80':
              !hasError,
          },
          {
            'focus-ring-danger border border-red-500 bg-red-50 text-red-900 placeholder:text-red-700 dark:border-solid dark:bg-red-950/10 dark:text-gray-200 dark:placeholder:text-red-400':
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
