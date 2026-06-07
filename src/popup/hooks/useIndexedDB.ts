import { useCallback, useEffect, useState } from 'react'
import type { IDBDatabaseInfo } from '../types/indexeddb.types'

interface UseIndexedDBResult {
  databases: IDBDatabaseInfo[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

async function readIndexedDBDatabases(): Promise<IDBDatabaseInfo[]> {
  interface StoreInfo {
    name: string
    keyPath: string | string[] | null
    autoIncrement: boolean
    recordCount: number
  }
  interface DatabaseInfo {
    name: string
    version: number
    stores: StoreInfo[]
  }

  if (!('databases' in indexedDB)) return []

  const infos = await indexedDB.databases()
  const results: DatabaseInfo[] = []

  for (const info of infos) {
    if (!info.name) continue

    const db = await new Promise<IDBDatabase | null>((resolve) => {
      const request = indexedDB.open(info.name as string)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
    })
    if (!db) continue

    const stores: StoreInfo[] = []
    for (const storeName of Array.from(db.objectStoreNames)) {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const recordCount = await new Promise<number>((resolve) => {
        const countRequest = store.count()
        countRequest.onsuccess = () => resolve(countRequest.result)
        countRequest.onerror = () => resolve(0)
      })
      stores.push({
        name: storeName,
        keyPath: store.keyPath as string | string[] | null,
        autoIncrement: store.autoIncrement,
        recordCount,
      })
    }

    results.push({ name: info.name, version: db.version, stores })
    db.close()
  }

  return results
}

export function useIndexedDB(tabId: number | null): UseIndexedDBResult {
  const [databases, setDatabases] = useState<IDBDatabaseInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (tabId == null) {
      setDatabases([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [injection] = await chrome.scripting.executeScript({
        target: { tabId },
        func: readIndexedDBDatabases,
      })
      setDatabases((injection?.result ?? []) as IDBDatabaseInfo[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load IndexedDB databases')
    } finally {
      setLoading(false)
    }
  }, [tabId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { databases, loading, error, refresh }
}
