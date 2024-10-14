'use client'

import editorTheme from '@/components/editor/EditorTheme'
import useHasMounted from '@/hooks/useHasMounted'
import { CodeNode } from '@lexical/code'
import { LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import { TRANSFORMERS } from '@lexical/markdown'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import LocalStoragePlugin from './plugins/LocalStoragePlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'

const placeholderText = 'Start writing...'

const Placeholder = () => {
  return (
    <div className="absolute left-[1.125rem] top-[1.125rem] opacity-50">
      {placeholderText}
    </div>
  )
}

type Props = {}

const EDITOR_NODES = [
  CodeNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
]

const editorConfig = {
  namespace: 'My Editor',
  nodes: EDITOR_NODES,
  onError(error: Error) {
    throw error
  },
  theme: editorTheme,
}

const Editor = ({}: Props) => {
  const hasMounted = useHasMounted()
  if (!hasMounted) {
    return null
  }

  const content = localStorage.getItem(editorConfig.namespace)

  return (
    <LexicalComposer initialConfig={{ ...editorConfig, editorState: content }}>
      <div
        className={
          'prose prose-slate relative w-full max-w-none text-black prose-headings:mb-4 prose-headings:mt-2 prose-p:my-0 dark:text-white'
        }
      >
        <ToolbarPlugin />
        <div className="relative size-full min-h-52 dark:bg-gray-700">
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={Placeholder}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LocalStoragePlugin namespace={editorConfig.namespace} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          {/* <TreeViewPlugin /> */}
        </div>
      </div>
    </LexicalComposer>
  )
}

export default Editor
