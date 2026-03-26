import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login() {
  const [role, setRole] = useState(null)
  const [selectedAthlete, setSelectedAthlete] = useState(null)
  const [teamCode, setTeamCode] = useState('')
  const [error, setError] = useState('')

  const { athletes, loginAsAthlete, loginAsCoach, vibrate } = useApp()
  const navigate = useNavigate()

  const handleAthleteLogin = () => {
    if (!selectedAthlete) {
      setError('Please select your name')
      vibrate([50, 50, 50])
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
      vibrate([50, 50, 50])
      return
    }
    const success = loginAsCoach(teamCode)
    if (success) {
      navigate('/coach')
    } else {
      setError('Invalid team code')
      vibrate([50, 50, 50])
    }
  }

  // Role selection screen
  if (!role) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-fade-in">
          <div className="mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-[#ff4757] to-[#ff6b81] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#ff4757]/30 animate-scale-in">
              <span className="text-5xl font-black text-white">E</span>
            </div>
            <h1 className="font-display text-5xl mb-3">EMOMOTION</h1>
            <p className="text-[#9ca3af] text-lg">AI-powered athlete wellness</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => { setRole('athlete'); vibrate(30); }}
              className="w-full p-6 glass-card hover:border-[#ff4757]/50 rounded-2xl transition-all btn-press group animate-fade-in stagger-1"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ff4757]/20 to-[#ff6b81]/20 rounded-2xl flex items-center justify-center group-hover:from-[#ff4757]/30 group-hover:to-[#ff6b81]/30 transition-colors">
                  <span className="text-3xl">🏀</span>
                </div>
                <div className="text-left">
                  <p className="text-xl font-semibold mb-1">I'm an Athlete</p>
                  <p className="text-[#6b7280]">Log your daily check-in</p>
                </div>
                <svg className="w-6 h-6 text-[#6b7280] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => { setRole('coach'); vibrate(30); }}
              className="w-full p-6 glass-card hover:border-[#00d4ff]/50 rounded-2xl transition-all btn-press group animate-fade-in stagger-2"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00d4ff]/20 to-[#00ff88]/20 rounded-2xl flex items-center justify-center group-hover:from-[#00d4ff]/30 group-hover:to-[#00ff88]/30 transition-colors">
                  <span className="text-3xl">📋</span>
                </div>
                <div className="text-left">
                  <p className="text-xl font-semibold mb-1">I'm a Coach</p>
                  <p className="text-[#6b7280]">View team dashboard</p>
                </div>
                <svg className="w-6 h-6 text-[#6b7280] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          <p className="text-sm text-[#6b7280] mt-10 animate-fade-in stagger-3">
            Eagles Basketball Team
          </p>
        </div>
      </div>
    )
  }

  // Athlete login screen
  if (role === 'athlete') {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col px-4 py-6">
        <button
          onClick={() => { setRole(null); setError(''); setSelectedAthlete(null); vibrate(30); }}
          className="flex items-center gap-2 text-[#9ca3af] hover:text-white mb-6 transition-colors btn-press"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-4xl mb-2">SELECT YOUR NAME</h1>
          <p className="text-[#9ca3af]">Choose your profile to check in</p>
        </div>

        {error && (
          <div className="bg-[#ff4757]/20 border border-[#ff4757] text-[#ff4757] px-4 py-3 rounded-xl mb-4 animate-shake">
            {error}
          </div>
        )}

        <div className="flex-1 space-y-2 overflow-y-auto mb-6">
          {athletes.map((athlete, index) => (
            <button
              key={athlete.id}
              onClick={() => { setSelectedAthlete(athlete.id); setError(''); vibrate(30); }}
              className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all btn-press animate-fade-in stagger-${Math.min(index + 1, 8)} ${
                selectedAthlete === athlete.id
                  ? 'bg-[#ff4757]/20 border-[#ff4757]'
                  : 'glass-card border-transparent hover:border-white/20'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a1a24] to-[#12121a] flex items-center justify-center text-lg font-semibold text-[#9ca3af]">
                {athlete.avatar}
              </div>
              <div className="text-left">
                <p className="font-semibold text-lg">{athlete.name}</p>
                <p className="text-sm text-[#6b7280]">{athlete.position} • #{athlete.jerseyNumber}</p>
              </div>
              {selectedAthlete === athlete.id && (
                <div className="ml-auto w-7 h-7 bg-[#ff4757] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleAthleteLogin}
          disabled={!selectedAthlete}
          className="w-full py-4 bg-gradient-to-r from-[#ff4757] to-[#ff6b81] disabled:from-[#1a1a24] disabled:to-[#1a1a24] disabled:text-[#6b7280] rounded-2xl font-semibold text-lg btn-press transition-all"
        >
          Continue
        </button>
      </div>
    )
  }

  // Coach login screen
  if (role === 'coach') {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col px-4 py-6">
        <button
          onClick={() => { setRole(null); setError(''); setTeamCode(''); vibrate(30); }}
          className="flex items-center gap-2 text-[#9ca3af] hover:text-white mb-6 transition-colors btn-press"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00d4ff]/20 to-[#00ff88]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📋</span>
            </div>
            <h1 className="font-display text-4xl mb-2">COACH LOGIN</h1>
            <p className="text-[#9ca3af]">Enter your team code</p>
          </div>

          {error && (
            <div className="bg-[#ff4757]/20 border border-[#ff4757] text-[#ff4757] px-4 py-3 rounded-xl mb-4 animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-[#9ca3af] mb-3">Team Code</label>
              <input
                type="text"
                value={teamCode}
                onChange={(e) => { setTeamCode(e.target.value.toUpperCase()); setError(''); }}
                placeholder="Enter code"
                className="w-full px-6 py-5 glass-card rounded-2xl text-white placeholder-[#6b7280] focus:border-[#00d4ff] focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/20 transition-all text-center text-2xl tracking-[0.3em] uppercase font-semibold"
              />
            </div>

            <button
              onClick={handleCoachLogin}
              className="w-full py-4 bg-gradient-to-r from-[#00d4ff] to-[#00ff88] rounded-2xl font-semibold text-lg text-black btn-press"
            >
              Access Dashboard
            </button>
          </div>

          <div className="mt-10 p-4 glass-card rounded-xl text-center">
            <p className="text-sm text-[#6b7280]">
              Demo code: <span className="text-[#00d4ff] font-mono font-bold">EAGLES2024</span>
            </p>
          </div>
        </div>
      </div>
    )
  }
}
