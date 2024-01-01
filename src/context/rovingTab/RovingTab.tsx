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
}

/**
 *
 * @param children - children to render
 * @param Component - wrapper component to render
 * @param className - className to apply to the wrapper component
 * @param style - style to apply to the wrapper component
 * @description - provider for the roving tab index context
 * Controls the focus of children based on arrow keys
 */
const RovingTab = ({
  children,
  as: Component = 'div',
  className,
  style,
}: RovingTabIndexProviderProps) => {
  const [focusedItemIndex, setFocusedItemIndex] = useState(0)
  const [elementsCount, setElementsCount] = useState(0)

  const refs = useRef<Map<number, HTMLElement | null>>(new Map())
  const parentRef = useRef<HTMLElement>(null)

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
   *
   * @param event - The keydown event
   * @description - Handle the keydown event
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        // If the focusedItemIndex is out of bounds, set it to the last item
        // Otherwise, decrement it
        setFocusedItemIndex((prev) => (prev > 0 ? prev - 1 : elementsCount - 1))
        break
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        // If the focusedItemIndex is out of bounds, set it to the first item
        // Otherwise, increment it
        setFocusedItemIndex((prev) => (prev < elementsCount - 1 ? prev + 1 : 0))
        break
      case 'Home':
        event.preventDefault()
        setFocusedItemIndex(0)
        break
      case 'End':
        event.preventDefault()
        setFocusedItemIndex(elementsCount - 1)
        break
      default:
        return
    }
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
