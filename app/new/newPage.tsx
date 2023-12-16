'use client'

import PageHeading from '@/components/PageHeading'
import { TextareaAutoExpand } from '@/components/form/TextareaAutoExpand'
import withAuth from 'src/hocs/withAuth'

type Props = {}

function NewPage({}: Props) {
  return (
    <div className="px-5">
      <PageHeading title="Create new post" />

      <TextareaAutoExpand
        placeholder="New post title here..."
        size="3xl"
        weight="semibold"
      />
      <input
        type="text"
        placeholder="Add up to 4 category tags..."
        className="w-full p-2 my-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
      />
      <TextareaAutoExpand placeholder="Excerpt of your post..." rows={3} />
    </div>
  )
}

export default withAuth(NewPage)
