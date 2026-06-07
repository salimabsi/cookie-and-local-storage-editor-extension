import { useAppContext } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { useSearch } from '../../hooks/useSearch'
import type { ChromeCookie, ChromeCookieInput } from '../../types/cookie.types'
import { cookieRowId } from '../../utils/cookie.utils'
import { CookieTable } from './CookieTable'

function getCookieSearchableText(cookie: ChromeCookie): string[] {
  return [cookie.name, cookie.value]
}

const RECENTLY_CHANGED_MS = 30_000

export function CookiePanel() {
  const { state, dispatch, cookieOps } = useAppContext()
  const { showToast } = useToast()
  const { results: cookies, query } = useSearch(state.cookies, state.searchQuery, getCookieSearchableText)

  const handleEdit = (cookie: ChromeCookie) => {
    dispatch({ type: 'SET_EXPANDED_ROW', rowId: cookieRowId(cookie) })
  }

  const handleCancelEdit = () => dispatch({ type: 'SET_EXPANDED_ROW', rowId: null })

  const handleCancelAdd = () => dispatch({ type: 'SET_ADDING_NEW', addingNew: false })

  const handleSave = async (input: ChromeCookieInput, previousName?: string) => {
    try {
      await cookieOps.saveCookie(input, previousName)
      dispatch({ type: 'SET_EXPANDED_ROW', rowId: null })
      dispatch({ type: 'SET_ADDING_NEW', addingNew: false })
      showToast(previousName ? `Cookie "${input.name}" updated` : `Cookie "${input.name}" created`)

      const rowId = cookieRowId(input)
      dispatch({ type: 'MARK_CHANGED', rowId })
      setTimeout(() => dispatch({ type: 'CLEAR_CHANGED', rowId }), RECENTLY_CHANGED_MS)
    } catch {
      showToast(`Failed to save cookie "${input.name}"`, 'error')
    }
  }

  const handleDelete = async (cookie: ChromeCookie) => {
    try {
      await cookieOps.removeCookie(cookie)
      showToast(`Cookie "${cookie.name}" deleted`)
    } catch {
      showToast(`Failed to delete cookie "${cookie.name}"`, 'error')
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <CookieTable
        cookies={cookies}
        domain={state.domain}
        expandedRowId={state.expandedRowId}
        addingNew={state.addingNew}
        searchQuery={query}
        recentlyChanged={state.recentlyChanged}
        onEdit={handleEdit}
        onCancelEdit={handleCancelEdit}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancelAdd={handleCancelAdd}
      />
    </div>
  )
}
