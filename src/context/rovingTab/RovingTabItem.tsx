import { ElementType, ReactNode, RefObject, useEffect, useRef } from 'react'
import { useRovingTabIndex } from './RovingTab'

interface RovingTabItemProps {
  as?: ElementType
  children:
    | (({
        tabIndex,
        ref,
        refocus,
      }: {
        tabIndex: number
        ref: RefObject<HTMLElement>
        refocus: () => void
      }) => ReactNode)
    | ReactNode
  index?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * @param children - children to render
 * @param Component - wrapper component to render
 * @param className - className to apply to the wrapper component
 * @param style - style to apply to the wrapper component
 * @description - wrapper component for roving tab index items
 * Registers the ref with the roving tab index context
 * Sets the tabIndex based on the focusedItemIndex
 */
function RovingTabItem({
  children,
  index,
  as: Component = 'div',
  className,
  style,
}: RovingTabItemProps) {
  const { registerRef, unregisterRef, focusedItemIndex, refocus } =
    useRovingTabIndex()
  const ref = useRef<HTMLElement>(null)

  const tabIndex = focusedItemIndex === index ? 0 : -1

  // Register the ref on mount, unregister on unmount
  useEffect(() => {
    if (index === undefined) return

    if (ref.current) {
      registerRef(ref.current, index)
    }

    return () => {
      unregisterRef(index)
    }
  }, [index, registerRef, unregisterRef])

  const props =
    typeof children === 'function'
      ? { className, style }
      : { ref, tabIndex, className, style }

  return (
    <Component {...props}>
      {typeof children === 'function'
        ? // If children is a function, it will be called with the tabIndex, ref, and refocus function
          children({ tabIndex, ref, refocus })
        : // If children is not a function, it will be rendered as-is
          children}
    </Component>
  )
}

export default RovingTabItem
