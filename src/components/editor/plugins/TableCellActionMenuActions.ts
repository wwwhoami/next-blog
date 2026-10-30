import { $mergeCells, TableCellNode, TableNode } from '@lexical/table'
import {
  $isRootNode,
  INSERT_PARAGRAPH_COMMAND,
  LexicalEditor,
} from 'lexical'

export function $mergeSelectedCells(cells: TableCellNode[]) {
  const mergedCell = $mergeCells(cells)
  mergedCell?.selectEnd()
}

export function $deleteTable(table: TableNode, editor: LexicalEditor) {
  table.selectPrevious()
  const parent = table.getParent()
  table.remove()
  if ($isRootNode(parent) && parent.isEmpty()) {
    editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined)
  }
}
