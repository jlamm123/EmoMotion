import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toast } = useApp()

  if (!toast) return null

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[toast.type] || 'bg-green-500'

  const icon = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  }[toast.type] || '✓'

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className={`${bgColor} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3`}>
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{toast.message}</span>
      </div>
    </div>
  )
}
