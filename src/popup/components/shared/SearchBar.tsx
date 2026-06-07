import { Search } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

export function SearchBar() {
  const { state, dispatch } = useAppContext()

  return (
    <div className="flex h-8 flex-1 items-center gap-2 rounded border border-gray-700 bg-gray-900 px-2 text-gray-400 focus-within:border-gray-500">
      <Search className="h-3.5 w-3.5 shrink-0" />
      <input
        type="text"
        data-search-input
        value={state.searchQuery}
        onChange={(event) => dispatch({ type: 'SET_SEARCH_QUERY', query: event.target.value })}
        placeholder="Search…"
        className="w-full bg-transparent text-xs text-gray-100 placeholder:text-gray-500 focus:outline-none"
      />
    </div>
  )
}
