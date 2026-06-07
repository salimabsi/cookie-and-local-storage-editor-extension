import { createContext, useContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import { useActiveTab } from '../hooks/useActiveTab'
import { useCookies } from '../hooks/useCookies'
import { useStorage } from '../hooks/useStorage'
import type { Action, AppState } from '../types/app.types'

const initialState: AppState = {
  activeTab: 'cookies',
  domain: '',
  tabId: null,
  tabUrl: null,
  cookies: [],
  localStorage: [],
  sessionStorage: [],
  indexedDBDatabases: [],
  searchQuery: '',
  expandedRowId: null,
  addingNew: false,
  loading: { cookies: false, localStorage: false, sessionStorage: false, indexedDB: false },
  error: null,
  recentlyChanged: new Set(),
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.tab, expandedRowId: null, addingNew: false }
    case 'SET_TAB_INFO':
      return { ...state, tabId: action.tabId, tabUrl: action.tabUrl, domain: action.domain }
    case 'SET_COOKIES':
      return { ...state, cookies: action.cookies }
    case 'SET_LOCAL_STORAGE':
      return { ...state, localStorage: action.entries }
    case 'SET_SESSION_STORAGE':
      return { ...state, sessionStorage: action.entries }
    case 'SET_INDEXEDDB_DATABASES':
      return { ...state, indexedDBDatabases: action.databases }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.query }
    case 'SET_EXPANDED_ROW':
      return { ...state, expandedRowId: action.rowId, addingNew: false }
    case 'SET_ADDING_NEW':
      return { ...state, addingNew: action.addingNew, expandedRowId: null }
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.tab]: action.loading } }
    case 'SET_ERROR':
      return { ...state, error: action.error }
    case 'MARK_CHANGED': {
      const recentlyChanged = new Set(state.recentlyChanged)
      recentlyChanged.add(action.rowId)
      return { ...state, recentlyChanged }
    }
    case 'CLEAR_CHANGED': {
      const recentlyChanged = new Set(state.recentlyChanged)
      recentlyChanged.delete(action.rowId)
      return { ...state, recentlyChanged }
    }
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  dispatch: Dispatch<Action>
  cookieOps: ReturnType<typeof useCookies>
  localStorageOps: ReturnType<typeof useStorage>
  sessionStorageOps: ReturnType<typeof useStorage>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const activeTabInfo = useActiveTab()
  const cookieOps = useCookies(activeTabInfo.domain, activeTabInfo.tabUrl)
  const localStorageOps = useStorage(activeTabInfo.tabId, 'localStorage')
  const sessionStorageOps = useStorage(activeTabInfo.tabId, 'sessionStorage')

  useEffect(() => {
    dispatch({ type: 'SET_TAB_INFO', ...activeTabInfo })
  }, [activeTabInfo])

  useEffect(() => {
    dispatch({ type: 'SET_COOKIES', cookies: cookieOps.cookies })
  }, [cookieOps.cookies])

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', tab: 'cookies', loading: cookieOps.loading })
  }, [cookieOps.loading])

  useEffect(() => {
    dispatch({ type: 'SET_LOCAL_STORAGE', entries: localStorageOps.entries })
  }, [localStorageOps.entries])

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', tab: 'localStorage', loading: localStorageOps.loading })
  }, [localStorageOps.loading])

  useEffect(() => {
    dispatch({ type: 'SET_SESSION_STORAGE', entries: sessionStorageOps.entries })
  }, [sessionStorageOps.entries])

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', tab: 'sessionStorage', loading: sessionStorageOps.loading })
  }, [sessionStorageOps.loading])

  useEffect(() => {
    const error = cookieOps.error ?? localStorageOps.error ?? sessionStorageOps.error
    dispatch({ type: 'SET_ERROR', error })
  }, [cookieOps.error, localStorageOps.error, sessionStorageOps.error])

  const value: AppContextValue = { state, dispatch, cookieOps, localStorageOps, sessionStorageOps }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within an AppProvider')
  return context
}
