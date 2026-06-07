import { useClipboard } from '../../hooks/useClipboard'
import { Highlight } from './Highlight'

interface ValueCellProps {
  value: string
  query?: string
  className?: string
}

export function ValueCell({ value, query = '', className = '' }: ValueCellProps) {
  const { copied, copy } = useClipboard()

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      title={copied ? 'Copied!' : value}
      className={`block w-full truncate text-left font-mono text-xs hover:underline ${
        copied ? 'text-green-400' : 'text-gray-400'
      } ${className}`}
    >
      {copied ? 'Copied!' : <Highlight text={value} query={query} />}
    </button>
  )
}
