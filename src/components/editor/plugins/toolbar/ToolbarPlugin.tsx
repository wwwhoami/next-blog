import { Bars4CenterIcon, IndentIcon, OutdentIcon } from '@/components/icons'
import RovingTab from '@/context/rovingTab/RovingTab'
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
  BoldIcon,
  CodeBracketIcon,
  ItalicIcon,
  LinkIcon,
  StrikethroughIcon,
  TrashIcon,
  UnderlineIcon,
} from '@heroicons/react/20/solid'
import {
  $isCodeNode,
  getCodeLanguages,
  getDefaultCodeLanguage,
} from '@lexical/code'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $isListNode, ListNode } from '@lexical/list'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isHeadingNode } from '@lexical/rich-text'
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils'
import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getSelectedNode } from '../../utils'
import ToolbarButton from './ToolbarButton'
import { BlockOptionsDropdownList } from './ToolbarDropDown'
import ToolbarSelect from './ToolbarSelect'

function ToolbarSeparator() {
  return (
    <span className="block h-full w-px bg-gray-300 dark:bg-gray-600"></span>
  )
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()

  const [blockType, setBlockType] = useState('paragraph')
  const [selectedElementKey, setSelectedElementKey] = useState('')
  const [codeLanguage, setCodeLanguage] = useState('')

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [isCode, setIsCode] = useState(false)

  const [isEditorEmpty, setIsEditorEmpty] = useState(true)

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()

    if (!$isRangeSelection(selection)) {
      return
    }

    const anchorNode = selection.anchor.getNode()
    const element =
      anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow()
    const elementKey = element.getKey()
    const elementDOM = editor.getElementByKey(elementKey)

    if (elementDOM !== null) {
      setSelectedElementKey(elementKey)

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode)
        const type = parentList ? parentList.getTag() : element.getTag()
        setBlockType(type)
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType()
        setBlockType(type)
        if ($isCodeNode(element)) {
          setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage())
        }
      }

      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsCode(selection.hasFormat('code'))

      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }
    }
  }, [editor])

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [editor, isLink])

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
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, $updateToolbar])

  const undoRedoButtons = [
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
  ]

  const codeLanguages = useMemo(() => getCodeLanguages(), [])
  const onCodeLanguageSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      editor.update(() => {
        const node = $getNodeByKey(selectedElementKey)
        if ($isCodeNode(node)) {
          node.setLanguage(e.target.value)
        }
      })
    },
    [editor, selectedElementKey],
  )

  const MandatoryPlugins = () => <ClearEditorPlugin />

  const textFormatButtons = blockType !== 'code' && [
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
    {
      active: isCode,
      onClick: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code'),
      icon: CodeBracketIcon,
    },
    {
      active: isLink,
      onClick: insertLink,
      icon: LinkIcon,
    },
  ]

  const elementFormatButtons =
    blockType !== 'code'
      ? [
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
            icon: Bars4CenterIcon,
          },
          {
            onClick: () => {
              editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
            },
            icon: IndentIcon,
          },
          {
            onClick: () => {
              editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
            },
            icon: OutdentIcon,
          },
        ]
      : [
          {
            onClick: () => {
              editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
            },
            icon: IndentIcon,
          },
          {
            onClick: () => {
              editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
            },
            icon: OutdentIcon,
          },
        ]

  const isMacOsNavigator = navigator.userAgent.includes('Mac OS X')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const metaKey = isMacOsNavigator ? e.metaKey : e.ctrlKey

      if (e.code === 'BracketLeft' && metaKey && e.altKey) {
        e.preventDefault()
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
      } else if (e.code === 'BracketRight' && metaKey && e.altKey) {
        e.preventDefault()
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, isMacOsNavigator])

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

      <div className="fixed bottom-8 left-1/2 z-20 mb-4 flex h-10 min-w-52 -translate-x-1/2 items-center space-x-2 rounded-md bg-gray-50 p-2 shadow dark:bg-gray-800">
        <RovingTab as="div" className="flex h-6 items-center space-x-2">
          {undoRedoButtons.map((props, index) => (
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

        <ToolbarSeparator />

        <BlockOptionsDropdownList
          editor={editor}
          blockType={blockType}
          setShowBlockOptionsDropDown={() => {}}
        />

        <ToolbarSeparator />

        {blockType === 'code' && (
          <ToolbarSelect
            onChange={onCodeLanguageSelect}
            aria-label="Code language"
            options={codeLanguages}
            value={codeLanguage}
          />
        )}

        <RovingTab as="div" className="flex h-6 items-center space-x-2">
          {textFormatButtons &&
            textFormatButtons.map((props, index) => (
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

          {elementFormatButtons &&
            elementFormatButtons.map((props, index) => (
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
      </div>
    </>
  )
}
