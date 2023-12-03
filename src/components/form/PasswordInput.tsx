import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import React, { useState } from 'react'

type Props = {
  value?: string | number | readonly string[]
  type?: React.HTMLInputTypeAttribute
  id?: string
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
  label,
  placeholder,
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
          hasError
            ? 'focus-ring-error border border-red-500 bg-red-50 '
            : 'focus-ring',
        )}
      >
        <input
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          type={passwordVisible ? 'text' : 'password'}
          className={clsx(`w-full rounded-xl p-2.5 outline-none`, {
            'bg-red-50 text-red-900 placeholder-red-700': hasError,
          })}
          id={id}
        />
        <button
          type="button"
          onClick={() => {
            setPasswordVisible((prev) => !prev)
          }}
          className="flex items-center justify-center w-8 h-8 p-0 m-1 text-indigo-500 transition-colors duration-300 transform focus-ring rounded-xl hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
        >
          {passwordVisible ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default PasswordInput
