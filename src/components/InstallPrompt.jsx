import { useApp } from '../context/AppContext'

export default function InstallPrompt() {
  const { showInstallPrompt, installPWA, dismissInstallPrompt, vibrate } = useApp()

  if (!showInstallPrompt) return null

  const handleInstall = async () => {
    vibrate(50)
    await installPWA()
  }

  const handleDismiss = () => {
    vibrate(30)
    dismissInstallPrompt()
  }

  return (
    <div className="install-prompt animate-slide-up">
      <div className="glass-card p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#ff4757] to-[#ff6b81] rounded-xl flex items-center justify-center shrink-0">
          <span className="text-white font-black text-lg">E</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold">Install EmoMotion</p>
          <p className="text-sm text-[#9ca3af] truncate">Add to home screen for the best experience</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-sm text-[#9ca3af] hover:text-white transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-gradient-to-r from-[#ff4757] to-[#ff6b81] rounded-xl text-sm font-semibold btn-press"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
