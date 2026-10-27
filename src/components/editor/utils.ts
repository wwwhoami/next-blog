import { sanitizeUrl as sanitizeUnsafeUrl } from '@braintree/sanitize-url'
import { $isLinkNode } from '@lexical/link'
import { $isAtNodeEnd } from '@lexical/selection'
import ipaddr from 'ipaddr.js'
import {
  $getRoot,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
  BaseSelection,
  ElementNode,
  RangeSelection,
} from 'lexical'
import isURL from 'validator/lib/isURL'

const PUNCTUATION_PATTERN = /\p{P}/u

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

/**
 * Expands a collapsed text selection to the word containing the cursor.
 * Existing non-collapsed selections are left unchanged, while punctuation at
 * the inferred word boundaries is excluded.
 *
 * @param selection The Lexical selection to inspect and update.
 * @returns Whether the selection can be used for link creation.
 */
export function $selectWordAtCursor(selection: BaseSelection): boolean {
  if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
    return true
  }

  const anchor = selection.anchor
  const node = anchor.getNode()

  if (!$isTextNode(node)) {
    return false
  }

  const text = node.getTextContent()
  const offset = anchor.offset

  if (
    offset === 0 ||
    offset === text.length ||
    /\s/.test(text[offset - 1]) ||
    /\s/.test(text[offset])
  ) {
    return false
  }

  let start = offset
  while (start > 0 && !/\s/.test(text[start - 1])) {
    start--
  }

  let end = offset
  while (end < text.length && !/\s/.test(text[end])) {
    end++
  }

  while (start < end && PUNCTUATION_PATTERN.test(text[start])) {
    start++
  }
  while (end > start && PUNCTUATION_PATTERN.test(text[end - 1])) {
    end--
  }

  if (start === end) {
    return false
  }

  selection.setTextNodeRange(node, start, node, end)
  return true
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

const SUPPORTED_URL_PROTOCOLS = ['http', 'https'] as const
const SUPPORTED_URL_PROTOCOL_SET = new Set(
  SUPPORTED_URL_PROTOCOLS.map((protocol) => `${protocol}:`),
)
const SAFE_NON_WEB_PROTOCOLS = new Set(['mailto:'])
const LINK_URL_PLACEHOLDER = 'https://'

type UrlValidationResult =
  | { valid: true; url: string }
  | { valid: false; reason: string }

/**
 * Checks whether a hostname identifies a local name or a non-public IP range.
 *
 * DNS names are classified only by their literal hostname; resolving public
 * hostnames to private addresses requires a server-side network check.
 */
function isPrivateHostname(hostname: string): boolean {
  const normalizedHostname = hostname.toLowerCase().replace(/^\[|\]$/g, '')

  if (
    normalizedHostname === 'localhost' ||
    normalizedHostname.endsWith('.localhost') ||
    normalizedHostname.endsWith('.local')
  ) {
    return true
  }

  if (!ipaddr.isValid(normalizedHostname)) {
    return false
  }

  return ipaddr.process(normalizedHostname).range() !== 'unicast'
}

/**
 * Normalizes and validates a user-provided web URL for post content.
 *
 * The check trims surrounding whitespace, requires HTTP or HTTPS, rejects
 * unsafe URL structures and private destinations, and returns either a
 * canonical URL or a user-facing validation reason.
 */
export function normalizeAndValidateUrl(url: string): UrlValidationResult {
  const normalizedInput = url.trim()

  if (normalizedInput === '') {
    return { valid: false, reason: 'A URL is required.' }
  }

  // Reject parser-affecting control characters.
  if (/[\u0000-\u001f\u007f]/.test(normalizedInput)) {
    return { valid: false, reason: 'The URL contains control characters.' }
  }
  if (/\s/.test(normalizedInput)) {
    return { valid: false, reason: 'The URL cannot contain whitespace.' }
  }

  try {
    // Native URL parsing provides the canonical stored value.
    const parsedUrl = new URL(normalizedInput)

    if (!SUPPORTED_URL_PROTOCOL_SET.has(parsedUrl.protocol)) {
      return { valid: false, reason: 'Only HTTP and HTTPS URLs are allowed.' }
    }
    if (!parsedUrl.hostname) {
      return { valid: false, reason: 'A hostname is required.' }
    }
    if (parsedUrl.username || parsedUrl.password) {
      return {
        valid: false,
        reason: 'URLs with embedded credentials are not allowed.',
      }
    }
    if (isPrivateHostname(parsedUrl.hostname)) {
      return {
        valid: false,
        reason: 'Links to private or local destinations are not allowed.',
      }
    }

    // Apply remaining URL-shape checks after reporting parser-level errors.
    if (
      !isURL(normalizedInput, {
        protocols: [...SUPPORTED_URL_PROTOCOLS],
        require_protocol: true,
        require_valid_protocol: true,
        allow_fragments: true,
        allow_query_components: true,
        disallow_auth: true,
      })
    ) {
      return { valid: false, reason: 'Enter a valid HTTP or HTTPS URL.' }
    }

    return { valid: true, url: parsedUrl.toString() }
  } catch {
    return { valid: false, reason: 'Enter a valid HTTP or HTTPS URL.' }
  }
}

/**
 * Sanitizes a URL before it is rendered or opened by the editor.
 *
 * Valid web URLs are normalized and passed through the URL sanitizer.
 * Invalid URLs are replaced with `about:blank`, except for supported
 * non-web protocols such as `mailto:`.
 */
export function sanitizeUrl(url: string): string {
  const result = normalizeAndValidateUrl(url)
  if (result.valid) {
    return sanitizeUnsafeUrl(result.url)
  }

  return sanitizeSafeNonWebUrl(url) ?? 'about:blank'
}

function sanitizeSafeNonWebUrl(url: string): string | null {
  const sanitizedUrl = sanitizeUnsafeUrl(url.trim())
  try {
    const parsedUrl = new URL(sanitizedUrl)
    return SAFE_NON_WEB_PROTOCOLS.has(parsedUrl.protocol)
      ? sanitizedUrl
      : null
  } catch {
    return null
  }
}

export function isValidUrl(url: string): boolean {
  return normalizeAndValidateUrl(url).valid
}

export function validateUrl(url: string): boolean {
  return url === LINK_URL_PLACEHOLDER || isValidUrl(url)
}

/**
 * Sanitizes link nodes created while importing Markdown into the editor.
 *
 * Valid web links are normalized in place. Supported non-web links, such as
 * sanitized `mailto:` URLs, are preserved. Invalid links are removed while
 * their child content is preserved as plain editor content.
 */
export function $sanitizeImportedLinks() {
  const $visit = (node: ElementNode) => {
    for (const child of node.getChildren()) {
      if ($isLinkNode(child)) {
        const validation = normalizeAndValidateUrl(child.getURL())
        if (validation.valid) {
          child.setURL(validation.url)
        } else {
          const sanitizedUrl = sanitizeSafeNonWebUrl(child.getURL())
          if (sanitizedUrl) {
            child.setURL(sanitizedUrl)
            continue
          }

          for (const linkChild of child.getChildren()) {
            child.insertBefore(linkChild)
          }
          child.remove()
          continue
        }
      }

      if ($isElementNode(child)) {
        $visit(child)
      }
    }
  }

  $visit($getRoot())
}
