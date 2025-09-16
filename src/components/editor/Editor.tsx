'use client'

import editorTheme from '@/components/editor/EditorTheme'
import useHasMounted from '@/hooks/useHasMounted'
import { Category } from '@/types/Category'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { ListItemNode, ListNode } from '@lexical/list'
import {
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from '@lexical/markdown'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { useState } from 'react'
import AutoLinkPlugin from './plugins/AutoLinkPlugin'
import CodeHighlightPlugin from './plugins/CodeHighlightPlutin'
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditor'
import LocalStoragePlugin from './plugins/LocalStoragePlugin'
import MarkdownImportExportPlugin from './plugins/MarkdownImportExportPlugin'
import TabIndentationPlugin from './plugins/TabIndentPlugin'
import { TABLE_TRANSFORMER } from './plugins/TablePlugin'
import ToolbarPlugin from './plugins/toolbar/ToolbarPlugin'
import { validateUrl } from './utils'

const placeholderText = 'Start writing...'

const Placeholder = () => {
  return (
    <div className="absolute left-[1.125rem] top-[1.125rem] opacity-50">
      {placeholderText}
    </div>
  )
}

type Props = {
  title: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  excerpt: string
  setExcerpt: React.Dispatch<React.SetStateAction<string>>
  category: Array<Category>
  setCategory: React.Dispatch<React.SetStateAction<Array<Category>>>
}

const EDITOR_NODES = [
  HeadingNode,
  CodeNode,
  CodeHighlightNode,
  HeadingNode,
  LinkNode,
  AutoLinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  TableNode,
  TableRowNode,
  TableCellNode,
]

export const EDITOR_TRANSFORMERS = [
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
  TABLE_TRANSFORMER,
]

export const editorNamespace = 'postEditor'

const editorConfig = {
  namespace: editorNamespace,
  nodes: EDITOR_NODES,
  onError(error: Error) {
    throw error
  },
  theme: editorTheme,
}

const Editor = ({
  title,
  setTitle,
  excerpt,
  setExcerpt,
  category,
  setCategory,
}: Props) => {
  const [isLinkEditMode, setIsLinkEditMode] = useState(false)

  const hasMounted = useHasMounted()
  if (!hasMounted) {
    return null
  }

  const content = localStorage.getItem(editorConfig.namespace)

  return (
    <LexicalComposer initialConfig={{ ...editorConfig, editorState: content }}>
      <div
        className={
          'ctp-latte prose prose-slate w-full max-w-none overflow-x-scroll text-black dark:ctp-frappe prose-headings:mb-4 prose-headings:mt-2 prose-p:my-0 dark:text-white'
        }
      >
        <div className="relative size-full min-h-52 dark:bg-gray-700">
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={Placeholder}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LocalStoragePlugin namespace={editorConfig.namespace} />
          <MarkdownShortcutPlugin transformers={EDITOR_TRANSFORMERS} />
          <MarkdownImportExportPlugin
            title={title}
            setTitle={setTitle}
            excerpt={excerpt}
            setExcerpt={setExcerpt}
            category={category}
            setCategory={setCategory}
          />
          <CodeHighlightPlugin />
          <ListPlugin />
          <TabIndentationPlugin maxIndent={8} />
          <LinkPlugin validateUrl={validateUrl} />
          <AutoLinkPlugin />
          <TablePlugin
            hasCellMerge={true}
            hasCellBackgroundColor={true}
            hasHorizontalScroll={false}
          />

          <FloatingLinkEditorPlugin
            isLinkEditMode={isLinkEditMode}
            setIsLinkEditMode={setIsLinkEditMode}
          />
        </div>
      </div>
      <ToolbarPlugin />
    </LexicalComposer>
  )
}

export default Editor
