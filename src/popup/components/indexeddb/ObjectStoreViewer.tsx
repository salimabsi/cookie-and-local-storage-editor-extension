import type { IDBDatabaseInfo } from '../../types/indexeddb.types'

interface ObjectStoreViewerProps {
  database: IDBDatabaseInfo | null
}

function formatKeyPath(keyPath: string | string[] | null): string {
  if (keyPath === null) return '—'
  return Array.isArray(keyPath) ? keyPath.join(', ') : keyPath
}

export function ObjectStoreViewer({ database }: ObjectStoreViewerProps) {
  if (!database) {
    return (
      <div className="flex flex-1 items-center justify-center text-xs text-gray-500">
        Select a database to view its object stores
      </div>
    )
  }

  if (database.stores.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-xs text-gray-500">
        &quot;{database.name}&quot; has no object stores
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full table-fixed border-collapse text-left">
        <colgroup>
          <col className="w-40" />
          <col />
          <col className="w-[144px]" />
          <col className="w-[90px]" />
        </colgroup>
        <thead>
          <tr className="h-8 border-b border-gray-700 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <th className="truncate px-3">Object store</th>
            <th className="truncate px-3">Key path</th>
            <th className="truncate px-3">Auto increment</th>
            <th className="truncate px-3">Records</th>
          </tr>
        </thead>
        <tbody>
          {database.stores.map((store) => (
            <tr key={store.name} className="h-9 border-b border-gray-800 hover:bg-gray-750">
              <td className="truncate px-3 font-mono text-xs text-gray-100" title={store.name}>
                {store.name}
              </td>
              <td className="truncate px-3 font-mono text-xs text-gray-400" title={formatKeyPath(store.keyPath)}>
                {formatKeyPath(store.keyPath)}
              </td>
              <td className="px-3 text-xs text-gray-400">{store.autoIncrement ? 'Yes' : 'No'}</td>
              <td className="px-3 text-xs text-gray-400">{store.recordCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
