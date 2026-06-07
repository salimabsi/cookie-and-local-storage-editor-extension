import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  title?: string
}

export function Badge({ children, title }: BadgeProps) {
  return (
    <span
      title={title}
      className="inline-flex h-4 items-center justify-center rounded bg-gray-800 px-1 text-[10px] font-bold uppercase text-gray-400"
    >
      {children}
    </span>
  )
}
