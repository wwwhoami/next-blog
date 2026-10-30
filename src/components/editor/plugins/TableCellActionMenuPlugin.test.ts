import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  $createTableSelectionFrom,
  $deleteTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $findCellNode,
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
  $isTableNode,
  $isTableRowNode,
  $isTableSelection,
  $unmergeCell,
  TableCellNode,
  TableNode,
  TableRowNode,
} from '@lexical/table'
import {
  $deleteTable,
  $mergeSelectedCells,
} from './TableCellActionMenuActions'
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  INSERT_PARAGRAPH_COMMAND,
  createEditor,
  LexicalEditor,
} from 'lexical'
import { describe, expect, it } from 'vitest'

function createTableEditor() {
  const editor = createEditor({ nodes: [TableNode, TableRowNode, TableCellNode] })
  editor.registerCommand(
    INSERT_PARAGRAPH_COMMAND,
    () => {
      const paragraph = $createParagraphNode()
      $getRoot().append(paragraph)
      paragraph.selectEnd()
      return true
    },
    COMMAND_PRIORITY_EDITOR,
  )
  return editor
}

function flushEditorUpdate() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

function $getTestTable() {
  const table = $getRoot().getFirstChildOrThrow()
  if (!$isTableNode(table)) {
    throw new Error('Expected the root to contain a table')
  }
  return table
}

function $getTestTableRow(table: TableNode, index: number) {
  const row = table.getChildAtIndex(index)
  if (!$isTableRowNode(row)) {
    throw new Error(`Expected table row ${index}`)
  }
  return row
}

async function addTable(editor: LexicalEditor, rows = 2, columns = 2) {
  let cells: TableCellNode[] = []
  editor.update(() => {
    const table = $createTableNode()
    $getRoot().append(table)
    for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
      const row = $createTableRowNode()
      table.append(row)
      for (let columnIndex = 0; columnIndex < columns; columnIndex += 1) {
        const cell = $createTableCellNode()
        cell.append($createParagraphNode())
        row.append(cell)
        cells.push(cell)
      }
    }
  })
  await flushEditorUpdate()
  return cells
}

async function selectCells(
  editor: LexicalEditor,
  anchor: TableCellNode,
  focus: TableCellNode,
) {
  editor.update(() => {
    const table = anchor.getParentOrThrow().getParentOrThrow()
    if (!(table instanceof TableNode)) {
      throw new Error('Expected a table parent')
    }
    $setSelection($createTableSelectionFrom(table, anchor, focus))
  })
  await flushEditorUpdate()
}

describe('table cell action menu selection and mutations', () => {
  it('creates table selections that can merge an unmerged rectangle', async () => {
    const editor = createTableEditor()
    const cells = await addTable(editor)
    await selectCells(editor, cells[0], cells[3])

    editor.getEditorState().read(() => {
      expect($isTableSelection($getSelection())).toBe(true)
    })

    editor.update(() => {
      $mergeSelectedCells(cells)
    })
    await flushEditorUpdate()
    editor.getEditorState().read(() => {
      expect(cells[0].getRowSpan()).toBe(2)
      expect(cells[0].getColSpan()).toBe(2)
      const selection = $getSelection()
      expect($isRangeSelection(selection)).toBe(true)
      if (!$isRangeSelection(selection)) {
        throw new Error('Expected a range selection after merging cells')
      }
      expect($findCellNode(selection.anchor.getNode())?.is(cells[0])).toBe(
        true,
      )
      expect($findCellNode(selection.focus.getNode())?.is(cells[0])).toBe(true)
    })
  })

  it('keeps the selection valid when deleting the full table', async () => {
    const editor = createTableEditor()
    const cells = await addTable(editor)
    await selectCells(editor, cells[0], cells[3])

    editor.update(() => {
      const table = $getTestTable()
      $deleteTable(table, editor)
    })
    await flushEditorUpdate()

    editor.getEditorState().read(() => {
      expect($getRoot().getChildrenSize()).toBe(1)
      expect($isParagraphNode($getRoot().getFirstChild())).toBe(true)
      expect($isRangeSelection($getSelection())).toBe(true)
    })
  })

  it('uses the selected row and column count for structural mutations', async () => {
    const editor = createTableEditor()
    const cells = await addTable(editor, 2, 2)
    await selectCells(editor, cells[0], cells[2])
    editor.update(() => {
      $insertTableRowAtSelection(true)
      $insertTableRowAtSelection(true)
    })
    await flushEditorUpdate()
    editor.getEditorState().read(() => {
      const table = $getTestTable()
      expect(table.getChildrenSize()).toBe(4)
    })

    const currentCells: TableCellNode[] = []
    editor.getEditorState().read(() => {
      $getTestTable()
        .getChildren()
        .forEach((row) => {
          if (!$isTableRowNode(row)) {
            return
          }
          row.getChildren().forEach((cell) => {
            if (cell instanceof TableCellNode) currentCells.push(cell)
          })
        })
    })
    await selectCells(editor, currentCells[0], currentCells[1])
    editor.update(() => {
      $insertTableColumnAtSelection(true)
      $insertTableColumnAtSelection(true)
    })
    await flushEditorUpdate()
    editor.getEditorState().read(() => {
      const firstRow = $getTestTableRow($getTestTable(), 0)
      expect(firstRow.getChildrenSize()).toBe(4)
    })
  })

  it('supports deletion, alignment, striping, freezing, and unmerging', async () => {
    const editor = createTableEditor()
    const cells = await addTable(editor)
    await selectCells(editor, cells[0], cells[0])
    editor.update(() => {
      const table = $getTestTable()
      cells[0].setVerticalAlign('middle')
      table.setRowStriping(true).setFrozenRows(1).setFrozenColumns(1)
      $insertTableColumnAtSelection(true)
      $deleteTableColumnAtSelection()
      $mergeSelectedCells([cells[0], cells[1]])
      $unmergeCell()
    })
    await flushEditorUpdate()
    editor.getEditorState().read(() => {
      const table = $getTestTable()
      expect(table.getRowStriping()).toBe(true)
      expect(table.getFrozenRows()).toBe(1)
      expect(table.getFrozenColumns()).toBe(1)
      const firstCell = $getTestTableRow(table, 0).getFirstChildOrThrow()
      if (!(firstCell instanceof TableCellNode)) {
        throw new Error('Expected the first table cell')
      }
      expect(firstCell.getVerticalAlign()).toBe('middle')
    })

    const remainingCells: TableCellNode[] = []
    editor.getEditorState().read(() => {
      const secondRow = $getTestTableRow($getTestTable(), 1)
      secondRow.getChildren().forEach((cell) => {
        if (cell instanceof TableCellNode) remainingCells.push(cell)
      })
    })
    await selectCells(editor, remainingCells[0], remainingCells[0])
    editor.update(() => $deleteTableRowAtSelection())
    await flushEditorUpdate()
    editor.getEditorState().read(() => {
      expect($getTestTable().getChildrenSize()).toBe(1)
    })
  })
})
