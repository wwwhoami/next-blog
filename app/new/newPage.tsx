'use client'

import PageHeading from '@/components/PageHeading'
import CategoryInput from '@/components/category/CategoryInput'
import Editor from '@/components/editor/Editor'
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
      <CategoryInput />

      <TextareaAutoExpand placeholder="Excerpt of your post..." rows={3} />
      <Editor />
    </div>
  )
}

export default withAuth(NewPage)
