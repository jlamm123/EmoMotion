import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
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
      <div className="bg-[#252525] border border-[#404040] rounded-lg px-3 py-2">
        <p className="text-[#a0a0a0] text-xs mb-1">{label}</p>
        <p className="text-white font-semibold">{payload[0].value ?? 'No data'}</p>
      </div>
    )
  }
  return null
}

export default function CoachDashboard() {
  const { athletes, getTeamStats, getWeeklyTrend, getAthleteWithStats, notifications, clearNotifications } = useApp()
  const [teamStats, setTeamStats] = useState({ teamAverage: 0, checkedInCount: 0, alertCount: 0, watchCount: 0 })
  const [weeklyTrend, setWeeklyTrend] = useState([])
  const [athletesWithStats, setAthletesWithStats] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  // Refresh data periodically to catch new check-ins
  useEffect(() => {
    const loadData = () => {
      setTeamStats(getTeamStats())
      setWeeklyTrend(getWeeklyTrend())
      setAthletesWithStats(athletes.map(a => getAthleteWithStats(a)))
    }

    loadData()
    const interval = setInterval(loadData, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [athletes, getTeamStats, getWeeklyTrend, getAthleteWithStats])

  // Sort athletes: those needing attention first (lowest scores), then unchecked
  const sortedAthletes = [...athletesWithStats].sort((a, b) => {
    // Unchecked athletes go to the end
    if (!a.hasCheckedInToday && b.hasCheckedInToday) return 1
    if (a.hasCheckedInToday && !b.hasCheckedInToday) return -1
    // Among checked-in athletes, sort by score (lowest first)
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Eagles Basketball</h1>
          <p className="text-[#a0a0a0]">Team Wellness Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); if (notifications.length > 0) clearNotifications(); }}
              className="relative p-2 rounded-lg hover:bg-[#252525] transition-colors"
            >
              <svg className="w-6 h-6 text-[#a0a0a0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff5c5c] rounded-full flex items-center justify-center text-xs font-bold">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
            <div className={`w-2 h-2 rounded-full ${teamStats.checkedInCount > 0 ? 'bg-green-400 animate-pulse' : 'bg-[#606060]'}`} />
            {teamStats.checkedInCount}/{athletes.length} checked in today
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Team Average */}
        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#252525]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#606060] text-sm">Team Average</span>
            <div className="w-8 h-8 bg-[#ff5c5c]/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-[#ff5c5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold">{teamStats.checkedInCount > 0 ? teamStats.teamAverage : '--'}</p>
          <div className="flex items-center gap-1 mt-1">
            {teamStats.checkedInCount > 0 && <StatusBadge status={getStatus(teamStats.teamAverage)} size="sm" showLabel={false} />}
            <span className="text-xs text-[#606060]">{teamStats.checkedInCount > 0 ? 'out of 100' : 'No check-ins yet'}</span>
          </div>
        </div>

        {/* Watch List */}
        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#252525]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#606060] text-sm">Watch List</span>
            <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{teamStats.watchCount}</p>
          <p className="text-xs text-[#606060] mt-1">athletes to monitor</p>
        </div>

        {/* Alerts */}
        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#252525]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#606060] text-sm">Alerts</span>
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-red-400">{teamStats.alertCount}</p>
          <p className="text-xs text-[#606060] mt-1">need attention</p>
        </div>

        {/* Weekly Change */}
        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#252525]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#606060] text-sm">Weekly Change</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              weeklyChange === null ? 'bg-[#252525]' :
              weeklyChange >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <svg className={`w-4 h-4 ${weeklyChange === null ? 'text-[#606060]' : weeklyChange >= 0 ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {weeklyChange >= 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
              </svg>
            </div>
          </div>
          <p className={`text-3xl font-bold ${weeklyChange === null ? 'text-[#606060]' : weeklyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {weeklyChange === null ? '--' : `${weeklyChange >= 0 ? '+' : ''}${weeklyChange}`}
          </p>
          <p className="text-xs text-[#606060] mt-1">vs week start</p>
        </div>
      </div>

      {/* 7-Day Trend Chart */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#252525]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">7-Day Team Trend</h2>
          <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
            <div className="w-3 h-3 bg-[#ff5c5c] rounded-full" />
            Team Average
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrend}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#606060', fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#606060', fontSize: 12 }}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ff5c5c"
                strokeWidth={3}
                dot={{ fill: '#ff5c5c', strokeWidth: 0, r: 5 }}
                activeDot={{ fill: '#ff5c5c', strokeWidth: 0, r: 7 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Roster */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] overflow-hidden">
        <div className="p-4 border-b border-[#252525] flex items-center justify-between">
          <h2 className="text-lg font-semibold">Team Roster</h2>
          <span className="text-sm text-[#606060]">{athletes.length} athletes</span>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#151515] text-xs text-[#606060] uppercase tracking-wide">
          <div className="col-span-5">Athlete</div>
          <div className="col-span-3">Position</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-2 text-center">Status</div>
        </div>

        {/* Athletes List */}
        <div className="divide-y divide-[#252525]">
          {sortedAthletes.map((athlete) => (
            <Link
              key={athlete.id}
              to={`/coach/athlete/${athlete.id}`}
              className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-[#252525]/50 transition-colors"
            >
              {/* Name & Avatar */}
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#252525] flex items-center justify-center text-sm font-medium text-[#a0a0a0]">
                  {athlete.avatar}
                </div>
                <div>
                  <span className="font-medium">{athlete.name}</span>
                  {athlete.streak >= 7 && (
                    <span className="ml-2 text-xs">🔥</span>
                  )}
                </div>
              </div>

              {/* Position */}
              <div className="col-span-3 text-[#a0a0a0]">
                {athlete.position}
              </div>

              {/* Score */}
              <div className="col-span-2 text-center">
                {athlete.hasCheckedInToday ? (
                  <span className={`text-lg font-bold ${
                    athlete.score >= 70 ? 'text-green-400' :
                    athlete.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {athlete.score}
                  </span>
                ) : (
                  <span className="text-[#606060]">--</span>
                )}
              </div>

              {/* Status */}
              <div className="col-span-2 flex justify-center">
                {athlete.hasCheckedInToday ? (
                  <StatusBadge status={getStatus(athlete.score)} size="sm" />
                ) : (
                  <span className="text-xs text-[#606060] bg-[#252525] px-2 py-1 rounded">Not checked in</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
