import { Cookie, Download, Settings, Upload } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { DomainBadge } from './DomainBadge'

interface HeaderProps {
  onExport: () => void
  onImport: () => void
}

export function Header({ onExport, onImport }: HeaderProps) {
  const { state } = useAppContext()

  return (
    <header className="flex h-14 flex-col justify-center gap-1 border-b border-gray-700 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cookie className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-semibold text-gray-50">DevStorage</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Export"
            aria-label="Export"
            onClick={onExport}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-100"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Import"
            aria-label="Import"
            onClick={onImport}
            className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-100"
          >
            <Upload className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Settings"
            aria-label="Settings"
            className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-100"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
      <DomainBadge domain={state.domain} />
    </header>
  )
}
