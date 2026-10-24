import { describe, expect, it } from 'vitest'
import { getDynamicTableDimensions } from './ComponentPickerPluginUtils'

describe('getDynamicTableDimensions', () => {
  it('returns all supported column suggestions for a row-only query', () => {
    expect(getDynamicTableDimensions('3')).toEqual(
      Array.from({ length: 20 }, (_, index) => ({
        rows: 3,
        columns: index + 1,
      })),
    )
  })

  it('returns one suggestion for an explicit table size', () => {
    expect(getDynamicTableDimensions('4x6')).toEqual([{ rows: 4, columns: 6 }])
  })

  it('keeps table suggestions visible while entering columns', () => {
    expect(getDynamicTableDimensions('12x')).toEqual(
      Array.from({ length: 20 }, (_, index) => ({
        rows: 12,
        columns: index + 1,
      })),
    )
  })

  it.each(['0', '01', '3x0', '3x21', '21', 'table'])(
    'rejects invalid table query %s',
    (query) => {
      expect(getDynamicTableDimensions(query)).toEqual([])
    },
  )
})
