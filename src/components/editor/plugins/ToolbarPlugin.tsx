import RovingTab from '@/context/rovingTab/RovingTab'
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  TrashIcon,
  UnderlineIcon,
} from '@heroicons/react/20/solid'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import {
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CLEAR_EDITOR_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { useCallback, useEffect, useRef, useState } from 'react'
import ToolbarButton from './ToolbarButton'

const LowPriority = 1

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const toolbarRef = useRef(null)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isEditorEmpty, setIsEditorEmpty] = useState(true)

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
    }
  }, [])

  useEffect(
    function checkEditorEmptyState() {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot()
          const children = root.getChildren()

          if (children.length > 1) {
            setIsEditorEmpty(false)
            return
          }

          if ($isParagraphNode(children[0])) {
            setIsEditorEmpty(children[0].getChildren().length === 0)
          } else {
            setIsEditorEmpty(false)
          }
        })
      })
    },
    [editor],
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar()
          return false
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        LowPriority,
      ),
    )
  }, [editor, $updateToolbar])

  const MandatoryPlugins = () => <ClearEditorPlugin />

  const ToolbarSeparator = () => (
    <span className="block h-full w-px bg-gray-300 dark:bg-gray-600"></span>
  )

  const textFormatButtons = [
    {
      active: isBold,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold'),
      icon: BoldIcon,
    },
    {
      active: isStrikethrough,
      onClick: () =>
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough'),
      icon: StrikethroughIcon,
    },
    {
      active: isItalic,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic'),
      icon: ItalicIcon,
    },
    {
      active: isUnderline,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline'),
      icon: UnderlineIcon,
    },
  ]

  const elementFormatButtons = [
    {
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
      },
      icon: Bars3BottomLeftIcon,
    },
    {
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
      },
      icon: Bars3Icon,
    },
    {
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
      },
      icon: Bars3BottomRightIcon,
    },
    {
      onClick: () => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
      },
      children: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="size-3.5 fill-current"
          aria-hidden="true"
          data-slot="icon"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M352 64c0-17.7-14.3-32-32-32L128 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32l-192 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32z"
          />
        </svg>
      ),
    },
  ]

  const editorCommandButtons = [
    {
      onClick: () => {
        editor.dispatchCommand(UNDO_COMMAND, undefined)
      },
      icon: ArrowUturnLeftIcon,
      disabled: !canUndo,
    },
    {
      onClick: () => {
        editor.dispatchCommand(REDO_COMMAND, undefined)
      },
      icon: ArrowUturnRightIcon,
      disabled: !canRedo,
    },
    {
      onClick: () => {
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)
      },
      icon: TrashIcon,
      disabled: isEditorEmpty,
    },
  ]

  return (
    <>
      <MandatoryPlugins />

      <RovingTab
        as="div"
        className="fixed bottom-8 left-1/2 z-20 mb-4 flex h-10 min-w-52 -translate-x-1/2 items-center space-x-2 bg-gray-50 p-2 shadow dark:bg-gray-800"
      >
        {textFormatButtons.map((props, index) => (
          <RovingTab.Item key={index}>
            {({ tabIndex, ref }) => (
              <ToolbarButton
                tabIndex={tabIndex}
                ref={ref as React.Ref<HTMLButtonElement>}
                {...props}
              />
            )}
          </RovingTab.Item>
        ))}

        <ToolbarSeparator />

        {elementFormatButtons.map((props, index) => (
          <RovingTab.Item key={index}>
            {({ tabIndex, ref }) => (
              <ToolbarButton
                tabIndex={tabIndex}
                ref={ref as React.Ref<HTMLButtonElement>}
                {...props}
              />
            )}
          </RovingTab.Item>
        ))}

        <ToolbarSeparator />

        {editorCommandButtons.map((props, index) => (
          <RovingTab.Item key={index} disabled={props.disabled}>
            {({ tabIndex, ref }) => (
              <ToolbarButton
                {...props}
                tabIndex={tabIndex}
                ref={ref as React.Ref<HTMLButtonElement>}
              />
            )}
          </RovingTab.Item>
        ))}
      </RovingTab>
    </>
  )
}
