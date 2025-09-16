import { Category } from '@/types/Category'
import { slugify } from '@/utils/slugify'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import matter from 'gray-matter'
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical'
import { useEffect } from 'react'
import { EDITOR_TRANSFORMERS } from '../Editor'

type Props = {
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  excerpt: string
  setExcerpt: React.Dispatch<React.SetStateAction<string>>
  category: Array<Category>
  setCategory: React.Dispatch<React.SetStateAction<Array<Category>>>
}

export const EXPORT_MARKDOWN_COMMAND = createCommand()
export const IMPORT_MARKDOWN_COMMAND = createCommand()

const MarkdownImportExportPlugin = ({
  title,
  setTitle,
  excerpt,
  setExcerpt,
  category,
  setCategory,
}: Props) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        EXPORT_MARKDOWN_COMMAND,
        (_payload: string) => {
          const content = $convertToMarkdownString(EDITOR_TRANSFORMERS)
          const markdown = matter.stringify(content, {
            title,
            excerpt,
            category,
          })

          exportMarkdownFile(markdown, title)

          // return true to prevent further propagation of the command
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        IMPORT_MARKDOWN_COMMAND,
        (_payload: string) => {
          readMarkdownFileFromSystem((text) => {
            const parsed = matter(text)

            setTitle(parsed.data.title || '')
            setExcerpt(parsed.data.excerpt || '')
            setCategory(parsed.data.category || [])

            editor.update(() => {
              $convertFromMarkdownString(parsed.content, EDITOR_TRANSFORMERS)
            })
          })

          // return true to prevent further propagation of the command
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [category, editor, excerpt, setCategory, setExcerpt, setTitle, title])

  return null
}

export default MarkdownImportExportPlugin

function readMarkdownFileFromSystem(callback: (text: string) => void) {
  const input = document.createElement('input')

  input.type = 'file'
  input.accept = '.md,.markdown'
  input.addEventListener('change', (event: Event) => {
    const target = event.target as HTMLInputElement

    if (target.files) {
      const file = target.files[0]
      const reader = new FileReader()
      reader.readAsText(file, 'UTF-8')

      reader.onload = (readerEvent) => {
        if (readerEvent.target) {
          const content = readerEvent.target.result
          callback(content as string)
        }
      }
    }
  })

  input.click()
}

function exportMarkdownFile(markdown: string, name: string) {
  const blob = new Blob([markdown], { type: 'text/markdown' })

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = slugify(name) ? `${name}.md` : 'document.md'
  link.click()
  URL.revokeObjectURL(link.href)
  link.remove()
}
