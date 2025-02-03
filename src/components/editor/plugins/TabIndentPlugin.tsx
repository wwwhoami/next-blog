import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getNearestBlockElementAncestorOrThrow,
  mergeRegister,
} from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  INDENT_CONTENT_COMMAND,
  LexicalEditor,
} from 'lexical'
import { useEffect } from 'react'

function registerTabIndentation(editor: LexicalEditor, maxIndent?: number) {
  return mergeRegister(
    editor.registerCommand(
      INDENT_CONTENT_COMMAND,
      () => {
        if (maxIndent == null) {
          return false
        }

        const selection = $getSelection()
        if (!$isRangeSelection(selection)) {
          return false
        }

        const indents = selection
          .getNodes()
          .map((node) =>
            $getNearestBlockElementAncestorOrThrow(node).getIndent(),
          )

        return Math.max(...indents) + 1 >= maxIndent
      },
      COMMAND_PRIORITY_CRITICAL,
    ),
  )
}

function TabIndentationPlugin({ maxIndent }: { maxIndent?: number }): null {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return registerTabIndentation(editor, maxIndent)
  }, [editor, maxIndent])

  return null
}

export default TabIndentationPlugin
