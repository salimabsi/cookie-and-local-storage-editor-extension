import { CheckCircle2, XCircle } from 'lucide-react'
import type { ToastItem } from '../../context/ToastContext'

interface ToastProps {
  toast: ToastItem
  onDismiss: () => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const Icon = toast.variant === 'success' ? CheckCircle2 : XCircle
  const accent = toast.variant === 'success' ? 'text-green-500' : 'text-red-500'

  return (
    <div
      role="status"
      onClick={onDismiss}
      className="flex max-w-sm cursor-pointer items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-xs text-gray-100 shadow-lg"
    >
      <Icon className={`h-4 w-4 shrink-0 ${accent}`} />
      <span className="truncate">{toast.message}</span>
    </div>
  )
}
