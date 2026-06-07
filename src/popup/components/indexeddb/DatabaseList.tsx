import { Database } from 'lucide-react'
import type { IDBDatabaseInfo } from '../../types/indexeddb.types'

interface DatabaseListProps {
  databases: IDBDatabaseInfo[]
  selectedName: string | null
  onSelect: (name: string) => void
}

export function DatabaseList({ databases, selectedName, onSelect }: DatabaseListProps) {
  return (
    <ul className="w-44 shrink-0 overflow-y-auto border-r border-gray-800">
      {databases.map((database) => (
        <li key={database.name}>
          <button
            type="button"
            onClick={() => onSelect(database.name)}
            className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs ${
              selectedName === database.name
                ? 'bg-gray-800 text-gray-100'
                : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
            }`}
          >
            <Database className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 truncate" title={database.name}>
              {database.name}
            </span>
            <span className="shrink-0 text-[10px] text-gray-500">v{database.version}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
