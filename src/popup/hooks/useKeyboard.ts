import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import type { Tab } from '../types/app.types'

const TAB_BY_DIGIT: Record<string, Tab> = {
  '1': 'cookies',
  '2': 'localStorage',
  '3': 'sessionStorage',
  '4': 'indexedDB',
}

interface UseKeyboardOptions {
  onExport?: () => void
}

export function useKeyboard({ onExport }: UseKeyboardOptions = {}) {
  const { state, dispatch } = useAppContext()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey
      const target = event.target as HTMLElement | null
      const isEditable = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA'

      if (mod && event.key.toLowerCase() === 'f') {
        event.preventDefault()
        document.querySelector<HTMLInputElement>('[data-search-input]')?.focus()
        return
      }

      if (mod && event.key.toLowerCase() === 'n') {
        event.preventDefault()
        dispatch({ type: 'SET_ADDING_NEW', addingNew: true })
        return
      }

      if (mod && event.key.toLowerCase() === 'e') {
        event.preventDefault()
        onExport?.()
        return
      }

      if (event.key === 'Escape') {
        if (state.expandedRowId !== null) {
          dispatch({ type: 'SET_EXPANDED_ROW', rowId: null })
        } else if (state.addingNew) {
          dispatch({ type: 'SET_ADDING_NEW', addingNew: false })
        } else if (state.searchQuery) {
          dispatch({ type: 'SET_SEARCH_QUERY', query: '' })
        }
        return
      }

      if (!mod && !isEditable && event.key in TAB_BY_DIGIT) {
        dispatch({ type: 'SET_ACTIVE_TAB', tab: TAB_BY_DIGIT[event.key] })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dispatch, state.expandedRowId, state.addingNew, state.searchQuery, onExport])
}
