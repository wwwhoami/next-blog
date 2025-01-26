import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import React from 'react'

type Props = {
  code: number
  text: string
}

function Error({ code, text }: Props) {
  return (
    <div className="mt-20 flex flex-col items-center">
      <h1 className="my-5 text-6xl dark:text-white">
        <ExclamationTriangleIcon className="mx-2 inline-block size-14 text-red-500" />
        {code}
      </h1>
      <h2 className="text-4xl text-gray-400 dark:text-slate-200">{text}</h2>
    </div>
  )
}

export default Error
