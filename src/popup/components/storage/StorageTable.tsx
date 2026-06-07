import type { StorageArea, StorageEntry } from '../../types/storage.types'
import { EditStorageForm } from './EditStorageForm'
import { StorageRow } from './StorageRow'

interface StorageTableProps {
  entries: StorageEntry[]
  area: StorageArea
  expandedRowId: string | null
  addingNew: boolean
  onEdit: (entry: StorageEntry) => void
  onCancelEdit: () => void
  onSave: (key: string, value: string, previousKey?: string) => Promise<void> | void
  onDelete: (entry: StorageEntry) => Promise<void> | void
  onCancelAdd: () => void
}

const EMPTY_LABEL: Record<StorageArea, string> = {
  localStorage: 'No localStorage entries for this domain',
  sessionStorage: 'No sessionStorage entries for this domain',
}

const EMPTY_ENTRY: StorageEntry = { key: '', value: '' }

export function StorageTable({
  entries,
  area,
  expandedRowId,
  addingNew,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onCancelAdd,
}: StorageTableProps) {
  if (entries.length === 0 && !addingNew) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-gray-500">
        {EMPTY_LABEL[area]}
      </div>
    )
  }

  return (
    <table className="w-full table-fixed border-collapse text-left">
      <colgroup>
        <col className="w-[200px]" />
        <col />
        <col className="w-14" />
        <col className="w-16" />
      </colgroup>
      <thead>
        <tr className="h-8 border-b border-gray-700 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <th className="px-3">Key</th>
          <th className="px-3">Value</th>
          <th className="px-3">Size</th>
          <th className="px-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {addingNew && <EditStorageForm initial={EMPTY_ENTRY} onSave={onSave} onCancel={onCancelAdd} />}
        {entries.map((entry) => (
          <StorageRow
            key={entry.key}
            entry={entry}
            isExpanded={expandedRowId === entry.key}
            onEdit={() => onEdit(entry)}
            onCancelEdit={onCancelEdit}
            onSave={onSave}
            onDelete={() => onDelete(entry)}
          />
        ))}
      </tbody>
    </table>
  )
}
