import type { ChromeCookie } from './cookie.types'
import type { IDBDatabaseInfo } from './indexeddb.types'
import type { StorageEntry } from './storage.types'

export type Tab = 'cookies' | 'localStorage' | 'sessionStorage' | 'indexedDB'

export interface AppState {
  activeTab: Tab
  domain: string
  tabId: number | null
  tabUrl: string | null
  cookies: ChromeCookie[]
  localStorage: StorageEntry[]
  sessionStorage: StorageEntry[]
  indexedDBDatabases: IDBDatabaseInfo[]
  searchQuery: string
  expandedRowId: string | null
  addingNew: boolean
  loading: Record<Tab, boolean>
  error: string | null
  recentlyChanged: Set<string>
}

export type Action =
  | { type: 'SET_ACTIVE_TAB'; tab: Tab }
  | { type: 'SET_TAB_INFO'; tabId: number | null; tabUrl: string | null; domain: string }
  | { type: 'SET_COOKIES'; cookies: ChromeCookie[] }
  | { type: 'SET_LOCAL_STORAGE'; entries: StorageEntry[] }
  | { type: 'SET_SESSION_STORAGE'; entries: StorageEntry[] }
  | { type: 'SET_INDEXEDDB_DATABASES'; databases: IDBDatabaseInfo[] }
  | { type: 'SET_SEARCH_QUERY'; query: string }
  | { type: 'SET_EXPANDED_ROW'; rowId: string | null }
  | { type: 'SET_ADDING_NEW'; addingNew: boolean }
  | { type: 'SET_LOADING'; tab: Tab; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'MARK_CHANGED'; rowId: string }
  | { type: 'CLEAR_CHANGED'; rowId: string }
