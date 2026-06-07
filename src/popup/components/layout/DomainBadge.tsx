interface DomainBadgeProps {
  domain: string
}

export function DomainBadge({ domain }: DomainBadgeProps) {
  if (!domain) return null

  return (
    <span className="w-fit rounded bg-gray-800 px-2 py-0.5 font-mono text-xs text-gray-400">
      {domain}
    </span>
  )
}
