import { useAppContext } from '../../context/AppContext'
import type { Tab } from '../../types/app.types'
import { TabButton } from './TabButton'

const TABS: { id: Tab; label: string }[] = [
  { id: 'cookies', label: 'Cookies' },
  { id: 'localStorage', label: 'Local Storage' },
  { id: 'sessionStorage', label: 'Session' },
  { id: 'indexedDB', label: 'IDB' },
]

export function TabBar() {
  const { state, dispatch } = useAppContext()

  const counts: Record<Tab, number> = {
    cookies: state.cookies.length,
    localStorage: state.localStorage.length,
    sessionStorage: state.sessionStorage.length,
    indexedDB: state.indexedDBDatabases.length,
  }

  return (
    <nav className="flex h-10 border-b border-gray-700 px-2">
      {TABS.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          count={counts[tab.id]}
          active={state.activeTab === tab.id}
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', tab: tab.id })}
        />
      ))}
    </nav>
  )
}
