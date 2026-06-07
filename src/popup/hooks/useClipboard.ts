import { useCallback, useRef, useState } from 'react'

const COPIED_TIMEOUT_MS = 1500

export function useClipboard(): { copied: boolean; copy: (text: string) => void } {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const copy = useCallback((text: string) => {
    void navigator.clipboard.writeText(text)
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), COPIED_TIMEOUT_MS)
  }, [])

  return { copied, copy }
}
