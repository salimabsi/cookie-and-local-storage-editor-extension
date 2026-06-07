import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

interface ConfirmInlineProps {
  onEdit: () => void
  onDelete: () => Promise<void> | void
}

const iconButtonClass = 'rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-100'

export function ConfirmInline({ onEdit, onDelete }: ConfirmInlineProps) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (confirming) {
    return (
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded border border-gray-600 px-2 py-0.5 text-[10px] text-gray-300 hover:border-gray-400"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={async () => {
            setDeleting(true)
            try {
              await onDelete()
            } finally {
              setDeleting(false)
              setConfirming(false)
            }
          }}
          className="rounded bg-red-600 px-2 py-0.5 text-[10px] text-white hover:bg-red-500 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button type="button" title="Edit" aria-label="Edit" onClick={onEdit} className={iconButtonClass}>
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        title="Delete"
        aria-label="Delete"
        onClick={() => setConfirming(true)}
        className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-red-400"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
