import { $isAtNodeEnd } from '@lexical/selection'
import { RangeSelection } from 'lexical'

/**
 * Returns a viewport-relative rectangle for the current native selection.
 *
 * Normal selections use the range rectangle directly. Collapsed selections
 * whose rectangle matches the editor root fall back to the focused text
 * element or child element, avoiding positioning floating UI against the
 * entire editor when the caret is in an empty paragraph.
 *
 * @param rootElement The editor root used to detect root-sized selection
 * rectangles.
 * @returns A usable selection rectangle, or `null` when no selection anchor
 * can be resolved.
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

export function getSelectedNode(selection: RangeSelection) {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()
  if (anchorNode === focusNode) {
    return anchorNode
  }
  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode
  }
}

const SUPPORTED_URL_PROTOCOLS = new Set(['http:', 'https:'])

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url)

    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return 'about:blank'
    }
  } catch {
    return url
  }
  return url
}

const urlRegExp = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
)

export function validateUrl(url: string): boolean {
  return url === 'https://' || urlRegExp.test(url)
}
