import { Upload, X } from 'lucide-react'
import { useState } from 'react'
import type { ExportData } from '../../utils/export.utils'

interface ImportModalProps {
  onClose: () => void
  onImport: (data: ExportData) => Promise<void>
}

interface ParsedImport {
  data: ExportData
  fileName: string
}

function isExportData(value: unknown): value is ExportData {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.domain === 'string' &&
    Array.isArray(candidate.cookies) &&
    Array.isArray(candidate.localStorage) &&
    Array.isArray(candidate.sessionStorage)
  )
}

export function ImportModal({ onClose, onImport }: ImportModalProps) {
  const [parsed, setParsed] = useState<ParsedImport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)

  const handleFile = async (file: File) => {
    setError(null)
    setParsed(null)
    try {
      const text = await file.text()
      const json: unknown = JSON.parse(text)
      if (!isExportData(json)) throw new Error('File does not match the expected DevStorage export format')
      setParsed({ data: json, fileName: file.name })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file')
    }
  }

  const handleApply = async () => {
    if (!parsed) return
    setImporting(true)
    try {
      await onImport(parsed.data)
      onClose()
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-900 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-100">Import data</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed border-gray-700 px-4 py-6 text-center text-xs text-gray-400 hover:border-gray-500 hover:text-gray-200">
          <Upload className="h-5 w-5" />
          <span className="truncate">{parsed ? parsed.fileName : 'Choose a DevStorage JSON export'}</span>
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void handleFile(file)
            }}
          />
        </label>

        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}

        {parsed && (
          <div className="mt-3 space-y-1 rounded-md border border-gray-700 bg-gray-800 p-3 text-xs text-gray-300">
            <p>
              Domain: <span className="font-mono text-gray-100">{parsed.data.domain}</span>
            </p>
            <p>{parsed.data.cookies.length} cookies</p>
            <p>{parsed.data.localStorage.length} localStorage entries</p>
            <p>{parsed.data.sessionStorage.length} sessionStorage entries</p>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-xs text-gray-400 hover:text-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!parsed || importing}
            onClick={handleApply}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {importing ? 'Importing…' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  )
}
