import { useAppContext } from '../../context/AppContext'
import type { Tab } from '../../types/app.types'

const LABELS: Record<Tab, string> = {
  cookies: 'cookie',
  localStorage: 'entry',
  sessionStorage: 'entry',
  indexedDB: 'database',
}

function pluralize(word: string, count: number): string {
  if (count === 1) return word
  return word.endsWith('y') ? `${word.slice(0, -1)}ies` : `${word}s`
}

export function StatusBar() {
  const { state } = useAppContext()

  const counts: Record<Tab, number> = {
    cookies: state.cookies.length,
    localStorage: state.localStorage.length,
    sessionStorage: state.sessionStorage.length,
    indexedDB: state.indexedDBDatabases.length,
  }

  const count = counts[state.activeTab]
  const label = pluralize(LABELS[state.activeTab], count)

  return (
    <footer className="flex h-6 items-center border-t border-gray-700 px-4 text-xs text-gray-400">
      {count} {label}
    </footer>
  )
}
