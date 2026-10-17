import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  COMMAND_PRIORITY_HIGH,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  KEY_DOWN_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical'
import { useEffect } from 'react'
import { EDIT_LINK_COMMAND } from '../EditorCommands'

export default function KeyboardShortcutsPlugin() {
  const [editor] = useLexicalComposerContext()
  const isMacOsNavigator = navigator.userAgent.includes('Mac OS X')

  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        const metaKey = isMacOsNavigator ? event.metaKey : event.ctrlKey

        if (event.code === 'BracketLeft' && metaKey && event.altKey) {
          event.preventDefault()
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
          return true
        }

        if (event.code === 'BracketRight' && metaKey && event.altKey) {
          event.preventDefault()
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
          return true
        }

        if (
          event.code === 'KeyX' &&
          metaKey &&
          event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault()
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
          return true
        }

        if (
          event.code === 'KeyC' &&
          metaKey &&
          event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault()
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
          return true
        }

        if (event.code === 'KeyK' && metaKey && !event.altKey) {
          event.preventDefault()
          event.stopPropagation()
          editor.dispatchCommand(EDIT_LINK_COMMAND, undefined)
          return true
        }

        return false
      },
      COMMAND_PRIORITY_HIGH,
    )
  }, [editor, isMacOsNavigator])

  return null
}
