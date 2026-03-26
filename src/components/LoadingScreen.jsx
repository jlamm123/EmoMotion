export default function LoadingScreen({ progress = 0, message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center z-[200]">
      {/* Logo */}
      <div className="w-24 h-24 bg-gradient-to-br from-[#ff4757] to-[#ff6b81] rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-[#ff4757]/30 animate-pulse-glow">
        <span className="text-5xl font-black text-white">E</span>
      </div>

      {/* App name */}
      <h1 className="font-display text-4xl mb-8 tracking-wide">EMOMOTION</h1>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-[#1a1a24] rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-[#ff4757] to-[#ff6b81] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Message */}
      <p className="text-[#9ca3af] text-sm">{message}</p>
    </div>
  )
}
