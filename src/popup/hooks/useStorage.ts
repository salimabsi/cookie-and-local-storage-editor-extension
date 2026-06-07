import { useCallback, useEffect, useState } from 'react'
import type { StorageArea, StorageEntry } from '../types/storage.types'

interface UseStorageResult {
  entries: StorageEntry[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  saveEntry: (key: string, value: string, previousKey?: string) => Promise<void>
  removeEntry: (key: string) => Promise<void>
  clearAll: () => Promise<void>
}

function readEntries(area: StorageArea): [string, string][] {
  return Object.entries(window[area])
}

function writeEntry(area: StorageArea, key: string, value: string): void {
  window[area].setItem(key, value)
}

function removeEntryFromStorage(area: StorageArea, key: string): void {
  window[area].removeItem(key)
}

function clearStorage(area: StorageArea): void {
  window[area].clear()
}

export function useStorage(tabId: number | null, area: StorageArea): UseStorageResult {
  const [entries, setEntries] = useState<StorageEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (tabId == null) {
      setEntries([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [injection] = await chrome.scripting.executeScript({
        target: { tabId },
        func: readEntries,
        args: [area],
      })
      const pairs = (injection?.result ?? []) as [string, string][]
      setEntries(pairs.map(([key, value]) => ({ key, value })))
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load ${area}`)
    } finally {
      setLoading(false)
    }
  }, [area, tabId])

  useEffect(() => {
    refresh()
  }, [refresh])

  const saveEntry = useCallback(
    async (key: string, value: string, previousKey?: string) => {
      if (tabId == null) return
      if (previousKey && previousKey !== key) {
        await chrome.scripting.executeScript({
          target: { tabId },
          func: removeEntryFromStorage,
          args: [area, previousKey],
        })
      }
      await chrome.scripting.executeScript({
        target: { tabId },
        func: writeEntry,
        args: [area, key, value],
      })
      await refresh()
    },
    [area, refresh, tabId],
  )

  const removeEntry = useCallback(
    async (key: string) => {
      if (tabId == null) return
      await chrome.scripting.executeScript({
        target: { tabId },
        func: removeEntryFromStorage,
        args: [area, key],
      })
      await refresh()
    },
    [area, refresh, tabId],
  )

  const clearAll = useCallback(async () => {
    if (tabId == null) return
    await chrome.scripting.executeScript({
      target: { tabId },
      func: clearStorage,
      args: [area],
    })
    await refresh()
  }, [area, refresh, tabId])

  return { entries, loading, error, refresh, saveEntry, removeEntry, clearAll }
}
