import type { StorageEntry } from '../../types/storage.types'
import { byteSize } from '../../utils/storage.utils'
import { ConfirmInline } from '../shared/ConfirmInline'
import { EditStorageForm } from './EditStorageForm'

interface StorageRowProps {
  entry: StorageEntry
  isExpanded: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onSave: (key: string, value: string, previousKey?: string) => Promise<void> | void
  onDelete: () => Promise<void> | void
}

export function StorageRow({ entry, isExpanded, onEdit, onCancelEdit, onSave, onDelete }: StorageRowProps) {
  if (isExpanded) {
    return (
      <EditStorageForm initial={entry} previousKey={entry.key} onSave={onSave} onCancel={onCancelEdit} />
    )
  }

  return (
    <tr className="h-9 border-b border-gray-800 hover:bg-gray-750">
      <td className="truncate px-3 font-mono text-xs text-gray-100" title={entry.key}>
        {entry.key}
      </td>
      <td className="truncate px-3 font-mono text-xs text-gray-400" title={entry.value}>
        {entry.value}
      </td>
      <td className="px-3 text-xs text-gray-400">{byteSize(entry.value)} B</td>
      <td className="px-3">
        <ConfirmInline onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  )
}
