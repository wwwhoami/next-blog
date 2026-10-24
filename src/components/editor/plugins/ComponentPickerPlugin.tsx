import { Bars4CenterIcon } from '@/components/icons'
import {
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
  ChatBubbleLeftEllipsisIcon,
  CodeBracketIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ListBulletIcon,
  NumberedListIcon,
  PencilIcon,
  TableCellsIcon,
} from '@heroicons/react/20/solid'
import { $createCodeNode } from '@lexical/code'
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  ElementNode,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  TextNode,
} from 'lexical'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { INSERT_TABLE_COMMAND } from '../EditorCommands'
import { getDynamicTableDimensions } from './ComponentPickerPluginUtils'

export class ComponentPickerOption extends MenuOption {
  constructor(
    public title: string,
    public icon: ReactNode,
    public keywords: string[],
    public onSelect: () => void,
  ) {
    super(title)
  }
}

function setBlockType(editor: LexicalEditor, createNode: () => ElementNode) {
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, createNode)
    }
  })
}

function getBaseOptions(editor: LexicalEditor): ComponentPickerOption[] {
  return [
    new ComponentPickerOption(
      'Paragraph',
      <PencilIcon />,
      ['normal', 'paragraph', 'text'],
      () => setBlockType(editor, () => $createParagraphNode()),
    ),
    new ComponentPickerOption(
      'Heading 1',
      <H1Icon />,
      ['heading', 'header', 'h1'],
      () => setBlockType(editor, () => $createHeadingNode('h1')),
    ),
    new ComponentPickerOption(
      'Heading 2',
      <H2Icon />,
      ['heading', 'header', 'h2'],
      () => setBlockType(editor, () => $createHeadingNode('h2')),
    ),
    new ComponentPickerOption(
      'Heading 3',
      <H3Icon />,
      ['heading', 'header', 'h3'],
      () => setBlockType(editor, () => $createHeadingNode('h3')),
    ),
    new ComponentPickerOption(
      'Table',
      <TableCellsIcon />,
      ['table', 'grid', 'rows', 'columns'],
      () => editor.dispatchCommand(INSERT_TABLE_COMMAND, undefined),
    ),
    new ComponentPickerOption(
      'Numbered List',
      <NumberedListIcon />,
      ['numbered', 'ordered', 'list', 'ol'],
      () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    ),
    new ComponentPickerOption(
      'Bulleted List',
      <ListBulletIcon />,
      ['bulleted', 'unordered', 'list', 'ul'],
      () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    ),
    new ComponentPickerOption(
      'Quote',
      <ChatBubbleLeftEllipsisIcon />,
      ['quote', 'blockquote'],
      () => setBlockType(editor, () => $createQuoteNode()),
    ),
    new ComponentPickerOption(
      'Code',
      <CodeBracketIcon />,
      ['code', 'codeblock', 'javascript', 'python'],
      () => setBlockType(editor, () => $createCodeNode()),
    ),
    ...(['left', 'center', 'right', 'justify'] as const).map(
      (alignment) =>
        new ComponentPickerOption(
          `Align ${alignment}`,
          <BarsIcon alignment={alignment} />,
          ['align', 'justify', alignment],
          () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
        ),
    ),
  ]
}

function getDynamicOptions(
  editor: LexicalEditor,
  queryString: string,
): ComponentPickerOption[] {
  return getDynamicTableDimensions(queryString).map(
    ({ rows, columns }) =>
      new ComponentPickerOption(
        `${rows}x${columns} Table`,
        <TableCellsIcon />,
        ['table', 'grid', 'rows', 'columns'],
        () =>
          editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows,
            columns,
          }),
      ),
  )
}

function BarsIcon({
  alignment,
}: {
  alignment: 'left' | 'center' | 'right' | 'justify'
}) {
  return alignment === 'left' ? (
    <Bars3BottomLeftIcon />
  ) : alignment === 'center' ? (
    <Bars3Icon />
  ) : alignment === 'right' ? (
    <Bars3BottomRightIcon />
  ) : alignment === 'justify' ? (
    <Bars4CenterIcon />
  ) : null
}

function ComponentPickerMenu({
  options,
  selectedIndex,
  selectOptionAndCleanUp,
  setHighlightedIndex,
}: {
  options: ComponentPickerOption[]
  selectedIndex: number | null
  selectOptionAndCleanUp: (option: ComponentPickerOption) => void
  setHighlightedIndex: (index: number) => void
}) {
  return (
    <ul
      className="max-h-72 w-64 overflow-y-auto rounded-lg border border-gray-200 bg-white text-sm shadow-xl focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      role="listbox"
    >
      {options.map((option, index) => (
        <li
          key={option.key}
          tabIndex={-1}
          ref={option.setRefElement}
          role="option"
          aria-selected={selectedIndex === index}
          id={`typeahead-item-${index}`}
          onMouseEnter={() => setHighlightedIndex(index)}
          onClick={() => selectOptionAndCleanUp(option)}
          className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 ${
            selectedIndex === index
              ? 'bg-indigo-600 text-white'
              : 'hover:bg-gray-100 dark:hover:bg-white/10'
          }`}
        >
          <span className="size-5 shrink-0 fill-current [&>svg]:size-5">
            {option.icon}
          </span>
          <span>{option.title}</span>
        </li>
      ))}
    </ul>
  )
}

export default function ComponentPickerPlugin() {
  const [editor] = useLexicalComposerContext()
  const [queryString, setQueryString] = useState<string | null>(null)
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    allowWhitespace: true,
    minLength: 0,
  })

  const options = useMemo(() => {
    const baseOptions = getBaseOptions(editor)
    if (!queryString) {
      return baseOptions
    }

    const query = queryString.toLowerCase()
    return [
      ...getDynamicOptions(editor, queryString),
      ...baseOptions.filter(
        (option) =>
          option.title.toLowerCase().includes(query) ||
          option.keywords.some((keyword) => keyword.includes(query)),
      ),
    ]
  }, [editor, queryString])

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        nodeToRemove?.remove()
        selectedOption.onSelect()
        closeMenu()
      })
    },
    [editor],
  )

  return (
    <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
      options={options}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      menuRenderFn={(
        anchorElementRef,
        {
          options: menuOptions,
          selectedIndex,
          selectOptionAndCleanUp,
          setHighlightedIndex,
        },
      ) =>
        anchorElementRef.current
          ? createPortal(
              <ComponentPickerMenu
                options={menuOptions}
                selectedIndex={selectedIndex}
                selectOptionAndCleanUp={selectOptionAndCleanUp}
                setHighlightedIndex={setHighlightedIndex}
              />,
              anchorElementRef.current,
            )
          : null
      }
    />
  )
}
