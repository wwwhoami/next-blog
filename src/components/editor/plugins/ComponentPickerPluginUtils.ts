import type { TableDimensions } from '../EditorCommands'

export const MAX_TABLE_SIZE = 20

/**
 * Converts a dynamic table query into valid table dimension suggestions.
 *
 * Row-only queries and incomplete queries such as `12x` return suggestions
 * for every supported column count. Explicit queries such as `12x15` return
 * only the requested dimensions; values outside the supported range return
 * no suggestions.
 */
export function getDynamicTableDimensions(
  queryString: string,
): TableDimensions[] {
  const tableMatch = queryString.match(/^([1-9]\d?)(?:x([1-9]\d?)?)?$/i)
  if (!tableMatch) {
    return []
  }

  const rows = Number(tableMatch[1])
  if (rows > MAX_TABLE_SIZE) {
    return []
  }

  const columns = tableMatch[2]
    ? [Number(tableMatch[2])]
    : Array.from({ length: MAX_TABLE_SIZE }, (_, index) => index + 1)

  return columns
    .filter((columnCount) => columnCount <= MAX_TABLE_SIZE)
    .map((columnCount) => ({
      rows,
      columns: columnCount,
    }))
}
