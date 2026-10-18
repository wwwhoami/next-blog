import { normalizeAndValidateUrl } from '../utils'

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

const EMAIL_MATCHER =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/

export const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text)
    const url = match?.[0]
    const normalizedUrl = url
      ? normalizeAndValidateUrl(url.startsWith('www.') ? `https://${url}` : url)
      : null

    if (!match || !normalizedUrl?.valid) {
      return null
    }

    return {
      index: match.index,
      length: match[0].length,
      text: match[0],
      url: normalizedUrl.url,
    }
  },
  (text: string) => {
    const match = EMAIL_MATCHER.exec(text)
    return (
      match && {
        index: match.index,
        length: match[0].length,
        text: match[0],
        url: `mailto:${match[0]}`,
      }
    )
  },
]
