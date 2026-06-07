import type { ChromeCookie, ChromeCookieInput } from '../../types/cookie.types'
import { cookieRowId, emptyCookieInput } from '../../utils/cookie.utils'
import { CookieRow } from './CookieRow'
import { EditCookieForm } from './EditCookieForm'

interface CookieTableProps {
  cookies: ChromeCookie[]
  domain: string
  expandedRowId: string | null
  addingNew: boolean
  onEdit: (cookie: ChromeCookie) => void
  onCancelEdit: () => void
  onSave: (input: ChromeCookieInput, previousName?: string) => Promise<void> | void
  onDelete: (cookie: ChromeCookie) => Promise<void> | void
  onCancelAdd: () => void
}

export function CookieTable({
  cookies,
  domain,
  expandedRowId,
  addingNew,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onCancelAdd,
}: CookieTableProps) {
  if (cookies.length === 0 && !addingNew) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-gray-500">
        No cookies for this domain
      </div>
    )
  }

  return (
    <table className="w-full table-fixed border-collapse text-left">
      <colgroup>
        <col className="w-40" />
        <col />
        <col className="w-[90px]" />
        <col className="w-[60px]" />
        <col className="w-16" />
      </colgroup>
      <thead>
        <tr className="h-8 border-b border-gray-700 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <th className="px-3">Name</th>
          <th className="px-3">Value</th>
          <th className="px-3">Expires</th>
          <th className="px-3">Flags</th>
          <th className="px-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {addingNew && (
          <EditCookieForm initial={emptyCookieInput(domain)} onSave={onSave} onCancel={onCancelAdd} />
        )}
        {cookies.map((cookie) => {
          const rowId = cookieRowId(cookie)
          return (
            <CookieRow
              key={rowId}
              cookie={cookie}
              isExpanded={expandedRowId === rowId}
              onEdit={() => onEdit(cookie)}
              onCancelEdit={onCancelEdit}
              onSave={onSave}
              onDelete={() => onDelete(cookie)}
            />
          )
        })}
      </tbody>
    </table>
  )
}
