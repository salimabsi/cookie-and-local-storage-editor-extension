import { createPortal } from 'react-dom'
import { useToast } from '../../context/ToastContext'
import { Toast } from './Toast'

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return createPortal(
    <div className="pointer-events-none absolute inset-x-0 bottom-8 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onDismiss={() => dismissToast(toast.id)} />
        </div>
      ))}
    </div>,
    document.body,
  )
}
