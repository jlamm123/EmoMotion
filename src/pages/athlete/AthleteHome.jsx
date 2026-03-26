import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { useApp } from '../../context/AppContext'
import ScoreCircle from '../../components/ScoreCircle'

export default function AthleteHome() {
  const { user, getMyTodaysCheckIn, getMyStreak, getCheckInsByAthleteId, vibrate } = useApp()
  const navigate = useNavigate()

  const [todaysCheckIn, setTodaysCheckIn] = useState(null)
  const [streak, setStreak] = useState(0)
  const [weeklyData, setWeeklyData] = useState([])

  useEffect(() => {
    setTodaysCheckIn(getMyTodaysCheckIn())
    setStreak(getMyStreak())

    // Get last 7 days of check-ins
    if (user) {
      const checkIns = getCheckInsByAthleteId(user.id)
      const days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        const checkIn = checkIns.find(c => c.timestamp.startsWith(dateStr))
        days.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          score: checkIn?.score || null,
        })
      }
      setWeeklyData(days)
    }
  }, [user, getMyTodaysCheckIn, getMyStreak, getCheckInsByAthleteId])

  const hasCheckedIn = !!todaysCheckIn

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const handleCheckIn = () => {
    vibrate(50)
    navigate('/athlete/checkin')
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-6">
      {/* Welcome Header */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1a1a24] to-[#12121a] border-2 border-white/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#9ca3af]">
          {user?.avatar}
        </div>
        <p className="text-[#6b7280] mb-1">{getGreeting()}</p>
        <h1 className="font-display text-4xl">{user?.name?.split(' ')[0]}</h1>
        <p className="text-[#6b7280] mt-1">{user?.position} • #{user?.jerseyNumber}</p>
      </div>

      {/* Streak Card */}
      <div className="glass-card p-6 mb-6 animate-fade-in stagger-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#6b7280] text-sm mb-1">Check-in Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-5xl gradient-text">{streak}</span>
              <span className="text-[#9ca3af]">{streak === 1 ? 'day' : 'days'}</span>
            </div>
          </div>
          <div className="text-5xl">
            {streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : streak >= 1 ? '✨' : '💪'}
          </div>
        </div>
        {streak >= 7 && (
          <p className="text-sm text-[#00ff88] mt-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
            Amazing! Week-long streak!
          </p>
        )}
      </div>

      {/* Mini Weekly Chart */}
      <div className="glass-card p-6 mb-6 animate-fade-in stagger-2">
        <p className="text-[#6b7280] text-sm mb-4">Last 7 Days</p>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ff4757"
                strokeWidth={2}
                dot={{ fill: '#ff4757', strokeWidth: 0, r: 3 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#6b7280]">
          {weeklyData.map((d, i) => (
            <span key={i}>{d.day}</span>
          ))}
        </div>
      </div>

      {/* Today's Status */}
      {hasCheckedIn ? (
        <>
          {/* Score Card */}
          <div className="glass-card p-8 mb-6 animate-fade-in stagger-3">
            <div className="text-center mb-6">
              <p className="text-[#6b7280] text-sm mb-4">Today's Readiness</p>
              <div className="flex justify-center">
                <ScoreCircle score={todaysCheckIn.score} size="lg" animated />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="glass-card p-3 rounded-xl">
                <p className="text-2xl mb-1">{todaysCheckIn.mood.emoji}</p>
                <p className="text-xs text-[#6b7280]">{todaysCheckIn.mood.label}</p>
              </div>
              <div className="glass-card p-3 rounded-xl">
                <p className="text-2xl font-bold text-[#ff4757] mb-1">{todaysCheckIn.energy}</p>
                <p className="text-xs text-[#6b7280]">Energy</p>
              </div>
              <div className="glass-card p-3 rounded-xl">
                <p className="text-lg font-semibold mb-1">{todaysCheckIn.sleep.label}</p>
                <p className="text-xs text-[#6b7280]">Sleep</p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="glass-card overflow-hidden mb-6 animate-fade-in stagger-4">
            <div className="p-4 border-b border-white/10">
              <h2 className="font-semibold flex items-center gap-2">
                <span className="text-[#ff4757]">✨</span> Today's Insights
              </h2>
            </div>
            <div className="divide-y divide-white/10">
              {todaysCheckIn.insights.map((insight, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{insight.icon}</span>
                    <div>
                      <p className="font-medium mb-1">{insight.title}</p>
                      <p className="text-sm text-[#9ca3af]">{insight.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Check-in Complete Message */}
          <div className="glass-card p-6 text-center border-2 border-[#00ff88]/30 animate-fade-in stagger-5">
            <div className="w-14 h-14 bg-[#00ff88]/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">✓</span>
            </div>
            <p className="text-[#00ff88] font-semibold text-lg">Check-in Complete!</p>
            <p className="text-sm text-[#9ca3af] mt-1">Come back tomorrow to keep your streak</p>
          </div>
        </>
      ) : (
        <>
          {/* No Check-in Yet */}
          <div className="glass-card p-8 mb-6 text-center animate-fade-in stagger-3">
            <div className="w-24 h-24 bg-gradient-to-br from-[#ff4757]/20 to-[#ff6b81]/20 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <span className="text-5xl">🎯</span>
            </div>
            <h2 className="font-display text-3xl mb-2">READY TO CHECK IN?</h2>
            <p className="text-[#9ca3af] mb-8">
              Take 60 seconds to log how you're feeling
            </p>

            <div className="grid grid-cols-3 gap-4 text-center mb-8">
              <div className="glass-card rounded-xl p-4">
                <p className="text-2xl font-bold text-[#ff4757]">5</p>
                <p className="text-xs text-[#6b7280]">Questions</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-2xl font-bold text-[#ff4757]">60s</p>
                <p className="text-xs text-[#6b7280]">To Complete</p>
              </div>
              <div className="glass-card rounded-xl p-4">
                <p className="text-2xl font-bold text-[#ff4757]">AI</p>
                <p className="text-xs text-[#6b7280]">Insights</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckIn}
            className="w-full py-5 bg-gradient-to-r from-[#ff4757] to-[#ff6b81] rounded-2xl font-semibold text-xl btn-press shadow-lg shadow-[#ff4757]/30 animate-fade-in stagger-4"
          >
            Start Check-in
          </button>
        </>
      )}
    </div>
  )
}
