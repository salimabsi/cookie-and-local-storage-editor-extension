import { Settings, X } from 'lucide-react'
import { DEFAULT_POPUP_WIDTH, MAX_POPUP_WIDTH, MIN_POPUP_WIDTH } from '../../hooks/useSettings'

interface SettingsModalProps {
  popupWidth: number
  onChangeWidth: (width: number) => void
  onResetWidth: () => void
  onClose: () => void
}

export function SettingsModal({ popupWidth, onChangeWidth, onResetWidth, onClose }: SettingsModalProps) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-sm rounded-lg border border-gray-700 bg-gray-900 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-100">
            <Settings className="h-4 w-4 text-gray-400" />
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <label htmlFor="popup-width">Panel width</label>
            <span className="font-mono text-gray-400">{popupWidth}px</span>
          </div>
          <input
            id="popup-width"
            type="range"
            min={MIN_POPUP_WIDTH}
            max={MAX_POPUP_WIDTH}
            step={10}
            value={popupWidth}
            onChange={(event) => onChangeWidth(Number(event.target.value))}
            className="mt-2 w-full accent-blue-500"
          />
          <div className="mt-1 flex items-center justify-between text-[10px] text-gray-500">
            <span>{MIN_POPUP_WIDTH}px</span>
            <span>{MAX_POPUP_WIDTH}px</span>
          </div>
          {popupWidth !== DEFAULT_POPUP_WIDTH && (
            <button
              type="button"
              onClick={onResetWidth}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300 hover:underline"
            >
              Reset to default ({DEFAULT_POPUP_WIDTH}px)
            </button>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
