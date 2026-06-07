import type { ReactNode } from 'react'

interface TooltipProps {
  label: string
  children: ReactNode
}

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-[11px] text-gray-200 opacity-0 shadow-lg transition-opacity duration-100 group-hover:opacity-100"
      >
        {label}
      </span>
    </span>
  )
}
