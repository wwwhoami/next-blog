import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import React, { useState } from 'react'

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

const PasswordInput = ({
  value,
  id,
  name,
  label,
  placeholder = '************',
  onChange,
  onBlur,
  hasError,
  errorMessage,
  className = 'flex justify-between w-full text-sm bg-white border rounded-xl focus-within:border-primary focus-within:ring focus-within:ring-primary focus-within:ring-opacity-50 focus:ring-offset-4',
}: Props) => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <div className="mb-6">
      <label htmlFor={id} className="block mb-2 text-sm font-medium">
        {label}
      </label>
      <div
        className={clsx(
          className,
          'dark:focus-within:ring-opacity-80',
          hasError
            ? 'focus-ring-error border border-red-500 bg-red-50 focus-ring-error dark:border-solid dark:bg-red-950/10 dark:text-gray-200'
            : 'focus-ring dark:border-none dark:bg-slate-700 dark:text-gray-200 dark:placeholder:text-gray-400 dark:autofill:bg-slate-700 dark:autofill:text-gray-200',
        )}
      >
        <input
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          type={passwordVisible ? 'text' : 'password'}
          className={clsx(
            'w-full rounded-xl p-2.5 outline-none',
            {
              'dark:bg-red-950/10 dark:text-gray-200 dark:placeholder-red-400 text-red-900 placeholder-red-700':
                hasError,
            },
            {
              'dark:border-none dark:bg-slate-700 dark:text-gray-200 dark:placeholder:text-gray-400 dark:focus-within:ring-opacity-80':
                !hasError,
            },
          )}
          id={id}
          name={name ?? id}
        />
        <button
          type="button"
          onClick={() => {
            setPasswordVisible((prev) => !prev)
          }}
          className="items-center w-8 h-8 p-0 m-1 text-indigo-500 transition-colors duration-300 transform flexjustify-center focus-ring rounded-xl hover:opacity-80 focus:outline-none focus:ring-2 dark:text-indigo-400"
        >
          {passwordVisible ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default PasswordInput
