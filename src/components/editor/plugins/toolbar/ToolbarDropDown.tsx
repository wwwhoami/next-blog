import Button from '@/components/Button'
import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import {
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ListBulletIcon,
  NumberedListIcon,
  PencilIcon,
} from '@heroicons/react/20/solid'
import { $createCodeNode } from '@lexical/code'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from 'lexical'
import { Fragment, useCallback, useEffect, useMemo } from 'react'
import ToolbarDropDownItem from './ToolbarDropDownItem'

const BlockTypeToIcon = {
  paragraph: <PencilIcon className="mr-2 size-4" />,
  h1: <H1Icon className="mr-2 size-4" />,
  h2: <H2Icon className="mr-2 size-4" />,
  h3: <H3Icon className="mr-2 size-4" />,
  ul: <ListBulletIcon className="mr-2 size-4" />,
  ol: <NumberedListIcon className="mr-2 size-4" />,
  check: <CheckCircleIcon className="mr-2 size-4" />,
  quote: <ChatBubbleLeftEllipsisIcon className="mr-2 size-4" />,
  code: <CodeBracketIcon className="mr-2 size-4" />,
}

const BlockTypeToText = {
  paragraph: 'Paragraph',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  ul: 'Unordered List',
  ol: 'Ordered List',
  check: 'Check List',
  quote: 'Quote',
  code: 'Code Block',
}

type Props = {
  editor: LexicalEditor
  blockType: string
  setShowBlockOptionsDropDown: React.Dispatch<React.SetStateAction<boolean>>
}

