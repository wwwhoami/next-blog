import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'
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
  type,
  id,
  label,
  placeholder,
  onChange,
  onBlur,
  hasError,
  errorMessage,
  className = 'flex justify-between border rounded-xl  focus-within:border-primary focus-within:ring focus-within:ring-primary focus-within:ring-opacity-50 focus:ring-offset-4 text-sm w-full bg-white',
}: Props) => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  return (
    <div className="mb-6">
      <label htmlFor={id} className="block mb-2 text-sm font-medium">
        {label}
      </label>
      <div
        className={`${className} ${
          hasError
            ? 'bg-red-50 border border-red-500 focus-ring-error '
            : 'focus-ring'
        }`}
      >
        <input
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          type={passwordVisible ? 'text' : 'password'}
          className={`w-full outline-none rounded-xl p-2.5 ${
            hasError ? 'bg-red-50 text-red-900 placeholder-red-700' : ''
          }`}
          id={id}
        />
        <button
          type="button"
          onClick={() => {
            setPasswordVisible((prev) => !prev)
          }}
          className="flex items-center focus-ring justify-center m-1 transition-colors duration-300 transform rounded-xl w-8 h-8 p-0 text-indigo-500 hover:opacity-80 focus:ring-indigo-500/70 focus:outline-none focus:ring-2"
        >
          {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
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
