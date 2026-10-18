import { describe, expect, it } from 'vitest'
import { MATCHERS } from './AutoLinkMatchers'

describe('auto-link matchers', () => {
  it('normalizes web URLs', () => {
    expect(MATCHERS[0]('Read www.example.com today')).toEqual({
      index: 5,
      length: 15,
      text: 'www.example.com',
      url: 'https://www.example.com/',
    })
  })

  it('keeps mailto auto-links supported', () => {
    expect(MATCHERS[1]('Contact user@example.com')).toEqual({
      index: 8,
      length: 16,
      text: 'user@example.com',
      url: 'mailto:user@example.com',
    })
  })
})
