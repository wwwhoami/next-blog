import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import debounce from 'lodash.debounce'
import { useCallback, useEffect } from 'react'

type Props = {
  namespace: string
}

const debounceSaveContentWait = 500

const LocalStoragePlugin = ({ namespace }: Props) => {
  const [editor] = useLexicalComposerContext()

  const saveContent = useCallback(
    (content: string) => {
      localStorage.setItem(namespace, content)
    },
    [namespace],
  )

  const debounceSaveContent = debounce(saveContent, debounceSaveContentWait)

  useEffect(() => {
    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return

        const serializedState = JSON.stringify(editorState)
        debounceSaveContent(serializedState)
      },
    )
  }, [debounceSaveContent, editor])

  return null
}

export default LocalStoragePlugin
