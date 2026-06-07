import { useAppContext } from '../../context/AppContext'
import type { StorageArea, StorageEntry } from '../../types/storage.types'
import { StorageTable } from './StorageTable'

interface StoragePanelProps {
  area: StorageArea
}

export function StoragePanel({ area }: StoragePanelProps) {
  const { state, dispatch, localStorageOps, sessionStorageOps } = useAppContext()
  const ops = area === 'localStorage' ? localStorageOps : sessionStorageOps
  const entries = area === 'localStorage' ? state.localStorage : state.sessionStorage

  const handleEdit = (entry: StorageEntry) => {
    dispatch({ type: 'SET_EXPANDED_ROW', rowId: entry.key })
  }

  const handleCancelEdit = () => dispatch({ type: 'SET_EXPANDED_ROW', rowId: null })

  const handleCancelAdd = () => dispatch({ type: 'SET_ADDING_NEW', addingNew: false })

  const handleSave = async (key: string, value: string, previousKey?: string) => {
    await ops.saveEntry(key, value, previousKey)
    dispatch({ type: 'SET_EXPANDED_ROW', rowId: null })
    dispatch({ type: 'SET_ADDING_NEW', addingNew: false })
  }

  const handleDelete = async (entry: StorageEntry) => {
    await ops.removeEntry(entry.key)
  }

  return (
    <div className="h-full overflow-y-auto">
      <StorageTable
        entries={entries}
        area={area}
        expandedRowId={state.expandedRowId}
        addingNew={state.addingNew}
        onEdit={handleEdit}
        onCancelEdit={handleCancelEdit}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancelAdd={handleCancelAdd}
      />
    </div>
  )
}
