import { createCommand } from 'lexical'

export const EDIT_LINK_COMMAND = createCommand<void>()

export type TableDimensions = {
  rows: number
  columns: number
}

export const INSERT_TABLE_COMMAND = createCommand<TableDimensions | undefined>()
