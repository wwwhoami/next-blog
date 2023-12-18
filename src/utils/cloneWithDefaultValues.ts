/**
 * Clones an object with default values.
 * @param input Object to clone.
 * @param defaultValues Default values to assign to each key.
 * @returns Cloned object with default values.
 * @example
 * const input = { a: 1, b: 2 }
 * const defaultValues = 0
 * const output = cloneWithDefaultValues(input, defaultValues)
 * // output = { a: 0, b: 0 }
 */
const cloneWithDefaultValues = <T extends {}, U>(input: T, defaultValues: U) =>
  Object.keys(input).reduce(
    (clone, key) => ({ [key]: defaultValues, ...clone }),
    {} as Record<keyof T, U>,
  )

export default cloneWithDefaultValues
