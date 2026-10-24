import Button from '@/components/Button'
import {
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
} from '@floating-ui/react'
import {
  CheckCircleIcon,
  NoSymbolIcon,
  TableCellsIcon,
} from '@heroicons/react/20/solid'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  TableCellHeaderStates,
} from '@lexical/table'
import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  BaseSelection,
  COMMAND_PRIORITY_EDITOR,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
} from 'lexical'
import { JSX, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { INSERT_TABLE_COMMAND, TableDimensions } from '../EditorCommands'
import { getSelectionRect } from '../utils'
import { MAX_TABLE_SIZE } from './ComponentPickerPluginUtils'

const DEFAULT_ROWS = 3
const DEFAULT_COLUMNS = 3

function $createTable(rows: number, columns: number) {
  const table = $createTableNode()

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const tableRow = $createTableRowNode()
    table.append(tableRow)

    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
      tableRow.append(
        $createTableCellNode(
          rowIndex === 0
            ? TableCellHeaderStates.ROW
            : TableCellHeaderStates.NO_STATUS,
        ),
      )
    }
  }

  return table
}

function FloatingTableEditor({
  editor,
  anchorRect,
  lastSelection,
  initialDimensions,
  onClose,
  anchorElem,
}: {
  editor: LexicalEditor
  anchorRect: DOMRect | null
  lastSelection: BaseSelection | null
  initialDimensions: TableDimensions | null
  onClose: () => void
  anchorElem: HTMLElement
}): JSX.Element {
  const rowsInputRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState(
    String(initialDimensions?.rows ?? DEFAULT_ROWS),
  )
  const [columns, setColumns] = useState(
    String(initialDimensions?.columns ?? DEFAULT_COLUMNS),
  )
  const [error, setError] = useState('')
  const { context, refs, floatingStyles, x, y } = useFloating({
    open: true,
    placement: 'top',
    strategy: 'absolute',
    middleware: [
      offset(10),
      flip({ fallbackPlacements: ['bottom'], padding: 62 }),
      shift({ padding: 10 }),
    ],
    onOpenChange: (open) => {
      if (!open) {
        onClose()
      }
    },
  })
  const dismiss = useDismiss(context, { escapeKey: true })
  const { getFloatingProps } = useInteractions([dismiss])

  // Lexical may restore focus to the editor after the picker handles Enter.
  // Retry on the next frame so the table input owns focus after that cleanup.
  useLayoutEffect(() => {
    const focusRowsInput = () => {
      rowsInputRef.current?.focus({ preventScroll: true })
      rowsInputRef.current?.select()
    }

    focusRowsInput()
    const frame = requestAnimationFrame(focusRowsInput)

    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (anchorRect) {
      refs.setReference({
        getBoundingClientRect: () => anchorRect,
        contextElement: anchorElem,
      })
    } else {
      refs.setReference(null)
    }
  }, [anchorElem, anchorRect, refs])

  const insertTable = () => {
    const rowCount = Number(rows)
    const columnCount = Number(columns)

    if (
      !Number.isInteger(rowCount) ||
      !Number.isInteger(columnCount) ||
      rowCount < 1 ||
      columnCount < 1 ||
      rowCount > MAX_TABLE_SIZE ||
      columnCount > MAX_TABLE_SIZE
    ) {
      setError(`Enter whole numbers from 1 to ${MAX_TABLE_SIZE}.`)
      return
    }

    editor.update(() => {
      if (lastSelection) {
        $setSelection(lastSelection.clone())
      }

      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const table = $createTable(rowCount, columnCount)
        selection.insertNodes([table])
        table.selectEnd()
      }
    })

    onClose()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      insertTable()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }

  return (
    <div
      ref={refs.setFloating}
      {...getFloatingProps()}
      className="z-10 transform-gpu transition-[opacity,transform] duration-150 ease-out will-change-transform"
      style={{
        ...floatingStyles,
        opacity: x === null || y === null ? 0 : 1,
      }}
    >
      <div className="inline-flex flex-col gap-2 rounded-xl border-2 border-gray-200/70 bg-gray-100 p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-gray-200">
        <div className="flex items-center gap-2">
          <TableCellsIcon className="size-4 fill-current" />
          <span className="text-sm font-medium">Insert table</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-sm">
            Rows
            <input
              ref={rowsInputRef}
              type="number"
              min="1"
              max={MAX_TABLE_SIZE}
              value={rows}
              onChange={(event) => {
                setRows(event.target.value)
                setError('')
              }}
              onKeyDown={handleKeyDown}
              className="focus-ring-primary h-8 w-16 rounded-md border-2 border-gray-200/70 bg-gray-100 px-2 dark:border-slate-800 dark:bg-slate-900"
            />
          </label>
          <label className="flex items-center gap-1 text-sm">
            Columns
            <input
              type="number"
              min="1"
              max={MAX_TABLE_SIZE}
              value={columns}
              onChange={(event) => {
                setColumns(event.target.value)
                setError('')
              }}
              onKeyDown={handleKeyDown}
              className="focus-ring-primary h-8 w-16 rounded-md border-2 border-gray-200/70 bg-gray-100 px-2 dark:border-slate-800 dark:bg-slate-900"
            />
          </label>
        </div>
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            size="sm"
            variant="text"
            color="secondary"
            className="bg-gray-200 p-2 dark:bg-gray-700"
            title="Cancel"
          >
            <NoSymbolIcon className="size-3.5 fill-current" />
          </Button>
          <Button
            onClick={insertTable}
            size="sm"
            variant="text"
            color="secondary"
            className="bg-gray-200 p-2 dark:bg-gray-700"
            title="Insert table"
          >
            <CheckCircleIcon className="size-3.5 fill-current" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function TableInsertionPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [isOpen, setIsOpen] = useState(false)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null)
  const [anchorElem, setAnchorElem] = useState<HTMLElement | null>(null)
  const [initialDimensions, setInitialDimensions] =
    useState<TableDimensions | null>(null)

  useEffect(() => {
    setAnchorElem(editor.getRootElement()?.parentElement ?? null)
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      INSERT_TABLE_COMMAND,
      (dimensions) => {
        const selection = $getSelection()
        if (!selection) {
          return true
        }

        setLastSelection(selection.clone())
        setInitialDimensions(dimensions ?? null)
        setAnchorRect(getSelectionRect(editor.getRootElement()))
        setIsOpen(true)
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  useEffect(() => {
    return editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      () => {
        if (!isOpen) {
          return false
        }

        setIsOpen(false)
        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor, isOpen])

  if (!isOpen || !anchorElem) {
    return null
  }

  const tableAnchorElem = anchorElem
  const tableDimensionsKey = initialDimensions
    ? `${initialDimensions.rows}x${initialDimensions.columns}`
    : 'default'

  return createPortal(
    <FloatingTableEditor
      key={tableDimensionsKey}
      editor={editor}
      anchorRect={anchorRect}
      lastSelection={lastSelection}
      initialDimensions={initialDimensions}
      onClose={() => setIsOpen(false)}
      anchorElem={tableAnchorElem}
    />,
    tableAnchorElem,
  )
}
