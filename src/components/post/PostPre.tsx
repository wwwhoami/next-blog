'use client'

import { useTheme } from '@/context/ThemeProvider'
import { ClipboardDocumentIcon } from '@heroicons/react/20/solid'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

type Props = {
  children: React.ReactNode
  'data-theme': 'dark' | 'light'
  'data-language': 'dark' | 'light'
  raw: string
}

export default function PostPre(props: Props) {
  const { isDarkTheme } = useTheme()
  const [copied, setCopied] = useState(false)
  const currentTheme = isDarkTheme ? 'dark' : 'light'

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(props.raw)
    setCopied(true)

    toast.success(
      <p>
        Copied to clipboard
        <ClipboardDocumentIcon className="inline-block w-5 h-5 ml-2" />
      </p>,
    )

    setTimeout(() => setCopied(false), 5000)
  }

  return (
    // display pre element only if the theme matches
    currentTheme === props['data-theme'] && (
      <pre {...props}>
        <div className="flex items-center justify-between w-full pb-3 text-sm text-gray-600 dark:text-gray-300">
          <span>{props['data-language']}</span>
          <button
            className={`p-2 rounded-lg focus-ring hover:bg-gray-200 hover:text-gray-900 dark:hover:text-gray-900
             focus:bg-gray-200 focus:text-gray-900 dark:focus:text-gray-900
             disabled:bg-opacity-70 disabled:cursor-not-allowed`}
            onClick={copyToClipboard}
            disabled={copied}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        {props.children}
      </pre>
    )
  )
}
