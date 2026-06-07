import { Database } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { EmptyState } from '../shared/EmptyState'
import { DatabaseList } from './DatabaseList'
import { ObjectStoreViewer } from './ObjectStoreViewer'

export function IndexedDBPanel() {
  const { state } = useAppContext()
  const databases = state.indexedDBDatabases
  const [selectedName, setSelectedName] = useState<string | null>(null)

  useEffect(() => {
    if (databases.length === 0) {
      setSelectedName(null)
    } else if (!databases.some((database) => database.name === selectedName)) {
      setSelectedName(databases[0].name)
    }
  }, [databases, selectedName])

  if (state.loading.indexedDB && databases.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-gray-500">Loading databases…</div>
    )
  }

  if (databases.length === 0) {
    return (
      <EmptyState
        icon={Database}
        title="No IndexedDB databases for this domain"
        description="Databases created via window.indexedDB on this site will appear here."
      />
    )
  }

  const selected = databases.find((database) => database.name === selectedName) ?? null

  return (
    <div className="flex h-full">
      <DatabaseList databases={databases} selectedName={selectedName} onSelect={setSelectedName} />
      <ObjectStoreViewer database={selected} />
    </div>
  )
}
