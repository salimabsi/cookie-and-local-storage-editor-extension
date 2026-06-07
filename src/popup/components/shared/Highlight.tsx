import { highlightSubstring } from '../../utils/highlight.utils'

interface HighlightProps {
  text: string
  query: string
}

export function Highlight({ text, query }: HighlightProps) {
  const segments = highlightSubstring(text, query)

  return (
    <>
      {segments.map((segment, index) =>
        segment.match ? (
          <mark key={index} className="rounded-sm bg-yellow-400/30 text-inherit">
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  )
}
