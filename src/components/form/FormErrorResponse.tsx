import React from 'react'

type Props = {
  error: string | string[]
}

export default function FormErrorResponse({ error }: Props) {
  return (
    <div
      className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/60 dark:text-red-100"
      role="alert"
    >
      {Array.isArray(error) ? (
        <ul className="mx-4 list-disc">
          {error.map((message, idx) => (
            <li key={idx} className="font-medium">
              {message.charAt(0).toUpperCase() + message.slice(1)}
            </li>
          ))}
        </ul>
      ) : (
        <span className="font-medium">
          {error.charAt(0).toUpperCase() + error.slice(1)}
        </span>
      )}
    </div>
  )
}
