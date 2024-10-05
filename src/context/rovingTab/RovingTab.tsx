import React, {
  ElementType,
  KeyboardEvent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import RovingTabItem from './RovingTabItem'

interface RovingTabIndexContextValue {
  registerRef: (node: HTMLElement | null, index: number) => void
  unregisterRef: (index: number) => void
  handleKeyDown: (event: KeyboardEvent) => void
  focusedItemIndex: number
  refocus: () => void
}

const RovingTabIndexContext = createContext<
  RovingTabIndexContextValue | undefined
>(undefined)

export const useRovingTabIndex = () => {
  const context = useContext(RovingTabIndexContext)

  if (!context) {
    throw new Error(
      'useRovingTabIndex must be used within a RovingTabIndexProvider',
    )
  }

  return context
}

interface RovingTabIndexProviderProps {
  children: ReactNode
  as?: ElementType
  className?: string
  style?: React.CSSProperties
  orientation?: 'horizontal' | 'vertical'
  direction?: 'standart' | 'reverse'
}

/**
 * @param children - children to render
 * @param Component - wrapper component to render
 * @param className - className to apply to the wrapper component
 * @param style - style to apply to the wrapper component
 * @param orientation - the axis to move on
 * @param direction - the direction to move in
 * @description Provider for the roving tab index context
 * Controls the focus of children based on arrow keys
 */
const RovingTab = ({
  children,
  as: Component = 'div',
  className,
  style,
  orientation = 'horizontal',
  direction = 'standart',
}: RovingTabIndexProviderProps) => {
  const [focusedItemIndex, setFocusedItemIndex] = useState(0)
  const [elementsCount, setElementsCount] = useState(0)

  const refs = useRef<Map<number, HTMLElement | null>>(new Map())
  const parentRef = useRef<HTMLElement>(null)

  const focusedItemDisabled = (
    refs.current.get(focusedItemIndex) as HTMLInputElement | null
  )?.disabled
  console.log(focusedItemDisabled)

  /**
   *
   * @param node - The node to register
   * @description - Register the node in the refs array, update the elements count
   */
  const registerRef = useCallback((node: HTMLElement | null, index: number) => {
    refs.current.set(index, node)

    setElementsCount((prev) => prev + 1)
  }, [])

  /**
   *
   * @param index - The index of the node to unregister
   * @description - Unregister the node in the refs array, update the elements count
   */
  const unregisterRef = useCallback((index: number) => {
    refs.current.delete(index)

    setElementsCount((prev) => prev - 1)
  }, [])

  /**
   *
   * @description - Focus the next item
   * Used on dynamically removing items for focus to be maintained
   * From inside the item, call refocus (via render props) to focus the next item
   */
  const refocus = useCallback(() => {
    // If there are no elements, return
    if (elementsCount === 0) return

    // If the focused item is the last item, focus on the previous item
    if (focusedItemIndex === elementsCount - 1) {
      refs.current.get(focusedItemIndex - 1)?.focus()
      // If the focused item is not the last item, focus on the next item
    } else if (focusedItemIndex >= 0) {
      refs.current.get(focusedItemIndex + 1)?.focus()
    }
  }, [focusedItemIndex, elementsCount])

  // Focus the item when the focusedItemIndex changes and focus is within the parent
  useEffect(() => {
    if (parentRef.current?.contains(document.activeElement)) {
      refs.current.get(focusedItemIndex)?.focus()
    }
  }, [focusedItemIndex])

  // If the focusedItemIndex is out of bounds, set it to the last item
  useEffect(() => {
    if (focusedItemIndex >= elementsCount - 1 && elementsCount > 0) {
      setFocusedItemIndex(elementsCount - 1)
    }
  }, [elementsCount, focusedItemIndex])

  /**
   * @description - Update the focused item index based on the focused item
   * element being disabled or not existing anymore (due to dynamic removal)
   * If the focused item is disabled or doesn't exist anymore, move in the same direction
   * till an enabled item is found or if all items are disabled, return
   */
  useEffect(() => {
    //  If there are no elements or focused item is enabled, return
    if (elementsCount === 0 || !focusedItemDisabled) return

    let newFocusedItemIndex = 0
    let newFocusedItem = refs.current.get(
      newFocusedItemIndex,
    ) as HTMLInputElement | null

    // If the new focused item is disabled or doesn't exist anymore,
    // move in the same direction till an enabled item is found
    while (newFocusedItem == null || newFocusedItem?.disabled) {
      newFocusedItemIndex += 1
      newFocusedItem = refs.current.get(
        newFocusedItemIndex,
      ) as HTMLInputElement | null

      // If all items are disabled, return
      if (newFocusedItemIndex >= elementsCount) {
        return
      }
    }

    // Set the new focused item index
    setFocusedItemIndex(newFocusedItemIndex)
  }, [elementsCount, focusedItemDisabled])

  /**
   *
   * @param event - The keydown event
   * @description - Handle the keydown event
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    // If there are no elements, return
    if (elementsCount === 0) return

    const positiveMoveKey =
      orientation === 'horizontal'
        ? direction === 'standart'
          ? 'ArrowRight'
          : 'ArrowLeft'
        : direction === 'standart'
          ? 'ArrowDown'
          : 'ArrowUp'
    const negativeMoveKey =
      orientation === 'horizontal'
        ? direction === 'standart'
          ? 'ArrowLeft'
          : 'ArrowRight'
        : direction === 'standart'
          ? 'ArrowUp'
          : 'ArrowDown'

    const moveToFirstKey = direction === 'standart' ? 'Home' : 'End'
    const moveToLastKey = direction === 'standart' ? 'End' : 'Home'

    let newFocusedItemIndex: number
    let focusMoveDirIsPos: boolean

    // Move to the previous item, or the last item if the index is out of bounds
    const moveInNegDir = (index: number) =>
      index > 0 ? index - 1 : elementsCount - 1

    // Move to the next item, or the first item if the index is out of bounds
    const moveInPosDir = (index: number) =>
      index < elementsCount - 1 ? index + 1 : 0

    switch (event.code) {
      case negativeMoveKey:
        event.preventDefault()
        newFocusedItemIndex = moveInNegDir(focusedItemIndex)
        focusMoveDirIsPos = false
        break
      case positiveMoveKey:
        event.preventDefault()
        newFocusedItemIndex = moveInPosDir(focusedItemIndex)
        focusMoveDirIsPos = true
        break
      case moveToFirstKey:
        event.preventDefault()
        newFocusedItemIndex = 0
        focusMoveDirIsPos = true
        break
      case moveToLastKey:
        event.preventDefault()
        newFocusedItemIndex = elementsCount - 1
        focusMoveDirIsPos = false
        break
      default:
        return
    }

    let focusedItem = refs.current.get(
      newFocusedItemIndex,
    ) as HTMLInputElement | null

    // If the new focused item is disabled or doesn't exist anymore,
    // move in the same direction till an enabled item is found
    while (focusedItem == null || focusedItem?.disabled) {
      // if the direction is positive, move in positive direction, else move in negative direction
      if (focusMoveDirIsPos) {
        newFocusedItemIndex = moveInPosDir(newFocusedItemIndex)
      } else {
        newFocusedItemIndex = moveInNegDir(newFocusedItemIndex)
      }

      focusedItem = refs.current.get(
        newFocusedItemIndex,
      ) as HTMLInputElement | null
    }

    // Set the new focused item index
    setFocusedItemIndex(newFocusedItemIndex)
  }

  const value = {
    registerRef,
    unregisterRef,
    handleKeyDown,
    focusedItemIndex,
    refocus,
  }

  return (
    <RovingTabIndexContext.Provider value={value}>
      <Component
        ref={parentRef}
        onKeyDown={handleKeyDown}
        className={className}
        style={style}
      >
        {
          // Add the index prop to each child
          React.Children.map(children, (child, index) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                ...child.props,
                index,
              })
            }
            return child
          })
        }
      </Component>
    </RovingTabIndexContext.Provider>
  )
}

RovingTab.Item = RovingTabItem

export default RovingTab
