export interface HighlightSegment {
  text: string
  match: boolean
}

export function highlightSubstring(text: string, query: string): HighlightSegment[] {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return [{ text, match: false }]

  const lowerText = text.toLowerCase()
  const lowerQuery = trimmedQuery.toLowerCase()
  const segments: HighlightSegment[] = []

  let cursor = 0
  let index = lowerText.indexOf(lowerQuery, cursor)
  while (index !== -1) {
    if (index > cursor) segments.push({ text: text.slice(cursor, index), match: false })
    segments.push({ text: text.slice(index, index + trimmedQuery.length), match: true })
    cursor = index + trimmedQuery.length
    index = lowerText.indexOf(lowerQuery, cursor)
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), match: false })

  return segments
}
