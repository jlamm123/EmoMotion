import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const isCoachRoute = location.pathname.startsWith('/coach')

  return (
    <header className="bg-[#1a1a1a] border-b border-[#252525]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#ff5c5c] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="text-xl font-bold text-white">EmoMotion</span>
        </Link>

        <nav className="flex gap-1">
          <Link
            to="/athlete"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !isCoachRoute
                ? 'bg-[#ff5c5c] text-white'
                : 'text-[#a0a0a0] hover:text-white hover:bg-[#252525]'
            }`}
          >
            Athlete
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
      </div>
    </header>
  )
}
