import { useState, type FormEvent, type KeyboardEvent } from 'react'
import type { ChromeCookieInput, SameSite } from '../../types/cookie.types'

interface EditCookieFormProps {
  initial: ChromeCookieInput
  previousName?: string
  onSave: (input: ChromeCookieInput, previousName?: string) => Promise<void> | void
  onCancel: () => void
}

const SAME_SITE_OPTIONS: { value: SameSite; label: string }[] = [
  { value: 'lax', label: 'Lax' },
  { value: 'strict', label: 'Strict' },
  { value: 'no_restriction', label: 'None' },
  { value: 'unspecified', label: 'Unspecified' },
]

const fieldClass =
  'rounded border border-gray-600 bg-gray-900 px-2 py-1 font-mono text-xs text-gray-100 focus:border-blue-500 focus:outline-none'

function toDateInputValue(expirationDate?: number): string {
  if (!expirationDate) return ''
  return new Date(expirationDate * 1000).toISOString().slice(0, 10)
}

function fromDateInputValue(value: string): number | undefined {
  if (!value) return undefined
  return Math.floor(new Date(value).getTime() / 1000)
}

export function EditCookieForm({ initial, previousName, onSave, onCancel }: EditCookieFormProps) {
  const [form, setForm] = useState<ChromeCookieInput>(initial)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!form.name.trim() || saving) return
    setSaving(true)
    try {
      await onSave(form, previousName)
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
      <td colSpan={5} className="p-3">
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <label className="flex flex-1 flex-col gap-1 text-xs text-gray-400">
              Name
              <input
                autoFocus
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="flex flex-[2] flex-col gap-1 text-xs text-gray-400">
              Value
              <input
                value={form.value}
                onChange={(event) => setForm({ ...form, value: event.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs text-gray-400">
              Domain
              <input
                value={form.domain}
                onChange={(event) => setForm({ ...form, domain: event.target.value })}
                className={fieldClass}
              />
            </label>
          </div>
          <div className="flex items-end gap-2">
            <label className="flex w-24 flex-col gap-1 text-xs text-gray-400">
              Path
              <input
                value={form.path}
                onChange={(event) => setForm({ ...form, path: event.target.value })}
                className={fieldClass}
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs text-gray-400">
              Expires
              <input
                type="date"
                value={toDateInputValue(form.expirationDate)}
                onChange={(event) =>
                  setForm({ ...form, expirationDate: fromDateInputValue(event.target.value) })
                }
                className={fieldClass}
              />
            </label>
            <label className="flex items-center gap-1 text-xs text-gray-300">
              <input
                type="checkbox"
                checked={form.secure}
                onChange={(event) => setForm({ ...form, secure: event.target.checked })}
              />
              Secure
            </label>
            <label className="flex items-center gap-1 text-xs text-gray-300">
              <input
                type="checkbox"
                checked={form.httpOnly}
                onChange={(event) => setForm({ ...form, httpOnly: event.target.checked })}
              />
              HttpOnly
            </label>
            <label className="flex flex-col gap-1 text-xs text-gray-400">
              SameSite
              <select
                value={form.sameSite}
                onChange={(event) => setForm({ ...form, sameSite: event.target.value as SameSite })}
                className={fieldClass}
              >
                {SAME_SITE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
              disabled={saving || !form.name.trim()}
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
