const VERTICAL_GAP = 10
const HORIZONTAL_GAP = 10

/**
 * Resolves the browser rectangle used to anchor a floating editor to the
 * current native selection.
 *
 * A regular selection range is returned directly. When a collapsed selection
 * produces a rectangle matching the editor root, the focused text or child
 * element is used instead so an empty paragraph does not anchor the floating
 * editor to the entire editor.
 *
 * @param rootElement The Lexical editor root used to detect root-sized ranges.
 * @returns The viewport-relative selection rectangle, or `null` when no usable
 * selection or focused element exists.
 */
export function getSelectionRect(
  rootElement: HTMLElement | null = null,
): DOMRect | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) {
    return null
  }

  const range = selection.getRangeAt(0)
  const rangeRect = range.getBoundingClientRect()
  const rootRect = rootElement?.getBoundingClientRect()
  const isRootSizedRect =
    rootRect &&
    rangeRect.top === rootRect.top &&
    rangeRect.left === rootRect.left &&
    rangeRect.width === rootRect.width &&
    rangeRect.height === rootRect.height

  if ((rangeRect.width || rangeRect.height) && !isRootSizedRect) {
    return rangeRect
  }

  const focusNode = selection.focusNode
  if (!focusNode) {
    return null
  }

  if (focusNode.nodeType === Node.TEXT_NODE) {
    return focusNode.parentElement?.getBoundingClientRect() ?? null
  }

  if (focusNode instanceof Element) {
    const child =
      focusNode.childNodes[selection.focusOffset] ??
      focusNode.childNodes[selection.focusOffset - 1]

    if (child instanceof Element) {
      return child.getBoundingClientRect()
    }

    if (focusNode !== rootElement) {
      return focusNode.getBoundingClientRect()
    }
  }

  return null
}

/**
 * Positions an absolutely positioned floating editor relative to an anchor
 * element inside the editor's scrolling container.
 *
 * The target and container rectangles are measured in viewport coordinates,
 * then converted to coordinates relative to the anchor before applying the
 * transform. The floating editor is placed above the target when possible,
 * moved below it when the upper position is outside the visible container,
 * and clamped to the container's visible bounds.
 *
 * If the target or anchor cannot be resolved, the floating editor is hidden
 * and moved off-screen.
 *
 * @param targetRect The viewport-relative rectangle of the selection or target.
 * @param floatingElem The floating element whose position and visibility are updated.
 * @param anchorElem The positioned editor element used as the coordinate origin.
 */
export function positionFloatingElement(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement | null,
) {
  const scrollerElem = anchorElem?.parentElement
  if (
    targetRect === null ||
    anchorElem === null ||
    scrollerElem === null ||
    scrollerElem === undefined
  ) {
    floatingElem.style.opacity = '0'
    floatingElem.style.transform = 'translate(-10000px, -10000px)'
    return
  }

  const floatingElemRect = floatingElem.getBoundingClientRect()
  const anchorRect = anchorElem.getBoundingClientRect()
  const scrollerRect = scrollerElem.getBoundingClientRect()

  const topBoundary = scrollerRect.top + VERTICAL_GAP
  const bottomBoundary =
    scrollerRect.bottom - floatingElemRect.height - VERTICAL_GAP

  let top = targetRect.top - floatingElemRect.height - VERTICAL_GAP
  let left = targetRect.left + targetRect.width / 2 - floatingElemRect.width / 2

  if (top < topBoundary) {
    top = targetRect.top + targetRect.height + VERTICAL_GAP
  }

  top = Math.min(Math.max(top, topBoundary), bottomBoundary)

  if (left + floatingElemRect.width > scrollerRect.right) {
    left = scrollerRect.right - floatingElemRect.width - HORIZONTAL_GAP
  } else if (left < scrollerRect.left) {
    left = scrollerRect.left + HORIZONTAL_GAP
  }

  top -= anchorRect.top
  left -= anchorRect.left

  floatingElem.style.opacity = '1'
  floatingElem.style.transform = `translate(${left}px, ${top}px)`
}
