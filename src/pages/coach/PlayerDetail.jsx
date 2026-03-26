import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useApp } from '../../context/AppContext'
import { generateCoachingRecommendation } from '../../data/mockData'
import StatusBadge from '../../components/StatusBadge'
import ScoreCircle from '../../components/ScoreCircle'

const getStatus = (score) => {
  if (score === null || score === undefined) return 'none'
  if (score >= 70) return 'green'
  if (score >= 50) return 'yellow'
  return 'red'
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#252525] border border-[#404040] rounded-lg px-3 py-2">
        <p className="text-[#a0a0a0] text-xs mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value ?? 'N/A'}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function PlayerDetail() {
  const { id } = useParams()
  const { athletes, getAthleteWithStats, getCheckInsByAthleteId } = useApp()

  const [athlete, setAthlete] = useState(null)
  const [checkIns, setCheckIns] = useState([])
  const [historyData, setHistoryData] = useState([])
  const [recommendation, setRecommendation] = useState(null)

  useEffect(() => {
    const athleteId = parseInt(id)
    const baseAthlete = athletes.find(a => a.id === athleteId)

    if (baseAthlete) {
      const athleteWithStats = getAthleteWithStats(baseAthlete)
      setAthlete(athleteWithStats)

      const allCheckIns = getCheckInsByAthleteId(athleteId)
      setCheckIns(allCheckIns)

      // Generate history data for charts
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const history = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        const checkIn = allCheckIns.find(c => c.timestamp.startsWith(dateStr))

        history.push({
          date: days[date.getDay()],
          score: checkIn?.score ?? null,
          energy: checkIn?.energy ?? null,
          sleep: checkIn?.sleep?.value ?? null,
          mood: checkIn?.mood?.value ?? null,
        })
      }

      setHistoryData(history)
      setRecommendation(generateCoachingRecommendation(allCheckIns))
    }
  }, [id, athletes, getAthleteWithStats, getCheckInsByAthleteId])

  if (!athlete) {
    return (
      <div className="text-center py-12">
        <p className="text-[#a0a0a0]">Athlete not found</p>
        <Link to="/coach" className="text-[#ff5c5c] hover:underline mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const recentCheckIns = checkIns.slice(0, 5)
  const status = athlete.hasCheckedInToday ? getStatus(athlete.score) : 'none'

  // Generate additional insights based on patterns
  const getPatternInsights = () => {
    const insights = []

    if (recommendation) {
      insights.push(recommendation)
    }

    // Add streak insight
    if (athlete.streak >= 7) {
      insights.push({
        type: 'positive',
        icon: '🔥',
        title: 'Excellent Consistency',
        text: `${athlete.streak}-day check-in streak! This athlete is committed to their wellness tracking.`,
      })
    } else if (athlete.streak === 0 && !athlete.hasCheckedInToday) {
      insights.push({
        type: 'info',
        icon: '📱',
        title: 'Encourage Check-in',
        text: 'This athlete hasn\'t checked in today. A quick reminder might help.',
      })
    }

    // Energy patterns
    const energyCheckIns = checkIns.filter(c => c.energy !== undefined).slice(0, 7)
    if (energyCheckIns.length >= 3) {
      const avgEnergy = energyCheckIns.reduce((sum, c) => sum + c.energy, 0) / energyCheckIns.length
      if (avgEnergy < 50) {
        insights.push({
          type: 'warning',
          icon: '⚡',
          title: 'Low Energy Pattern',
          text: 'Average energy is below 50. Consider discussing workload and recovery.',
        })
      }
    }

    return insights.slice(0, 3)
  }

  const patternInsights = getPatternInsights()

  return (
    <div className="space-y-6">
      <Link
        to="/coach"
        className="inline-flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Athlete Header */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#252525]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#252525] flex items-center justify-center text-xl font-bold text-[#a0a0a0]">
              {athlete.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {athlete.name}
                {athlete.streak >= 7 && <span className="text-lg">🔥</span>}
              </h1>
              <p className="text-[#a0a0a0]">{athlete.position} • #{athlete.jerseyNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {athlete.hasCheckedInToday ? (
              <>
                <ScoreCircle score={athlete.score} size="md" label="Today's Score" />
                <StatusBadge status={status} size="lg" />
              </>
            ) : (
              <div className="text-center">
                <p className="text-[#606060] text-sm">Not checked in today</p>
                <p className="text-2xl mt-1">--</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#252525]">
          <p className="text-[#606060] text-sm mb-1">Mood</p>
          <p className="text-xl font-bold">
            {athlete.todayCheckIn?.mood?.label || '--'}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#252525]">
          <p className="text-[#606060] text-sm mb-1">Energy</p>
          <p className={`text-xl font-bold ${
            !athlete.todayCheckIn ? 'text-[#606060]' :
            athlete.todayCheckIn.energy >= 70 ? 'text-green-400' :
            athlete.todayCheckIn.energy >= 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {athlete.todayCheckIn?.energy ?? '--'}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#252525]">
          <p className="text-[#606060] text-sm mb-1">Sleep Quality</p>
          <p className={`text-xl font-bold ${
            !athlete.todayCheckIn ? 'text-[#606060]' :
            athlete.todayCheckIn.sleep.value >= 75 ? 'text-green-400' :
            athlete.todayCheckIn.sleep.value >= 50 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {athlete.todayCheckIn?.sleep?.label ?? '--'}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#252525]">
          <p className="text-[#606060] text-sm mb-1">7-Day Avg</p>
          <p className="text-xl font-bold text-[#ff5c5c]">
            {athlete.weeklyAvg ?? '--'}
          </p>
        </div>
      </div>

      {/* Streak Card */}
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#252525]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#606060] text-sm mb-1">Check-in Streak</p>
            <p className="text-2xl font-bold">
              {athlete.streak} {athlete.streak === 1 ? 'day' : 'days'}
            </p>
          </div>
          <div className="text-3xl">
            {athlete.streak >= 7 ? '🔥' : athlete.streak >= 3 ? '⚡' : athlete.streak >= 1 ? '✨' : '💤'}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#252525]">
          <h2 className="text-lg font-semibold mb-4">7-Day Readiness Trend</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff5c5c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff5c5c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#606060', fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#606060', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#ff5c5c"
                  strokeWidth={2}
                  fill="url(#scoreGradient)"
                  name="Readiness"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#252525]">
          <h2 className="text-lg font-semibold mb-4">Energy vs Sleep</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#606060', fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#606060', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#ff5c5c"
                  strokeWidth={2}
                  dot={false}
                  name="Energy"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="sleep"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  name="Sleep"
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#ff5c5c] rounded-full" />
              <span className="text-[#a0a0a0]">Energy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" />
              <span className="text-[#a0a0a0]">Sleep</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Check-ins */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#252525]">
        <h2 className="text-lg font-semibold mb-4">Recent Check-ins</h2>
        {recentCheckIns.length > 0 ? (
          <div className="space-y-3">
            {recentCheckIns.map((checkIn, index) => {
              const checkInDate = new Date(checkIn.timestamp)
              const today = new Date()
              const yesterday = new Date(today)
              yesterday.setDate(yesterday.getDate() - 1)

              let dateLabel
              if (checkInDate.toDateString() === today.toDateString()) {
                dateLabel = 'Today'
              } else if (checkInDate.toDateString() === yesterday.toDateString()) {
                dateLabel = 'Yesterday'
              } else {
                dateLabel = checkInDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
              }

              return (
                <div key={index} className="flex items-center justify-between p-4 bg-[#252525]/50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#606060] w-24">{dateLabel}</span>
                    <span className="px-3 py-1 bg-[#1a1a1a] rounded-full text-sm flex items-center gap-1">
                      {checkIn.mood.emoji} {checkIn.mood.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[#606060]">Energy:</span>
                      <span className="font-medium">{checkIn.energy}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#606060]">Sleep:</span>
                      <span className="font-medium">{checkIn.sleep.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#606060]">Score:</span>
                      <span className={`font-bold ${
                        checkIn.score >= 70 ? 'text-green-400' :
                        checkIn.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{checkIn.score}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-[#606060] text-center py-8">No check-ins recorded yet</p>
        )}
      </div>

      {/* AI Coaching Insights */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#252525]">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#ff5c5c]">✨</span> AI Coaching Insights
        </h2>
        <div className="space-y-3">
          {patternInsights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-[#252525]/50 rounded-xl">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-xl ${
                insight.type === 'alert' ? 'bg-red-500/20' :
                insight.type === 'warning' ? 'bg-yellow-500/20' :
                insight.type === 'positive' ? 'bg-green-500/20' : 'bg-[#ff5c5c]/20'
              }`}>
                {insight.icon}
              </div>
              <div>
                <p className="font-medium mb-1">{insight.title}</p>
                <p className="text-sm text-[#a0a0a0]">{insight.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
