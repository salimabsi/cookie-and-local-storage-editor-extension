interface TabButtonProps {
  label: string
  count: number
  active: boolean
  onClick: () => void
}

export function TabButton({ label, count, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 border-b-2 px-3 text-xs font-medium transition-colors ${
        active
          ? 'border-blue-500 text-gray-50'
          : 'border-transparent text-gray-400 hover:text-gray-200'
      }`}
    >
      {label} <span className="text-gray-500">({count})</span>
    </button>
  )
}
