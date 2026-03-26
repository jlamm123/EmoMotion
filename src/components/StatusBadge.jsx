const statusConfig = {
  green: {
    bg: 'bg-[#00ff88]/20',
    text: 'text-[#00ff88]',
    border: 'border-[#00ff88]/30',
    dot: 'bg-[#00ff88]',
    label: 'Good'
  },
  yellow: {
    bg: 'bg-[#ffd93d]/20',
    text: 'text-[#ffd93d]',
    border: 'border-[#ffd93d]/30',
    dot: 'bg-[#ffd93d]',
    label: 'Monitor'
  },
  red: {
    bg: 'bg-[#ff4757]/20',
    text: 'text-[#ff4757]',
    border: 'border-[#ff4757]/30',
    dot: 'bg-[#ff4757]',
    label: 'Alert'
  },
  none: {
    bg: 'bg-[#1a1a24]',
    text: 'text-[#6b7280]',
    border: 'border-[#1a1a24]',
    dot: 'bg-[#6b7280]',
    label: 'Pending'
  }
}

export default function StatusBadge({ status, showLabel = true, size = 'md' }) {
  const config = statusConfig[status] || statusConfig.none

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {showLabel && config.label}
    </span>
  )
}
