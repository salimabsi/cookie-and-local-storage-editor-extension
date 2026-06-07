import { useCallback, useEffect, useState } from 'react'
import type { ChromeCookie, ChromeCookieInput } from '../types/cookie.types'
import { buildCookieUrl } from '../utils/cookie.utils'

interface UseCookiesResult {
  cookies: ChromeCookie[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  saveCookie: (input: ChromeCookieInput, previousName?: string) => Promise<void>
  removeCookie: (cookie: Pick<ChromeCookie, 'name' | 'domain' | 'path' | 'storeId'>) => Promise<void>
  clearAll: () => Promise<void>
}

export function useCookies(domain: string, tabUrl: string | null): UseCookiesResult {
  const [cookies, setCookies] = useState<ChromeCookie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!domain) {
      setCookies([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const all = await chrome.cookies.getAll({ domain })
      setCookies(all as ChromeCookie[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cookies')
    } finally {
      setLoading(false)
    }
  }, [domain])

  useEffect(() => {
    refresh()
  }, [refresh])

  const removeCookie = useCallback(
    async (cookie: Pick<ChromeCookie, 'name' | 'domain' | 'path' | 'storeId'>) => {
      const url = buildCookieUrl(cookie.domain, cookie.path, true)
      await chrome.cookies.remove({ url, name: cookie.name, storeId: cookie.storeId })
      await refresh()
    },
    [refresh],
  )

  const saveCookie = useCallback(
    async (input: ChromeCookieInput, previousName?: string) => {
      const url = tabUrl ?? buildCookieUrl(input.domain, input.path, input.secure)

      if (previousName && previousName !== input.name) {
        await chrome.cookies.remove({ url, name: previousName })
      }

      await chrome.cookies.set({
        url,
        name: input.name,
        value: input.value,
        domain: input.domain,
        path: input.path,
        secure: input.secure,
        httpOnly: input.httpOnly,
        sameSite: input.sameSite,
        expirationDate: input.expirationDate,
      })
      await refresh()
    },
    [refresh, tabUrl],
  )

  const clearAll = useCallback(async () => {
    await Promise.all(
      cookies.map((cookie) =>
        chrome.cookies.remove({
          url: buildCookieUrl(cookie.domain, cookie.path, true),
          name: cookie.name,
          storeId: cookie.storeId,
        }),
      ),
    )
    await refresh()
  }, [cookies, refresh])

  return { cookies, loading, error, refresh, saveCookie, removeCookie, clearAll }
}
