import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
      <Icon className="h-8 w-8 text-gray-700" />
      <p className="text-xs font-medium text-gray-400">{title}</p>
      {description && <p className="max-w-[240px] text-[11px] text-gray-600">{description}</p>}
    </div>
  )
}
