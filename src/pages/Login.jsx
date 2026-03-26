import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login() {
  const [role, setRole] = useState(null) // 'athlete' or 'coach'
  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const [teamCode, setTeamCode] = useState('')
  const [error, setError] = useState('')

  const { athletes, loginAsAthlete, loginAsCoach } = useApp()
  const navigate = useNavigate()

  const handleAthleteLogin = () => {
    if (!selectedAthlete) {
      setError('Please select your name')
      return
    }
    const success = loginAsAthlete(selectedAthlete)
    if (success) {
      navigate('/athlete')
    }
  }

  const handleCoachLogin = () => {
    if (!teamCode) {
      setError('Please enter the team code')
      return
    }
    const success = loginAsCoach(teamCode)
    if (success) {
      navigate('/coach')
    } else {
      setError('Invalid team code')
    }
  }

  // Role selection screen
  if (!role) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-[#ff5c5c] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl font-bold text-white">E</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome to EmoMotion</h1>
            <p className="text-[#a0a0a0]">AI-powered athlete wellness tracking</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setRole('athlete')}
              className="w-full p-6 bg-[#1a1a1a] hover:bg-[#252525] border border-[#252525] hover:border-[#ff5c5c] rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#ff5c5c]/20 rounded-xl flex items-center justify-center group-hover:bg-[#ff5c5c]/30 transition-colors">
                  <span className="text-2xl">🏀</span>
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold">I'm an Athlete</p>
                  <p className="text-sm text-[#a0a0a0]">Log your daily check-in</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setRole('coach')}
              className="w-full p-6 bg-[#1a1a1a] hover:bg-[#252525] border border-[#252525] hover:border-[#ff5c5c] rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#ff5c5c]/20 rounded-xl flex items-center justify-center group-hover:bg-[#ff5c5c]/30 transition-colors">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="text-left">
                  <p className="text-lg font-semibold">I'm a Coach</p>
                  <p className="text-sm text-[#a0a0a0]">View team dashboard</p>
                </div>
              </div>
            </button>
          </div>

          <p className="text-sm text-[#606060] mt-8">
            Eagles Basketball Team
          </p>
        </div>
      </div>
    )
  }

  // Athlete login screen
  if (role === 'athlete') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <button
            onClick={() => { setRole(null); setError(''); setSelectedAthlete(null); }}
            className="flex items-center gap-2 text-[#a0a0a0] hover:text-white mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Select Your Name</h1>
            <p className="text-[#a0a0a0]">Choose your profile to check in</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto">
            {athletes.map(athlete => (
              <button
                key={athlete.id}
                onClick={() => { setSelectedAthlete(athlete.id); setError(''); }}
                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                  selectedAthlete === athlete.id
                    ? 'bg-[#ff5c5c]/20 border-[#ff5c5c]'
                    : 'bg-[#1a1a1a] border-[#252525] hover:border-[#404040]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#252525] flex items-center justify-center text-sm font-medium text-[#a0a0a0]">
                  {athlete.avatar}
                </div>
                <div className="text-left">
                  <p className="font-medium">{athlete.name}</p>
                  <p className="text-sm text-[#606060]">{athlete.position} • #{athlete.jerseyNumber}</p>
                </div>
                {selectedAthlete === athlete.id && (
                  <div className="ml-auto w-6 h-6 bg-[#ff5c5c] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleAthleteLogin}
            disabled={!selectedAthlete}
            className="w-full py-4 bg-[#ff5c5c] hover:bg-[#ff7a7a] disabled:bg-[#252525] disabled:text-[#606060] rounded-xl font-semibold transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  // Coach login screen
  if (role === 'coach') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <button
            onClick={() => { setRole(null); setError(''); setTeamCode(''); }}
            className="flex items-center gap-2 text-[#a0a0a0] hover:text-white mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#ff5c5c]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Coach Login</h1>
            <p className="text-[#a0a0a0]">Enter your team code to continue</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[#a0a0a0] mb-2">Team Code</label>
              <input
                type="text"
                value={teamCode}
                onChange={(e) => { setTeamCode(e.target.value.toUpperCase()); setError(''); }}
                placeholder="Enter team code"
                className="w-full px-4 py-4 bg-[#1a1a1a] border border-[#252525] rounded-xl text-white placeholder-[#606060] focus:border-[#ff5c5c] focus:outline-none transition-colors text-center text-lg tracking-wider uppercase"
              />
            </div>

            <button
              onClick={handleCoachLogin}
              className="w-full py-4 bg-[#ff5c5c] hover:bg-[#ff7a7a] rounded-xl font-semibold transition-colors"
            >
              Access Dashboard
            </button>
          </div>

          <div className="mt-8 p-4 bg-[#1a1a1a] rounded-xl border border-[#252525]">
            <p className="text-xs text-[#606060] text-center">
              Demo code: <span className="text-[#ff5c5c] font-mono">EAGLES2024</span>
            </p>
          </div>
        </div>
      </div>
    )
  }
}
