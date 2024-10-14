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
  /**
   * @param node - The node to register
   * @param index - The index of the node
   * @description - Register the node in the refs array, update
   * the elements count
   */
  registerRef: (node: HTMLElement | null, index: number) => void
  /**
   * @param index - The index of the node
   * @description - Unregister the node in the refs array, update
   * the elements count
   */
  unregisterRef: (index: number) => void
  handleKeyDown: (event: KeyboardEvent) => void
  /** The index of the focused item */
  focusedItemIndex: number
  /**
   * @description - Focus on the previous item
   * Used on dynamically removing items for focus to be maintained
   * From inside the item, call focusPrevItem (via render props) to focus on the next item
   */
  focusNextItem: () => void
  /**
   * @description - Focus on the previous item
   * Used on dynamically removing items for focus to be maintained
   * From inside the item, call focusPrevItem (via render props) to focus on the previous item
   */
  focusPrevItem: () => void
  /**
   * @description - Focus the next enabled
   * item when the focused item is disabled or doesn't exist anymore
   */
  focusClosestEnabledItem: () => void
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

  /** Move to the previous item, or the last item if the index is out of bounds */
  const moveInNegDir = useCallback(
    (index: number) => (index > 0 ? index - 1 : elementsCount - 1),
    [elementsCount],
  )

  /** Move to the next item, or the first item if the index is out of bounds */
  const moveInPosDir = useCallback(
    (index: number) => (index < elementsCount - 1 ? index + 1 : 0),
    [elementsCount],
  )

  /**
   *
   * @param node - The node to register
   * @description - Register the node in the refs array, update the elements count
   */
  const registerRef = useCallback((node: HTMLElement | null, index: number) => {
    refs.current.set(index, node)

    setElementsCount((prev) => prev + 1)
    // setElementsCount((prev) => Math.max(prev, index + 1))
  }, [])

  /**
   *
   * @param index - The index of the node to unregister
   * @description - Unregister the node in the refs array, update the elements count
   */
  const unregisterRef = useCallback((index: number) => {
    refs.current.delete(index)

    setElementsCount((prev) => prev - 1)
    // setElementsCount(() => index - 1)
  }, [])

  /**
   * @description - Focus on the next item
   * Used on dynamically removing items for focus to be maintained
   * From inside the item, call focusNextItem (via render props) to focus on the next item
   */
  const focusNextItem = useCallback(() => {
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

  /**
   * @description - Focus on the previous item
   * Used on dynamically removing items for focus to be maintained
   * From inside the item, call focusPrevItem (via render props) to focus on the previous item
   */
  const focusPrevItem = useCallback(() => {
    // If there are no elements, return
    if (elementsCount === 0) return

    // If the focused item is the first item, focus on the last item
    if (focusedItemIndex === 0) {
      refs.current.get(elementsCount + 1)?.focus()
      // If the focused item is not the first item, focus on the previous item
    } else if (focusedItemIndex >= 0) {
      refs.current.get(focusedItemIndex - 1)?.focus()
    }
  }, [focusedItemIndex, elementsCount])

  /**
   * @description - Focus the next enabled
   * item when the focused item is disabled or doesn't exist anymore
   */
  const focusClosestEnabledItem = useCallback(() => {
    // If there are no elements, return
    if (elementsCount === 0) return

    let newFocusedItemIndex = moveInPosDir(focusedItemIndex)
    let newFocusedItem = refs.current.get(
      newFocusedItemIndex,
    ) as HTMLInputElement | null

    // If the new focused item is disabled or doesn't exist anymore,
    // move in the same direction till an enabled item is found
    while (newFocusedItem == null || newFocusedItem?.disabled) {
      newFocusedItemIndex = moveInPosDir(newFocusedItemIndex)
      newFocusedItem = refs.current.get(
        newFocusedItemIndex,
      ) as HTMLInputElement | null

      // If we got bask to the original index, all items are disabled
      // So, return
      if (newFocusedItemIndex === focusedItemIndex) return
    }

    // Set the new focused item index
    setFocusedItemIndex(newFocusedItemIndex)
  }, [elementsCount, moveInPosDir, focusedItemIndex])

  /**
   * @description - Focus the first enabled item from the start
   * when the focused item is disabled or doesn't exist anymore
   */
  const focusFirstEnabledItem = useCallback(() => {
    if (elementsCount === 0) return

    let newFocusedItemIndex = 0
    let newFocusedItem = refs.current.get(
      newFocusedItemIndex,
    ) as HTMLInputElement | null

    // If the new focused item is disabled or doesn't exist anymore,
    // move in the same direction till an enabled item is found
    while (newFocusedItem == null || newFocusedItem?.disabled) {
      newFocusedItemIndex = moveInPosDir(newFocusedItemIndex)
      newFocusedItem = refs.current.get(
        newFocusedItemIndex,
      ) as HTMLInputElement | null

      // If we got bask to the original index, all items are disabled
      // So, return
      if (newFocusedItemIndex == 0) return
    }

    // Set the new focused item index
    setFocusedItemIndex(newFocusedItemIndex)
  }, [elementsCount, moveInPosDir])

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
    if (!focusedItemDisabled) return

    focusFirstEnabledItem()
  }, [focusFirstEnabledItem, focusedItemDisabled])

  /**
   *
   * @param event - The keydown event
   * @description - Handle the keydown event
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    // If there are no elements, return
    if (elementsCount === 0) return

    // Define the keys based on the orientation and direction
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
      newFocusedItemIndex = focusMoveDirIsPos
        ? moveInPosDir(newFocusedItemIndex)
        : moveInNegDir(newFocusedItemIndex)

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
    focusNextItem,
    focusPrevItem,
    focusClosestEnabledItem,
    setFocusedItemIndex,
  }

  const mapRovingTabChildren = () => {
    let rovingTabIndex = 0

    // If the child is a RovingTabItem, clone it and pass the index
    // Else, clone the child and pass the props
    // So that the index is passed to the RovingTabItem only,
    // so we manage the focus only for the RovingTabItem children
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === RovingTabItem) {
          return React.cloneElement(child, {
            ...child.props,
            index: rovingTabIndex++,
          })
        }
        return React.cloneElement(child, {
          ...child.props,
        })
      }
      return child
    })
  }

  return (
    <RovingTabIndexContext.Provider value={value}>
      <Component
        ref={parentRef}
        onKeyDown={handleKeyDown}
        className={className}
        style={style}
      >
        {mapRovingTabChildren()}
      </Component>
    </RovingTabIndexContext.Provider>
  )
}

RovingTab.Item = RovingTabItem

export default RovingTab