export function BlockOptionsDropdownList({
  editor,
  blockType,
  setShowBlockOptionsDropDown,
}: Props) {
  const formatParagraph = useCallback(() => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode())
        }
      })
    }
    setShowBlockOptionsDropDown(false)
  }, [blockType, editor, setShowBlockOptionsDropDown])

  const formatLargeHeading = useCallback(() => {
    if (blockType !== 'h1') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode('h1'))
        }
      })
    }
    setShowBlockOptionsDropDown(false)
  }, [blockType, editor, setShowBlockOptionsDropDown])

  const formatMediumHeading = useCallback(() => {
    if (blockType !== 'h2') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode('h2'))
        }
      })
    }
    setShowBlockOptionsDropDown(false)
  }, [blockType, editor, setShowBlockOptionsDropDown])

  const formatSmallHeading = useCallback(() => {
    if (blockType !== 'h3') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode('h3'))
        }
      })
    }
    setShowBlockOptionsDropDown(false)
  }, [blockType, editor, setShowBlockOptionsDropDown])

  const formatBulletList = useCallback(() => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
    setShowBlockOptionsDropDown(false)
  }, [blockType, editor, setShowBlockOptionsDropDown])

  const formatNumberedList = useCallback(() => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
    setShowBlockOptionsDropDown(false)
  }, [blockType, editor, setShowBlockOptionsDropDown])

  const formatQuote = useCallback(() => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    }
    setShowBlockOptionsDropDown(false)
  }, [blockType, editor, setShowBlockOptionsDropDown])

  const formatCode = useCallback(() => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection()

        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode())
        }
      })
    }
    setShowBlockOptionsDropDown(false)
  }, [blockType, editor, setShowBlockOptionsDropDown])

  const isMacOsNavigator = navigator.userAgent.includes('Mac OS X')

  type TextAction = {
    action: () => void
    text: string
    icon: React.ReactNode
    key?: string
    handler?: (e: KeyboardEvent) => void
  }

  const textActions = useMemo<TextAction[]>(
    () => [
      {
        action: formatParagraph,
        text: 'Paragraph',
        icon: <PencilIcon />,
        key: isMacOsNavigator ? '⌘E' : 'Ctrl+E',
        handler: (e: KeyboardEvent) => {
          const metaKey = isMacOsNavigator ? e.metaKey : e.ctrlKey
          if (e.code === 'KeyE' && metaKey) {
            e.preventDefault()
            formatParagraph()
          }
        },
      },
      {
        action: formatLargeHeading,
        text: 'Heading 1',
        icon: <H1Icon />,
        key: isMacOsNavigator ? '⌘⌥1' : 'Ctrl+Alt+1',
        handler: (e: KeyboardEvent) => {
          const metaKey = isMacOsNavigator ? e.metaKey : e.ctrlKey
          if (e.code === 'Digit1' && e.altKey && metaKey) {
            e.preventDefault()
            formatLargeHeading()
          }
        },
      },
      {
        action: formatMediumHeading,
        text: 'Heading 2',
        icon: <H2Icon />,
        key: isMacOsNavigator ? '⌘⌥2' : 'Ctrl+Alt+2',
        handler: (e: KeyboardEvent) => {
          const metaKey = isMacOsNavigator ? e.metaKey : e.ctrlKey
          if (e.code === 'Digit2' && e.altKey && metaKey) {
            e.preventDefault()
            formatMediumHeading()
          }
        },
      },
      {
        action: formatSmallHeading,
        text: 'Heading 3',
        icon: <H3Icon />,
        key: isMacOsNavigator ? '⌘⌥3' : 'Ctrl+Alt+3',
        handler: (e: KeyboardEvent) => {
          const metaKey = isMacOsNavigator ? e.metaKey : e.ctrlKey
          if (e.code === 'Digit3' && e.altKey && metaKey) {
            e.preventDefault()
            formatSmallHeading()
          }
        },
      },
      {
        action: formatBulletList,
        text: 'Bulleted List',
        icon: <ListBulletIcon />,
        key: isMacOsNavigator ? '⌘⌥8' : 'Ctrl+Alt+8',
        handler: (e: KeyboardEvent) => {
          const metaKey = isMacOsNavigator ? e.metaKey : e.ctrlKey
          if (e.code === 'Digit8' && e.altKey && metaKey) {
            e.preventDefault()
            formatBulletList()
          }
        },
      },
      {
        action: formatNumberedList,
        text: 'Numbered List',
        icon: <NumberedListIcon />,
        key: isMacOsNavigator ? '⌘⌥9' : 'Ctrl+Alt+9',
        handler: (e: KeyboardEvent) => {
          const metaKey = isMacOsNavigator ? e.metaKey : e.ctrlKey
          if (e.code === 'Digit9' && e.altKey && metaKey) {
            e.preventDefault()
            formatNumberedList()
          }
        },
      },
      {
        action: formatQuote,
        text: 'Quote',
        icon: <ChatBubbleLeftEllipsisIcon />,
        key: isMacOsNavigator ? '⌘⌥Q' : 'Ctrl+Alt+Q',
        handler: (e: KeyboardEvent) => {
          const metaKey = isMacOsNavigator ? e.metaKey : e.ctrlKey
          if (e.code === 'KeyQ' && e.altKey && metaKey) {
            e.preventDefault()
            formatQuote()
          }
        },
      },
      {
        action: formatCode,
        text: 'Code Block',
        icon: <CodeBracketIcon />,
        key: isMacOsNavigator ? '⌘⌥C' : 'Ctrl+Alt+C',
        handler: (e: KeyboardEvent) => {
          const metaKey = isMacOsNavigator ? e.metaKey : e.ctrlKey
          if (e.code === 'KeyC' && e.altKey && metaKey) {
            e.preventDefault()
            formatCode()
          }
        },
      },
    ],
    [
      formatParagraph,
      isMacOsNavigator,
      formatLargeHeading,
      formatMediumHeading,
      formatSmallHeading,
      formatBulletList,
      formatNumberedList,
      formatQuote,
      formatCode,
    ],
  )

  useEffect(() => {
    for (const { handler } of textActions) {
      if (handler) window.addEventListener('keydown', handler)
    }

    return () => {
      for (const { handler } of textActions) {
        if (handler) window.removeEventListener('keydown', handler)
      }
    }
  }, [textActions])

  return (
    <Menu>
      <MenuButton as={Fragment}>
        <Button
          size="sm"
          variant="text"
          color="secondary"
          className="inline-flex w-max whitespace-nowrap p-2"
        >
          {BlockTypeToIcon[blockType as keyof typeof BlockTypeToIcon]}
          {BlockTypeToText[blockType as keyof typeof BlockTypeToText]}
          <ChevronDownIcon className="ml-1 size-4" />
        </Button>
      </MenuButton>
      <MenuItems
        anchor="bottom"
        className="z-30 w-52 origin-top-right rounded-xl bg-gray-50 p-1 text-sm/6 shadow-lg transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-gray-800 dark:shadow-xl"
      >
        {textActions.map(({ action, text, icon, key }) => (
          <ToolbarDropDownItem
            onClick={action}
            icon={icon}
            text={text}
            keybinding={key}
            key={text}
          />
        ))}
      </MenuItems>
    </Menu>
  )
}
