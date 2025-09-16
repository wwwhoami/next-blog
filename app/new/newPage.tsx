'use client'

import PageHeading from '@/components/PageHeading'
import CategoryInput from '@/components/category/CategoryInput'
import Editor from '@/components/editor/Editor'
import { TextAreaAutoExpandControlled } from '@/components/form/TextAreaAutoExpandControlled'
import useLocalStorage from '@/hooks/useLocalStorate'
import { Category } from '@/types/Category'
import withAuth from 'src/hocs/withAuth'

type Props = {}

function NewPage({}: Props) {
  const [title, setTitle] = useLocalStorage('postTitle', '')
  const [excerpt, setExcerpt] = useLocalStorage('postExcerpt', '')
  const [category, setCategory] = useLocalStorage('postCategory', [
    { name: '', description: '', hexColor: '' },
  ] as Array<Category>)

  return (
    <div className="lg:px-5">
      <PageHeading title="Create new post" />

      <TextAreaAutoExpandControlled
        text={title}
        setText={setTitle}
        placeholder="New post title here..."
        size="3xl"
        weight="semibold"
      />

      <CategoryInput
        selectedCategories={category}
        setSelectedCategories={setCategory}
      />

      <TextAreaAutoExpandControlled
        text={excerpt}
        setText={setExcerpt}
        placeholder="Excerpt of your post..."
        rows={3}
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
