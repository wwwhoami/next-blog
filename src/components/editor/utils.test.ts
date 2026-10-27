import { $createLinkNode, $isLinkNode, LinkNode } from '@lexical/link'
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isElementNode,
  createEditor,
} from 'lexical'
import { describe, expect, it } from 'vitest'
import {
  $sanitizeImportedLinks,
  normalizeAndValidateUrl,
  sanitizeUrl,
} from './utils'

describe('normalizeAndValidateUrl', () => {
  it.each([
    [
      'https://example.com/path?q=1#section',
      'https://example.com/path?q=1#section',
    ],
    ['  http://example.com  ', 'http://example.com/'],
  ])('accepts and normalizes %s', (input, expected) => {
    expect(normalizeAndValidateUrl(input)).toEqual({
      valid: true,
      url: expected,
    })
  })

  it.each([
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'https://user:password@example.com',
    'https://example.com:bad',
    'https://example.com/\nnext',
    'https://example .com',
    'https://localhost',
    'http://127.0.0.1',
    'http://10.0.0.1',
    'http://169.254.1.1',
    'http://192.168.1.1',
    'http://[::1]',
    'http://[fc00::1]',
    'http://[::ffff:127.0.0.1]',
  ])('rejects unsafe URL %s', (input) => {
    expect(normalizeAndValidateUrl(input).valid).toBe(false)
  })
})

describe('$sanitizeImportedLinks', () => {
  it('preserves sanitized mailto links', async () => {
    const editor = createEditor({ nodes: [LinkNode] })

    editor.update(() => {
      const paragraph = $createParagraphNode()
      const link = $createLinkNode(' mailto:user@example.com ')
      link.append($createTextNode('Email us'))
      paragraph.append(link)
      $getRoot().append(paragraph)
      $sanitizeImportedLinks()
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    editor.getEditorState().read(() => {
      const paragraph = $getRoot().getFirstChild()
      if ($isElementNode(paragraph)) {
        const link = paragraph.getFirstChild()
        expect($isLinkNode(link)).toBe(true)
        if ($isLinkNode(link)) {
          expect(link.getURL()).toBe('mailto:user@example.com')
        }
      }
    })
  })

  it('unwraps invalid links while preserving their text', async () => {
    const editor = createEditor({ nodes: [LinkNode] })

    editor.update(() => {
      const paragraph = $createParagraphNode()
      const link = $createLinkNode('javascript:alert(1)')
      link.append($createTextNode('Keep this text'))
      paragraph.append(link)
      $getRoot().append(paragraph)
      $sanitizeImportedLinks()
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    editor.getEditorState().read(() => {
      const paragraph = $getRoot().getFirstChild()
      expect(paragraph?.getTextContent()).toBe('Keep this text')
      if ($isElementNode(paragraph)) {
        expect($isLinkNode(paragraph.getFirstChild())).toBe(false)
      }
    })
  })

  describe('sanitizeUrl', () => {
    it.each([
      ['https://example.com', 'https://example.com/'],
      ['mailto:user@example.com', 'mailto:user@example.com'],
    ])('preserves safe URL %s', (input, expected) => {
      expect(sanitizeUrl(input)).toBe(expected)
    })

    it.each([
      'javascript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
    ])('replaces unsafe URL %s', (input) => {
      expect(sanitizeUrl(input)).toBe('about:blank')
    })
  })
})
