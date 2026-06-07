import { useAppContext } from '../../context/AppContext'
import type { ChromeCookie, ChromeCookieInput } from '../../types/cookie.types'
import { cookieRowId } from '../../utils/cookie.utils'
import { CookieTable } from './CookieTable'

export function CookiePanel() {
  const { state, dispatch, cookieOps } = useAppContext()

  const handleEdit = (cookie: ChromeCookie) => {
    dispatch({ type: 'SET_EXPANDED_ROW', rowId: cookieRowId(cookie) })
  }

  const handleCancelEdit = () => dispatch({ type: 'SET_EXPANDED_ROW', rowId: null })

  const handleCancelAdd = () => dispatch({ type: 'SET_ADDING_NEW', addingNew: false })

  const handleSave = async (input: ChromeCookieInput, previousName?: string) => {
    await cookieOps.saveCookie(input, previousName)
    dispatch({ type: 'SET_EXPANDED_ROW', rowId: null })
    dispatch({ type: 'SET_ADDING_NEW', addingNew: false })
  }

  const handleDelete = async (cookie: ChromeCookie) => {
    await cookieOps.removeCookie(cookie)
  }

  return (
    <div className="h-full overflow-y-auto">
      <CookieTable
        cookies={state.cookies}
        domain={state.domain}
        expandedRowId={state.expandedRowId}
        addingNew={state.addingNew}
        onEdit={handleEdit}
        onCancelEdit={handleCancelEdit}
        onSave={handleSave}
        onDelete={handleDelete}
        onCancelAdd={handleCancelAdd}
      />
    </div>
  )
}
