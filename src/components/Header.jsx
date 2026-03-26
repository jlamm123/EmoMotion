import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useApp()

  const isCoachRoute = location.pathname.startsWith('/coach')
  const isLoginPage = location.pathname === '/login' || location.pathname === '/'

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-[#1a1a1a] border-b border-[#252525]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to={isAuthenticated ? (user?.type === 'coach' ? '/coach' : '/athlete') : '/login'} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#ff5c5c] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-xl font-bold text-white">EmoMotion</span>
        </Link>

        {isAuthenticated && !isLoginPage && (
          <div className="flex items-center gap-4">
            {/* Navigation (only show for coach) */}
            {user?.type === 'coach' && (
              <nav className="hidden sm:flex gap-1">
                <Link
                  to="/athlete"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !isCoachRoute
                      ? 'bg-[#ff5c5c] text-white'
                      : 'text-[#a0a0a0] hover:text-white hover:bg-[#252525]'
                  }`}
                >
                  Athlete View
                </Link>
                <Link
                  to="/coach"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isCoachRoute
                      ? 'bg-[#ff5c5c] text-white'
                      : 'text-[#a0a0a0] hover:text-white hover:bg-[#252525]'
                  }`}
                >
                  Coach
                </Link>
              </nav>
            )}

            {/* User info and logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-[#606060] capitalize">{user?.type}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#252525] flex items-center justify-center text-sm font-medium text-[#a0a0a0]">
                {user?.type === 'coach' ? '📋' : user?.avatar}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-[#252525] transition-colors text-[#a0a0a0] hover:text-white"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
