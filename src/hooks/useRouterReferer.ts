import { useRouter } from 'next/router'
import { useCallback } from 'react'

export default function useRouterReferer() {
  const router = useRouter()

  const referer = router.asPath.replaceAll('&', '|')

  const backToReferer = useCallback(() => {
    router.push(
      router.query.referer?.toString().replaceAll('|', '&') || '/',
      undefined,
      {
        shallow: true,
      }
    )
  }, [router])

  return { referer, backToReferer }
}
