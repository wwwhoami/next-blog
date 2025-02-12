import { $createCodeNode, $isCodeNode } from '@lexical/code'
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown'
import { $createTextNode, $getRoot, LexicalEditor } from 'lexical'
import { useCallback, useEffect, useState } from 'react'
import { EDITOR_TRANSFORMERS } from '../Editor'

const useMarkdownMode = (editor: LexicalEditor) => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)

  const toggleMarkdownMode = useCallback(() => {
    editor.update(() => {
      const root = $getRoot()
      const firstChild = root.getFirstChild()
      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          EDITOR_TRANSFORMERS,
          undefined,
          true,
        )

        setIsMarkdownMode(false)
      } else {
        const markdown = $convertToMarkdownString(
          EDITOR_TRANSFORMERS,
          undefined,
          true,
        )
        const codeNode = $createCodeNode('markdown')
        codeNode.append($createTextNode(markdown))
        root.clear().append(codeNode)
        if (markdown.length === 0) {
          codeNode.select()
        }

        setIsMarkdownMode(true)
      }
    })
  }, [editor])

  useEffect(() => {
    editor.read(() => {
      const root = $getRoot()
      const firstChild = root.getFirstChild()
      setIsMarkdownMode(
        $isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown',
      )
    })
  }, [editor])

  return [isMarkdownMode, toggleMarkdownMode] as const
}

export default useMarkdownMode
