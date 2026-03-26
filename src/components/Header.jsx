import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, vibrate } = useApp()

  const isCoachRoute = location.pathname.startsWith('/coach')
  const isLoginPage = location.pathname === '/login' || location.pathname === '/'

  const handleLogout = () => {
    vibrate(50)
    logout()
    navigate('/login')
  }

  return (
    <header className="glass-card border-0 border-b border-white/10 safe-top sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          to={isAuthenticated ? (user?.type === 'coach' ? '/coach' : '/athlete') : '/login'}
          className="flex items-center gap-3 btn-press"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff4757] to-[#ff6b81] rounded-xl flex items-center justify-center shadow-lg shadow-[#ff4757]/20">
            <span className="text-white font-black text-lg">E</span>
          </div>
          <span className="font-display text-2xl tracking-wide hidden sm:block">EMOMOTION</span>
        </Link>

        {isAuthenticated && !isLoginPage && (
          <div className="flex items-center gap-3">
            {/* Navigation for coach */}
            {user?.type === 'coach' && (
              <nav className="hidden sm:flex gap-1 glass-card p-1 rounded-xl">
                <Link
                  to="/athlete"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all btn-press ${
                    !isCoachRoute
                      ? 'bg-gradient-to-r from-[#ff4757] to-[#ff6b81] text-white'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  Athlete
                </Link>
                <Link
                  to="/coach"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all btn-press ${
                    isCoachRoute
                      ? 'bg-gradient-to-r from-[#ff4757] to-[#ff6b81] text-white'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  Coach
                </Link>
              </nav>
            )}

            {/* User avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1a24] to-[#12121a] border border-white/10 flex items-center justify-center text-sm font-semibold text-[#9ca3af]">
              {user?.type === 'coach' ? '📋' : user?.avatar}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl glass-card transition-colors btn-press"
              title="Logout"
            >
              <svg className="w-5 h-5 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
