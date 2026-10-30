'use client'

import PageHeading from '@/components/PageHeading'
import CategoryInput from '@/components/category/CategoryInput'
import Editor from '@/components/editor/Editor'
import { TextAreaAutoExpandControlled } from '@/components/form/TextAreaAutoExpandControlled'
import useLocalStorage from '@/hooks/useLocalStorage'
import { Category } from '@/types/Category'
import { useState } from 'react'
import withAuth from 'src/hocs/withAuth'

type Props = {}

function NewPage({}: Props) {
  const [title, setTitle, isReady] = useLocalStorage('postTitle', '')
  const [excerpt, setExcerpt] = useLocalStorage('postExcerpt', '')
  const [touchedFields, setTouchedFields] = useState({
    title: false,
    excerpt: false,
  })
  const [category, setCategory] = useLocalStorage<Array<Category>>(
    'postCategory',
    [{ name: '', description: '', hexColor: '' }],
  )

  // TODO: add a skeleton loader
  if (!isReady) return null

  const titleError =
    touchedFields.title && !title.trim() ? 'Title is required' : undefined
  const excerptError =
    touchedFields.excerpt && !excerpt.trim()
      ? 'Excerpt is required'
      : undefined

  const markFieldAsTouched = (field: keyof typeof touchedFields) => {
    setTouchedFields((fields) => ({ ...fields, [field]: true }))
  }

  return (
    <div className="lg:px-5">
      <PageHeading title="Create new post" />

      <TextAreaAutoExpandControlled
        text={title}
        setText={setTitle}
        label="Title"
        placeholder="New post title here..."
        size="3xl"
        weight="semibold"
        error={titleError}
        onBlur={() => markFieldAsTouched('title')}
      />

      <CategoryInput
        selectedCategories={category}
        setSelectedCategories={setCategory}
      />

      <TextAreaAutoExpandControlled
        text={excerpt}
        description="A short summary of your post. This will be displayed on the homepage and in search results."
        setText={setExcerpt}
        label="Excerpt"
        placeholder="Excerpt of your post..."
        rows={3}
        error={excerptError}
        onBlur={() => markFieldAsTouched('excerpt')}
      />

      <Editor
        title={title}
        setTitle={setTitle}
        excerpt={excerpt}
        setExcerpt={setExcerpt}
        category={category}
        setCategory={setCategory}
      />
    </div>
  )
}

export default withAuth(NewPage)
