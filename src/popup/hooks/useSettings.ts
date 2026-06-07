import { useCallback, useEffect, useRef, useState } from 'react'

const POPUP_WIDTH_KEY = 'devstorage:popupWidth'
const PERSIST_DEBOUNCE_MS = 300

export const DEFAULT_POPUP_WIDTH = 600
export const MIN_POPUP_WIDTH = 420
export const MAX_POPUP_WIDTH = 900

export interface UseSettingsResult {
  popupWidth: number
  setPopupWidth: (width: number) => void
  resetPopupWidth: () => void
}

function clampWidth(width: number): number {
  return Math.min(MAX_POPUP_WIDTH, Math.max(MIN_POPUP_WIDTH, Math.round(width)))
}

export function useSettings(): UseSettingsResult {
  const [popupWidth, setPopupWidthState] = useState(DEFAULT_POPUP_WIDTH)
  const persistTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    let cancelled = false

    chrome.storage.local.get(POPUP_WIDTH_KEY).then((result) => {
      if (cancelled) return
      const stored = result[POPUP_WIDTH_KEY]
      if (typeof stored === 'number') setPopupWidthState(clampWidth(stored))
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--popup-width', `${popupWidth}px`)
  }, [popupWidth])

  const persistWidth = useCallback((width: number) => {
    if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current)
    persistTimeoutRef.current = setTimeout(() => {
      void chrome.storage.local.set({ [POPUP_WIDTH_KEY]: width })
    }, PERSIST_DEBOUNCE_MS)
  }, [])

  const setPopupWidth = useCallback(
    (width: number) => {
      const clamped = clampWidth(width)
      setPopupWidthState(clamped)
      persistWidth(clamped)
    },
    [persistWidth],
  )

  const resetPopupWidth = useCallback(() => {
    setPopupWidthState(DEFAULT_POPUP_WIDTH)
    persistWidth(DEFAULT_POPUP_WIDTH)
  }, [persistWidth])

  return { popupWidth, setPopupWidth, resetPopupWidth }
}
