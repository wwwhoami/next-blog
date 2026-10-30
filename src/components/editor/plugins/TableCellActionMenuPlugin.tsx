'use client'

import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import {
  ChevronDownIcon,
  RectangleGroupIcon,
  TableCellsIcon,
} from '@heroicons/react/20/solid'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $computeTableMap,
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $findCellNode,
  $findTableNode,
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  $isTableSelection,
  $unmergeCell,
  TableCellHeaderStates,
  TableCellNode,
  TableNode,
} from '@lexical/table'
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  LexicalNode,
} from 'lexical'
import { useCallback, useEffect, useState } from 'react'
import { $deleteTable, $mergeSelectedCells } from './TableCellActionMenuActions'
import ToolbarDropDownItem from './toolbar/ToolbarDropDownItem'
import { ToolbarSeparator } from './toolbar/ToolbarSeparator'

type VerticalAlign = 'top' | 'middle' | 'bottom'

type TableSelectionState = {
  table: TableNode
  cells: TableCellNode[]
  rowCount: number
  columnCount: number
  canMerge: boolean
  canUnmerge: boolean
  rowHeaderAction: 'Add row header' | 'Remove row header'
  columnHeaderAction: 'Add column header' | 'Remove column header'
}

function uniqueCells(cells: TableCellNode[]) {
  return [...new Map(cells.map((cell) => [cell.getKey(), cell])).values()]
}

function $getHeaderTargetCells(
  table: TableNode,
  cells: TableCellNode[],
  isColumn: boolean,
) {
  const [map, anchorMap, focusMap] = $computeTableMap(
    table,
    cells[0],
    cells[cells.length - 1],
  )
  const start = isColumn
    ? Math.min(anchorMap.startColumn, focusMap.startColumn)
    : Math.min(anchorMap.startRow, focusMap.startRow)
  const end = isColumn
    ? Math.max(anchorMap.startColumn, focusMap.startColumn)
    : Math.max(anchorMap.startRow, focusMap.startRow)

  return uniqueCells(
    isColumn
      ? map.flatMap((row) =>
          row.slice(start, end + 1).map((value) => value.cell),
        )
      : map
          .slice(start, end + 1)
          .flatMap((row) => row.map((value) => value.cell)),
  )
}

function $getTableFromSelectionNode(node: LexicalNode) {
  const cell = $findCellNode(node)
  return cell === null ? null : $findTableNode(cell)
}

/** Returns table-only selection details while inside a Lexical editor read/update. */
export function $getTableSelectionState(): TableSelectionState | null {
  const selection = $getSelection()
  let anchorCell: TableCellNode | null = null
  let focusCell: TableCellNode | null = null
  let table: TableNode | null = null

  if ($isTableSelection(selection)) {
    const tableNode = $getNodeByKey(selection.tableKey)
    if (!(tableNode instanceof TableNode)) {
      return null
    }
    try {
      anchorCell = $findCellNode(selection.anchor.getNode())
      focusCell = $findCellNode(selection.focus.getNode())
    } catch {
      // A table merge can remove the former anchor or focus cell. The merge
      // action immediately replaces the selection, but ignore this transient
      // stale selection if an update listener observes it first.
      return null
    }
    table = tableNode
  } else if ($isRangeSelection(selection)) {
    anchorCell = $findCellNode(selection.anchor.getNode())
    focusCell = $findCellNode(selection.focus.getNode())
    if (anchorCell === null || focusCell === null) {
      return null
    }
    table = $getTableFromSelectionNode(anchorCell)
    if (table === null || !table.is($getTableFromSelectionNode(focusCell))) {
      return null
    }
  } else {
    return null
  }

  if (anchorCell === null || focusCell === null || table === null) {
    return null
  }

  const [tableMap, anchorMap, focusMap] = $computeTableMap(
    table,
    anchorCell,
    focusCell,
  )
  const minRow = Math.min(anchorMap.startRow, focusMap.startRow)
  const maxRow = Math.max(
    anchorMap.startRow + anchorCell.getRowSpan() - 1,
    focusMap.startRow + focusCell.getRowSpan() - 1,
  )
  const minColumn = Math.min(anchorMap.startColumn, focusMap.startColumn)
  const maxColumn = Math.max(
    anchorMap.startColumn + anchorCell.getColSpan() - 1,
    focusMap.startColumn + focusCell.getColSpan() - 1,
  )
  const cells = uniqueCells(
    tableMap
      .slice(minRow, maxRow + 1)
      .flatMap((row) =>
        row.slice(minColumn, maxColumn + 1).map((tableCell) => tableCell.cell),
      ),
  )
  const rectangularCellCount =
    (maxRow - minRow + 1) * (maxColumn - minColumn + 1)
  const rowHeaderCells = $getHeaderTargetCells(table, cells, false)
  const columnHeaderCells = $getHeaderTargetCells(table, cells, true)
  const canMerge =
    $isTableSelection(selection) &&
    cells.length > 1 &&
    cells.length === rectangularCellCount &&
    cells.every((cell) => cell.getRowSpan() === 1 && cell.getColSpan() === 1)

  return {
    table,
    cells,
    rowCount: maxRow - minRow + 1,
    columnCount: maxColumn - minColumn + 1,
    canMerge,
    canUnmerge:
      cells.length === 1 &&
      (anchorCell.getRowSpan() > 1 || anchorCell.getColSpan() > 1),
    rowHeaderAction: rowHeaderCells.every((cell) =>
      cell.hasHeaderState(TableCellHeaderStates.ROW),
    )
      ? 'Remove row header'
      : 'Add row header',
    columnHeaderAction: columnHeaderCells.every((cell) =>
      cell.hasHeaderState(TableCellHeaderStates.COLUMN),
    )
      ? 'Remove column header'
      : 'Add column header',
  }
}

