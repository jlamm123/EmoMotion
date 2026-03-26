import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toast } = useApp()

  if (!toast) return null

  const styles = {
    success: {
      bg: 'from-[#00ff88] to-[#00d4ff]',
      icon: '✓',
    },
    error: {
      bg: 'from-[#ff4757] to-[#ff6b81]',
      icon: '✕',
    },
    warning: {
      bg: 'from-[#ffd93d] to-[#ffb347]',
      icon: '⚠',
    },
    info: {
      bg: 'from-[#00d4ff] to-[#00ff88]',
      icon: 'ℹ',
    },
  }

  const style = styles[toast.type] || styles.success

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up safe-bottom">
      <div className={`bg-gradient-to-r ${style.bg} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}>
        <span className="text-xl font-bold">{style.icon}</span>
        <span className="font-semibold">{toast.message}</span>
      </div>
    </div>
  )
}
