import { useState, type FormEvent, type KeyboardEvent } from 'react'
import type { StorageEntry } from '../../types/storage.types'

interface EditStorageFormProps {
  initial: StorageEntry
  previousKey?: string
  onSave: (key: string, value: string, previousKey?: string) => Promise<void> | void
  onCancel: () => void
}

const fieldClass =
  'rounded border border-gray-600 bg-gray-900 px-2 py-1 font-mono text-xs text-gray-100 focus:border-blue-500 focus:outline-none'

export function EditStorageForm({ initial, previousKey, onSave, onCancel }: EditStorageFormProps) {
  const [key, setKey] = useState(initial.key)
  const [value, setValue] = useState(initial.value)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!key.trim() || saving) return
    setSaving(true)
    try {
      await onSave(key, value, previousKey)
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onCancel()
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void handleSave()
  }

  return (
    <tr className="border-b border-l-2 border-gray-800 border-l-blue-500 bg-gray-800">
      <td colSpan={4} className="p-3">
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <label className="flex flex-1 flex-col gap-1 text-xs text-gray-400">
              Key
              <input autoFocus value={key} onChange={(event) => setKey(event.target.value)} className={fieldClass} />
            </label>
            <label className="flex flex-[2] flex-col gap-1 text-xs text-gray-400">
              Value
              <input value={value} onChange={(event) => setValue(event.target.value)} className={fieldClass} />
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-600 px-3 py-1.5 text-xs text-gray-300 hover:border-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !key.trim()}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </td>
    </tr>
  )
}
