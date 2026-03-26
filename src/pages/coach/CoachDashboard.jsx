import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { useApp } from '../../context/AppContext'
import StatusBadge from '../../components/StatusBadge'

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
        <p className="text-white font-semibold">{payload[0].value ?? 'No data'}</p>
      </div>
    )
  }
  return null
}

export default function CoachDashboard() {
  const { athletes, getTeamStats, getWeeklyTrend, getAthleteWithStats, notifications, clearNotifications, vibrate } = useApp()
  const [teamStats, setTeamStats] = useState({ teamAverage: 0, checkedInCount: 0, alertCount: 0, watchCount: 0 })
  const [weeklyTrend, setWeeklyTrend] = useState([])
  const [athletesWithStats, setAthletesWithStats] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = useCallback(() => {
    setTeamStats(getTeamStats())
    setWeeklyTrend(getWeeklyTrend())
    setAthletesWithStats(athletes.map(a => getAthleteWithStats(a)))
  }, [athletes, getTeamStats, getWeeklyTrend, getAthleteWithStats])

  // Initial load and periodic refresh
  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [loadData])

  // Pull to refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true)
    vibrate(50)
    setTimeout(() => {
      loadData()
      setIsRefreshing(false)
    }, 1000)
  }

  // Sort athletes: those needing attention first
  const sortedAthletes = [...athletesWithStats].sort((a, b) => {
    if (!a.hasCheckedInToday && b.hasCheckedInToday) return 1
    if (a.hasCheckedInToday && !b.hasCheckedInToday) return -1
    if (a.hasCheckedInToday && b.hasCheckedInToday) {
      return a.score - b.score
    }
    return 0
  })

  // Calculate weekly change
  const getWeeklyChange = () => {
    const validDays = weeklyTrend.filter(d => d.score !== null)
    if (validDays.length < 2) return null
    const recent = validDays[validDays.length - 1].score
    const previous = validDays[0].score
    return recent - previous
  }

  const weeklyChange = getWeeklyChange()

  // Check if athlete checked in recently (within last hour)
  const isNewCheckIn = (athlete) => {
    if (!athlete.todayCheckIn) return false
    const checkInTime = new Date(athlete.todayCheckIn.timestamp)
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return checkInTime > hourAgo
  }

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="font-display text-4xl">EAGLES BASKETBALL</h1>
          <p className="text-[#9ca3af]">Team Wellness Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl glass-card btn-press"
          >
            <svg className={`w-5 h-5 text-[#9ca3af] ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Notifications */}
          <button
            onClick={() => { if (notifications.length > 0) { clearNotifications(); vibrate(30); } }}
            className="relative p-2 rounded-xl glass-card btn-press"
          >
            <svg className="w-5 h-5 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff4757] rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Check-in status */}
      <div className="flex items-center gap-2 text-sm text-[#9ca3af] mb-6 animate-fade-in stagger-1">
        <div className={`w-2 h-2 rounded-full ${teamStats.checkedInCount > 0 ? 'bg-[#00ff88] animate-pulse' : 'bg-[#6b7280]'}`} />
        {teamStats.checkedInCount}/{athletes.length} checked in today
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Team Average */}
        <div className="glass-card p-5 animate-fade-in stagger-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#6b7280] text-sm">Team Average</span>
            <div className="w-10 h-10 bg-[#ff4757]/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#ff4757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="font-display text-4xl">{teamStats.checkedInCount > 0 ? teamStats.teamAverage : '--'}</p>
          <div className="flex items-center gap-2 mt-1">
            {teamStats.checkedInCount > 0 && <StatusBadge status={getStatus(teamStats.teamAverage)} size="sm" showLabel={false} />}
            <span className="text-xs text-[#6b7280]">{teamStats.checkedInCount > 0 ? 'out of 100' : 'No data'}</span>
          </div>
        </div>

        {/* Weekly Change */}
        <div className="glass-card p-5 animate-fade-in stagger-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#6b7280] text-sm">Weekly Change</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              weeklyChange === null ? 'bg-[#1a1a24]' :
              weeklyChange >= 0 ? 'bg-[#00ff88]/20' : 'bg-[#ff4757]/20'
            }`}>
              <svg className={`w-5 h-5 ${weeklyChange === null ? 'text-[#6b7280]' : weeklyChange >= 0 ? 'text-[#00ff88]' : 'text-[#ff4757]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {weeklyChange >= 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
              </svg>
            </div>
          </div>
          <p className={`font-display text-4xl ${weeklyChange === null ? 'text-[#6b7280]' : weeklyChange >= 0 ? 'text-[#00ff88]' : 'text-[#ff4757]'}`}>
            {weeklyChange === null ? '--' : `${weeklyChange >= 0 ? '+' : ''}${weeklyChange}`}
          </p>
          <span className="text-xs text-[#6b7280]">vs week start</span>
        </div>

        {/* Watch List */}
        <div className="glass-card p-5 animate-fade-in stagger-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#6b7280] text-sm">Watch List</span>
            <div className="w-10 h-10 bg-[#ffd93d]/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#ffd93d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <p className="font-display text-4xl text-[#ffd93d]">{teamStats.watchCount}</p>
          <span className="text-xs text-[#6b7280]">to monitor</span>
        </div>

        {/* Alerts */}
        <div className="glass-card p-5 animate-fade-in stagger-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#6b7280] text-sm">Alerts</span>
            <div className="w-10 h-10 bg-[#ff4757]/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-[#ff4757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="font-display text-4xl text-[#ff4757]">{teamStats.alertCount}</p>
          <span className="text-xs text-[#6b7280]">need attention</span>
        </div>
      </div>

      {/* 7-Day Trend Chart */}
      <div className="glass-card p-6 mb-6 animate-fade-in stagger-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">7-Day Trend</h2>
          <div className="flex items-center gap-2 text-sm text-[#9ca3af]">
            <div className="w-3 h-3 bg-[#ff4757] rounded-full" />
            Team Avg
          </div>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4757" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff4757" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
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
                strokeWidth={3}
                fill="url(#colorScore)"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Roster */}
      <div className="glass-card overflow-hidden animate-fade-in stagger-6">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Team Roster</h2>
          <span className="text-sm text-[#6b7280]">{athletes.length} athletes</span>
        </div>

        <div className="divide-y divide-white/10">
          {sortedAthletes.map((athlete, index) => (
            <Link
              key={athlete.id}
              to={`/coach/athlete/${athlete.id}`}
              className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors btn-press animate-fade-in stagger-${Math.min(index + 1, 8)}`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a1a24] to-[#12121a] flex items-center justify-center text-sm font-semibold text-[#9ca3af]">
                  {athlete.avatar}
                </div>
                {isNewCheckIn(athlete) && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-[#00d4ff] rounded text-[10px] font-bold text-black">
                    NEW
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{athlete.name}</p>
                  {athlete.streak >= 7 && <span className="text-sm">🔥</span>}
                </div>
                <p className="text-sm text-[#6b7280] truncate">{athlete.position}</p>
              </div>

              {/* Score */}
              <div className="text-right">
                {athlete.hasCheckedInToday ? (
                  <>
                    <p className={`text-2xl font-bold ${
                      athlete.score >= 70 ? 'text-[#00ff88]' :
                      athlete.score >= 50 ? 'text-[#ffd93d]' : 'text-[#ff4757]'
                    }`}>
                      {athlete.score}
                    </p>
                    <StatusBadge status={getStatus(athlete.score)} size="sm" showLabel={false} />
                  </>
                ) : (
                  <span className="text-[#6b7280] text-sm">Not checked in</span>
                )}
              </div>

              {/* Arrow */}
              <svg className="w-5 h-5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
