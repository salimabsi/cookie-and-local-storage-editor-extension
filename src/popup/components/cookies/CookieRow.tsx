import type { ChromeCookie, ChromeCookieInput } from '../../types/cookie.types'
import { cookieToInput } from '../../utils/cookie.utils'
import { ConfirmInline } from '../shared/ConfirmInline'
import { Highlight } from '../shared/Highlight'
import { ValueCell } from '../shared/ValueCell'
import { CookieFlags } from './CookieFlags'
import { EditCookieForm } from './EditCookieForm'

interface CookieRowProps {
  cookie: ChromeCookie
  isExpanded: boolean
  searchQuery: string
  isRecentlyChanged: boolean
  onEdit: () => void
  onCancelEdit: () => void
  onSave: (input: ChromeCookieInput, previousName?: string) => Promise<void> | void
  onDelete: () => Promise<void> | void
}

function formatExpiry(cookie: ChromeCookie): string {
  if (cookie.session || !cookie.expirationDate) return 'Session'
  return new Date(cookie.expirationDate * 1000).toLocaleDateString()
}

export function CookieRow({
  cookie,
  isExpanded,
  searchQuery,
  isRecentlyChanged,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: CookieRowProps) {
  if (isExpanded) {
    return (
      <EditCookieForm
        initial={cookieToInput(cookie)}
        previousName={cookie.name}
        onSave={onSave}
        onCancel={onCancelEdit}
      />
    )
  }

  return (
    <tr
      className={`h-9 border-b border-gray-800 border-l-2 hover:bg-gray-750 ${
        isRecentlyChanged ? 'animate-flashNew border-l-yellow-400' : 'border-l-transparent'
      }`}
    >

      <td className="truncate px-3 font-mono text-xs text-gray-100" title={cookie.name}>
        <Highlight text={cookie.name} query={searchQuery} />
      </td>
      <td className="px-3">
        <ValueCell value={cookie.value} query={searchQuery} />
      </td>
      <td className="px-3 text-xs text-gray-400">{formatExpiry(cookie)}</td>
      <td className="px-3">
        <CookieFlags secure={cookie.secure} httpOnly={cookie.httpOnly} sameSite={cookie.sameSite} />
      </td>
      <td className="px-3">
        <ConfirmInline onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  )
}
