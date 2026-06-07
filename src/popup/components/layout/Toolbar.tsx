import { Plus } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { ClearAll } from '../shared/ClearAll'
import { SearchBar } from '../shared/SearchBar'

const TAB_LABEL: Record<string, string> = {
  cookies: 'Cookies',
  localStorage: 'localStorage',
  sessionStorage: 'sessionStorage',
}

export function Toolbar() {
  const { state, dispatch, cookieOps, localStorageOps, sessionStorageOps } = useAppContext()
  const { showToast } = useToast()

  if (state.activeTab === 'indexedDB') {
    return (
      <div className="flex h-10 items-center gap-2 border-b border-gray-700 px-2">
        <SearchBar />
      </div>
    )
  }

  const ops =
    state.activeTab === 'cookies'
      ? cookieOps
      : state.activeTab === 'localStorage'
        ? localStorageOps
        : sessionStorageOps

  const count =
    state.activeTab === 'cookies'
      ? state.cookies.length
      : state.activeTab === 'localStorage'
        ? state.localStorage.length
        : state.sessionStorage.length

  return (
    <div className="flex h-10 items-center gap-2 border-b border-gray-700 px-2">
      <SearchBar />
      <button
        type="button"
        onClick={() => dispatch({ type: 'SET_ADDING_NEW', addingNew: true })}
        className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500"
      >
        <Plus className="h-3.5 w-3.5" />
        Add
      </button>
      <ClearAll
        onClear={async () => {
          try {
            await ops.clearAll()
            showToast(`Cleared all ${TAB_LABEL[state.activeTab]}`)
          } catch {
            showToast(`Failed to clear ${TAB_LABEL[state.activeTab]}`, 'error')
          }
        }}
        disabled={count === 0}
      />
    </div>
  )
}
