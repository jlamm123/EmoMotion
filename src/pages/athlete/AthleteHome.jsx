import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import ScoreCircle from '../../components/ScoreCircle'

export default function AthleteHome() {
  const { user, getMyTodaysCheckIn, getMyStreak } = useApp()
  const navigate = useNavigate()

  const todaysCheckIn = getMyTodaysCheckIn()
  const streak = getMyStreak()
  const hasCheckedIn = !!todaysCheckIn

  return (
    <div className="max-w-md mx-auto py-8">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full bg-[#252525] flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-[#a0a0a0]">
          {user?.avatar}
        </div>
        <h1 className="text-2xl font-bold mb-1">Hey, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-[#a0a0a0]">{user?.position} • #{user?.jerseyNumber}</p>
      </div>

      {/* Streak Card */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#252525] mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#606060] text-sm mb-1">Check-in Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#ff5c5c]">{streak}</span>
              <span className="text-[#a0a0a0]">{streak === 1 ? 'day' : 'days'}</span>
            </div>
          </div>
          <div className="text-4xl">
            {streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : streak >= 1 ? '✨' : '💪'}
          </div>
        </div>
        {streak >= 7 && (
          <p className="text-sm text-green-400 mt-3">Amazing! You're on a week-long streak!</p>
        )}
      </div>

      {/* Today's Status */}
      {hasCheckedIn ? (
        <>
          {/* Score Card */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#252525] mb-6">
            <div className="text-center mb-6">
              <p className="text-[#606060] text-sm mb-4">Today's Readiness</p>
              <div className="flex justify-center">
                <ScoreCircle score={todaysCheckIn.score} size="lg" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl mb-1">{todaysCheckIn.mood.emoji}</p>
                <p className="text-xs text-[#606060]">{todaysCheckIn.mood.label}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#ff5c5c] mb-1">{todaysCheckIn.energy}</p>
                <p className="text-xs text-[#606060]">Energy</p>
              </div>
              <div>
                <p className="text-lg mb-1">{todaysCheckIn.sleep.label}</p>
                <p className="text-xs text-[#606060]">Sleep</p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] overflow-hidden mb-6">
            <div className="p-4 border-b border-[#252525]">
              <h2 className="font-semibold flex items-center gap-2">
                <span className="text-[#ff5c5c]">✨</span> Today's Insights
              </h2>
            </div>
            <div className="divide-y divide-[#252525]">
              {todaysCheckIn.insights.map((insight, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{insight.icon}</span>
                    <div>
                      <p className="font-medium mb-1">{insight.title}</p>
                      <p className="text-sm text-[#a0a0a0]">{insight.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Check-in Complete Message */}
          <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-3">✅</div>
            <p className="text-green-400 font-medium">Check-in Complete!</p>
            <p className="text-sm text-[#a0a0a0] mt-1">Come back tomorrow to keep your streak going</p>
          </div>
        </>
      ) : (
        <>
          {/* No Check-in Yet */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#252525] mb-6 text-center">
            <div className="w-20 h-20 bg-[#ff5c5c]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🎯</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Ready to Check In?</h2>
            <p className="text-[#a0a0a0] mb-6">
              Take 60 seconds to log how you're feeling today
            </p>

            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="bg-[#252525] rounded-xl p-3">
                <p className="text-lg font-bold text-[#ff5c5c]">5</p>
                <p className="text-xs text-[#606060]">Questions</p>
              </div>
              <div className="bg-[#252525] rounded-xl p-3">
                <p className="text-lg font-bold text-[#ff5c5c]">60s</p>
                <p className="text-xs text-[#606060]">To Complete</p>
              </div>
              <div className="bg-[#252525] rounded-xl p-3">
                <p className="text-lg font-bold text-[#ff5c5c]">AI</p>
                <p className="text-xs text-[#606060]">Insights</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/athlete/checkin')}
            className="w-full py-4 bg-[#ff5c5c] hover:bg-[#ff7a7a] rounded-xl font-semibold text-lg transition-colors"
          >
            Start Check-in
          </button>
        </>
      )}
    </div>
  )
}
