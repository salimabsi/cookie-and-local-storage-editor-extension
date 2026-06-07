import { useEffect, useMemo, useState } from 'react'

const DEBOUNCE_MS = 200

interface UseSearchResult<T> {
  results: T[]
  query: string
}

export function useSearch<T>(
  items: T[],
  query: string,
  getSearchableText: (item: T) => string[],
): UseSearchResult<T> {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [query])

  const results = useMemo(() => {
    const trimmed = debouncedQuery.trim().toLowerCase()
    if (!trimmed) return items
    return items.filter((item) =>
      getSearchableText(item).some((text) => text.toLowerCase().includes(trimmed)),
    )
  }, [items, debouncedQuery, getSearchableText])

  return { results, query: debouncedQuery }
}