function $updateSelectedCells(callback: (cell: TableCellNode) => void) {
  const state = $getTableSelectionState()
  state?.cells.forEach(callback)
}

function $toggleHeader(header: number, isColumn: boolean) {
  const state = $getTableSelectionState()
  if (state === null) {
    return
  }

  const targetCells = $getHeaderTargetCells(state.table, state.cells, isColumn)
  const shouldAdd = !targetCells.every((cell) => cell.hasHeaderState(header))
  targetCells.forEach((cell) => {
    const current = cell.getHeaderStyles()
    cell.setHeaderStyles(
      shouldAdd ? current | header : current & ~header,
      header,
    )
  })
}

function MenuSeparator() {
  return <div className="my-1 h-px bg-gray-300 dark:bg-gray-600" />
}

export default function TableCellActionMenuPlugin() {
  const [editor] = useLexicalComposerContext()
  const [selectionState, setSelectionState] =
    useState<TableSelectionState | null>(null)

  const updateSelectionState = useCallback(() => {
    editor.getEditorState().read(() => {
      setSelectionState($getTableSelectionState())
    })
  }, [editor])

  useEffect(
    () => editor.registerUpdateListener(updateSelectionState),
    [editor, updateSelectionState],
  )

  const run = useCallback(
    (action: (state: TableSelectionState) => void) => {
      editor.update(() => {
        const state = $getTableSelectionState()
        if (state !== null) {
          action(state)
        }
      })
    },
    [editor],
  )

  if (selectionState === null) {
    return null
  }

  const insertRows = (after: boolean) =>
    run((state) => {
      for (let index = 0; index < state.rowCount; index += 1) {
        $insertTableRowAtSelection(after)
      }
    })
  const insertColumns = (after: boolean) =>
    run((state) => {
      for (let index = 0; index < state.columnCount; index += 1) {
        $insertTableColumnAtSelection(after)
      }
    })

  return (
    <>
      <Menu>
        <MenuButton className="inline-flex items-center rounded-md px-2 py-1 text-sm font-medium hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:hover:bg-gray-700">
          <TableCellsIcon className="mr-1 size-4" />
          Table
          <ChevronDownIcon className="ml-1 size-4" />
        </MenuButton>
        <MenuItems
          anchor="top"
          className="z-30 w-64 origin-bottom rounded-xl bg-gray-50 p-1 text-sm shadow-lg transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 dark:bg-gray-800 dark:shadow-xl"
        >
          {selectionState.canMerge && (
            <ToolbarDropDownItem
              text="Merge selected cells"
              icon={<RectangleGroupIcon />}
              onClick={() => run((state) => $mergeSelectedCells(state.cells))}
            />
          )}
          {selectionState.canUnmerge && (
            <ToolbarDropDownItem
              text="Unmerge cell"
              onClick={() => run(() => $unmergeCell())}
            />
          )}
          {(selectionState.canMerge || selectionState.canUnmerge) && (
            <MenuSeparator />
          )}
          <ToolbarDropDownItem
            text="Insert row above"
            onClick={() => insertRows(false)}
          />
          <ToolbarDropDownItem
            text="Insert row below"
            onClick={() => insertRows(true)}
          />
          <ToolbarDropDownItem
            text="Insert column left"
            onClick={() => insertColumns(false)}
          />
          <ToolbarDropDownItem
            text="Insert column right"
            onClick={() => insertColumns(true)}
          />
          <MenuSeparator />
          <ToolbarDropDownItem
            text="Delete selected rows"
            onClick={() => run(() => $deleteTableRowAtSelection())}
          />
          <ToolbarDropDownItem
            text="Delete selected columns"
            onClick={() => run(() => $deleteTableColumnAtSelection())}
          />
          <ToolbarDropDownItem
            text="Delete table"
            onClick={() => run((state) => $deleteTable(state.table, editor))}
          />
          <MenuSeparator />
          <ToolbarDropDownItem
            text={selectionState.rowHeaderAction}
            onClick={() =>
              run(() => $toggleHeader(TableCellHeaderStates.ROW, false))
            }
          />
          <ToolbarDropDownItem
            text={selectionState.columnHeaderAction}
            onClick={() =>
              run(() => $toggleHeader(TableCellHeaderStates.COLUMN, true))
            }
          />
          <MenuSeparator />
          {(['top', 'middle', 'bottom'] as VerticalAlign[]).map((align) => (
            <ToolbarDropDownItem
              key={align}
              text={`Align cells ${align}`}
              onClick={() =>
                run(() =>
                  $updateSelectedCells((cell) => cell.setVerticalAlign(align)),
                )
              }
            />
          ))}
          <MenuSeparator />
          <ToolbarDropDownItem
            text="Toggle row striping"
            onClick={() =>
              run((state) =>
                state.table.setRowStriping(!state.table.getRowStriping()),
              )
            }
          />
          <ToolbarDropDownItem
            text="Toggle frozen first row"
            onClick={() =>
              run((state) =>
                state.table.setFrozenRows(
                  state.table.getFrozenRows() === 1 ? 0 : 1,
                ),
              )
            }
          />
          <ToolbarDropDownItem
            text="Toggle frozen first column"
            onClick={() =>
              run((state) =>
                state.table.setFrozenColumns(
                  state.table.getFrozenColumns() === 1 ? 0 : 1,
                ),
              )
            }
          />
        </MenuItems>
      </Menu>
      <ToolbarSeparator />
    </>
  )
}
