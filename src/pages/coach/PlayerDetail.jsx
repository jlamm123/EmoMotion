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
      <div className="glass-card px-3 py-2 text-sm">
        <p className="text-[#9ca3af] text-xs mb-1">{label}</p>
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
  const { athletes, getAthleteWithStats, getCheckInsByAthleteId, vibrate } = useApp()

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
        })
      }

      setHistoryData(history)
      setRecommendation(generateCoachingRecommendation(allCheckIns))
    }
  }, [id, athletes, getAthleteWithStats, getCheckInsByAthleteId])

  if (!athlete) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#9ca3af] mb-4">Athlete not found</p>
          <Link to="/coach" className="text-[#ff4757] hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const recentCheckIns = checkIns.slice(0, 5)
  const status = athlete.hasCheckedInToday ? getStatus(athlete.score) : 'none'

  const getPatternInsights = () => {
    const insights = []

    if (recommendation) {
      insights.push(recommendation)
    }

    if (athlete.streak >= 7) {
      insights.push({
        type: 'positive',
        icon: '🔥',
        title: 'Excellent Consistency',
        text: `${athlete.streak}-day check-in streak! This athlete is committed to wellness tracking.`,
      })
    } else if (athlete.streak === 0 && !athlete.hasCheckedInToday) {
      insights.push({
        type: 'info',
        icon: '📱',
        title: 'Encourage Check-in',
        text: "This athlete hasn't checked in today. A quick reminder might help.",
      })
    }

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
    <div className="min-h-[calc(100vh-80px)] px-4 py-6">
      <Link
        to="/coach"
        onClick={() => vibrate(30)}
        className="inline-flex items-center gap-2 text-[#9ca3af] hover:text-white mb-6 transition-colors btn-press"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Athlete Header */}
      <div className="glass-card p-6 mb-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a1a24] to-[#12121a] border border-white/10 flex items-center justify-center text-xl font-bold text-[#9ca3af]">
              {athlete.avatar}
            </div>
            <div>
              <h1 className="font-display text-3xl flex items-center gap-2">
                {athlete.name}
                {athlete.streak >= 7 && <span className="text-xl">🔥</span>}
              </h1>
              <p className="text-[#9ca3af]">{athlete.position} • #{athlete.jerseyNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {athlete.hasCheckedInToday ? (
              <>
                <ScoreCircle score={athlete.score} size="md" animated />
                <StatusBadge status={status} size="lg" />
              </>
            ) : (
              <div className="text-center">
                <p className="text-[#6b7280] text-sm">Not checked in</p>
                <p className="font-display text-3xl text-[#6b7280]">--</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 animate-fade-in stagger-1">
          <p className="text-[#6b7280] text-sm mb-1">Mood</p>
          <p className="text-xl font-semibold">
            {athlete.todayCheckIn?.mood?.emoji} {athlete.todayCheckIn?.mood?.label || '--'}
          </p>
        </div>
        <div className="glass-card p-4 animate-fade-in stagger-2">
          <p className="text-[#6b7280] text-sm mb-1">Energy</p>
          <p className={`text-xl font-bold ${
            !athlete.todayCheckIn ? 'text-[#6b7280]' :
            athlete.todayCheckIn.energy >= 70 ? 'text-[#00ff88]' :
            athlete.todayCheckIn.energy >= 50 ? 'text-[#ffd93d]' : 'text-[#ff4757]'
          }`}>
            {athlete.todayCheckIn?.energy ?? '--'}
          </p>
        </div>
        <div className="glass-card p-4 animate-fade-in stagger-3">
          <p className="text-[#6b7280] text-sm mb-1">Sleep</p>
          <p className={`text-xl font-semibold ${
            !athlete.todayCheckIn ? 'text-[#6b7280]' :
            athlete.todayCheckIn.sleep.value >= 75 ? 'text-[#00ff88]' :
            athlete.todayCheckIn.sleep.value >= 50 ? 'text-[#ffd93d]' : 'text-[#ff4757]'
          }`}>
            {athlete.todayCheckIn?.sleep?.label ?? '--'}
          </p>
        </div>
        <div className="glass-card p-4 animate-fade-in stagger-4">
          <p className="text-[#6b7280] text-sm mb-1">7-Day Avg</p>
          <p className="text-xl font-bold text-[#ff4757]">
            {athlete.weeklyAvg ?? '--'}
          </p>
        </div>
      </div>

      {/* Streak */}
      <div className="glass-card p-4 mb-6 animate-fade-in stagger-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#6b7280] text-sm mb-1">Check-in Streak</p>
            <p className="font-display text-3xl">
              {athlete.streak} {athlete.streak === 1 ? 'day' : 'days'}
            </p>
          </div>
          <div className="text-4xl">
            {athlete.streak >= 7 ? '🔥' : athlete.streak >= 3 ? '⚡' : athlete.streak >= 1 ? '✨' : '💤'}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-6 animate-fade-in stagger-6">
          <h2 className="font-semibold text-lg mb-4">7-Day Readiness</h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4757" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff4757" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#ff4757"
                  strokeWidth={2}
                  fill="url(#scoreGradient)"
                  name="Readiness"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 animate-fade-in stagger-7">
          <h2 className="font-semibold text-lg mb-4">Energy vs Sleep</h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#ff4757"
                  strokeWidth={2}
                  dot={false}
                  name="Energy"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="sleep"
                  stroke="#00ff88"
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
              <div className="w-3 h-3 bg-[#ff4757] rounded-full" />
              <span className="text-[#9ca3af]">Energy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00ff88] rounded-full" />
              <span className="text-[#9ca3af]">Sleep</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Check-ins */}
      <div className="glass-card p-6 mb-6 animate-fade-in stagger-8">
        <h2 className="font-semibold text-lg mb-4">Recent Check-ins</h2>
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
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#6b7280] w-20">{dateLabel}</span>
                    <span className="px-3 py-1 bg-[#1a1a24] rounded-full text-sm flex items-center gap-1">
                      {checkIn.mood.emoji} {checkIn.mood.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-[#6b7280]">E:</span>
                      <span className="font-medium ml-1">{checkIn.energy}</span>
                    </div>
                    <div>
                      <span className="text-[#6b7280]">S:</span>
                      <span className="font-medium ml-1">{checkIn.sleep.label}</span>
                    </div>
                    <span className={`font-bold text-lg ${
                      checkIn.score >= 70 ? 'text-[#00ff88]' :
                      checkIn.score >= 50 ? 'text-[#ffd93d]' : 'text-[#ff4757]'
                    }`}>{checkIn.score}</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-[#6b7280] text-center py-8">No check-ins recorded yet</p>
        )}
      </div>

      {/* AI Coaching Insights */}
      <div className="glass-card p-6 animate-fade-in">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="text-[#ff4757]">✨</span> AI Coaching Insights
        </h2>
        <div className="space-y-3">
          {patternInsights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl ${
                insight.type === 'alert' ? 'bg-[#ff4757]/20' :
                insight.type === 'warning' ? 'bg-[#ffd93d]/20' :
                insight.type === 'positive' ? 'bg-[#00ff88]/20' : 'bg-[#00d4ff]/20'
              }`}>
                {insight.icon}
              </div>
              <div>
                <p className="font-medium mb-1">{insight.title}</p>
                <p className="text-sm text-[#9ca3af]">{insight.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
