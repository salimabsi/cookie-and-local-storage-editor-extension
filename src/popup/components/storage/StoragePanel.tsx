import { useAppContext } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { useSearch } from '../../hooks/useSearch'
import type { StorageArea, StorageEntry } from '../../types/storage.types'
import { StorageTable } from './StorageTable'

interface StoragePanelProps {
  area: StorageArea
}

function getEntrySearchableText(entry: StorageEntry): string[] {
  return [entry.key, entry.value]
}

const RECENTLY_CHANGED_MS = 30_000

export function StoragePanel({ area }: StoragePanelProps) {
  const { state, dispatch, localStorageOps, sessionStorageOps } = useAppContext()
  const { showToast } = useToast()
  const ops = area === 'localStorage' ? localStorageOps : sessionStorageOps
  const allEntries = area === 'localStorage' ? state.localStorage : state.sessionStorage
  const { results: entries, query } = useSearch(allEntries, state.searchQuery, getEntrySearchableText)

  const handleEdit = (entry: StorageEntry) => {
    dispatch({ type: 'SET_EXPANDED_ROW', rowId: entry.key })
  }

  const handleCancelEdit = () => dispatch({ type: 'SET_EXPANDED_ROW', rowId: null })

  const handleCancelAdd = () => dispatch({ type: 'SET_ADDING_NEW', addingNew: false })

  const handleSave = async (key: string, value: string, previousKey?: string) => {
    try {
      await ops.saveEntry(key, value, previousKey)
      dispatch({ type: 'SET_EXPANDED_ROW', rowId: null })
      dispatch({ type: 'SET_ADDING_NEW', addingNew: false })
      showToast(previousKey ? `Entry "${key}" updated` : `Entry "${key}" created`)

      dispatch({ type: 'MARK_CHANGED', rowId: key })
      setTimeout(() => dispatch({ type: 'CLEAR_CHANGED', rowId: key }), RECENTLY_CHANGED_MS)
    } catch {
      showToast(`Failed to save entry "${key}"`, 'error')
    }
  }

  const handleDelete = async (entry: StorageEntry) => {
    try {
      await ops.removeEntry(entry.key)
      showToast(`Entry "${entry.key}" deleted`)
    } catch {
      showToast(`Failed to delete entry "${entry.key}"`, 'error')
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <StorageTable
        entries={entries}
        area={area}
        expandedRowId={state.expandedRowId}
        addingNew={state.addingNew}
        searchQuery={query}
        recentlyChanged={state.recentlyChanged}
        onEdit={handleEdit}
        onCancelEdit={handleCancelEdit}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancelAdd={handleCancelAdd}
      />
    </div>
  )
}
