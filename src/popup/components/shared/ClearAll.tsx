import { useEffect, useRef, useState } from 'react'

interface ClearAllProps {
  onClear: () => Promise<void> | void
  disabled?: boolean
}

const CONFIRM_TIMEOUT_MS = 3000

export function ClearAll({ onClear, disabled }: ClearAllProps) {
  const [confirming, setConfirming] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleClick = async () => {
    if (!confirming) {
      setConfirming(true)
      timeoutRef.current = setTimeout(() => setConfirming(false), CONFIRM_TIMEOUT_MS)
      return
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setConfirming(false)
    await onClear()
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        confirming
          ? 'bg-red-600 text-white hover:bg-red-500'
          : 'border border-gray-600 text-gray-300 hover:border-gray-400'
      }`}
    >
      {confirming ? 'Confirm Clear' : 'Clear All'}
    </button>
  )
}
