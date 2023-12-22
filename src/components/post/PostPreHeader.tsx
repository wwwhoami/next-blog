'use client'

import { ClipboardDocumentIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../Button'

type Props = {
  dataLanguage: string
  rawText: string
}

export default function PostPreHeader({ dataLanguage, rawText }: Props) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(rawText)
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
    <div className="sticky left-0 flex items-center justify-between w-full pb-3 text-sm text-gray-600 dark:text-gray-300">
      <span>{dataLanguage}</span>
      <Button
        color="secondary"
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        disabled={copied}
      >
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  )
}
