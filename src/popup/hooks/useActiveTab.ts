import { useEffect, useState } from 'react'

export interface ActiveTabInfo {
  tabId: number | null
  tabUrl: string | null
  domain: string
}

const EMPTY: ActiveTabInfo = { tabId: null, tabUrl: null, domain: '' }

export function useActiveTab(): ActiveTabInfo {
  const [info, setInfo] = useState<ActiveTabInfo>(EMPTY)

  useEffect(() => {
    let cancelled = false

    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (cancelled || !tab?.url) return

      let domain = ''
      try {
        domain = new URL(tab.url).hostname
      } catch {
        domain = ''
      }

      setInfo({ tabId: tab.id ?? null, tabUrl: tab.url, domain })
    })

    return () => {
      cancelled = true
    }
  }, [])

  return info
}
