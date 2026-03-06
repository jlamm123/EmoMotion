import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import StatusBadge from '../../components/StatusBadge'

const weeklyTrend = [
  { day: 'Mon', score: 72 },
  { day: 'Tue', score: 68 },
  { day: 'Wed', score: 75 },
  { day: 'Thu', score: 71 },
  { day: 'Fri', score: 78 },
  { day: 'Sat', score: 82 },
  { day: 'Sun', score: 76 },
]

const athletes = [
  { id: 1, name: 'Marcus Johnson', position: 'Point Guard', score: 87, avatar: 'MJ' },
  { id: 2, name: 'DeShawn Williams', position: 'Shooting Guard', score: 64, avatar: 'DW' },
  { id: 3, name: 'Tyler Chen', position: 'Small Forward', score: 42, avatar: 'TC' },
  { id: 4, name: 'Jordan Mitchell', position: 'Power Forward', score: 78, avatar: 'JM' },
  { id: 5, name: 'Andre Thompson', position: 'Center', score: 91, avatar: 'AT' },
  { id: 6, name: 'Chris Rodriguez', position: 'Point Guard', score: 55, avatar: 'CR' },
  { id: 7, name: 'Brandon Lee', position: 'Shooting Guard', score: 73, avatar: 'BL' },
  { id: 8, name: 'Isaiah Brown', position: 'Small Forward', score: 38, avatar: 'IB' },
  { id: 9, name: 'Kevin Davis', position: 'Power Forward', score: 82, avatar: 'KD' },
  { id: 10, name: 'Ryan Martinez', position: 'Center', score: 69, avatar: 'RM' },
]

const getStatus = (score) => {
  if (score >= 70) return 'green'
  if (score >= 50) return 'yellow'
  return 'red'
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#252525] border border-[#404040] rounded-lg px-3 py-2">
        <p className="text-[#a0a0a0] text-xs mb-1">{label}</p>
        <p className="text-white font-semibold">{payload[0].value}</p>
      </div>
    )
  }
  return null
}

export default function CoachDashboard() {
  const teamAverage = Math.round(athletes.reduce((sum, a) => sum + a.score, 0) / athletes.length)
  const watchList = athletes.filter((a) => getStatus(a.score) === 'yellow').length
  const alerts = athletes.filter((a) => getStatus(a.score) === 'red').length
  const weeklyChange = '+4'

  // Sort athletes by score (lowest first for attention priority)
  const sortedAthletes = [...athletes].sort((a, b) => a.score - b.score)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Eagles Basketball</h1>
          <p className="text-[#a0a0a0]">Team Wellness Dashboard</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {athletes.length} athletes checked in today
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
          <p className="text-3xl font-bold">{teamAverage}</p>
          <div className="flex items-center gap-1 mt-1">
            <StatusBadge status={getStatus(teamAverage)} size="sm" showLabel={false} />
            <span className="text-xs text-[#606060]">out of 100</span>
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
          <p className="text-3xl font-bold text-yellow-400">{watchList}</p>
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
          <p className="text-3xl font-bold text-red-400">{alerts}</p>
          <p className="text-xs text-[#606060] mt-1">need attention</p>
        </div>

        {/* Weekly Change */}
        <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#252525]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#606060] text-sm">Weekly Change</span>
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400">{weeklyChange}</p>
          <p className="text-xs text-[#606060] mt-1">vs last week</p>
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
                <span className="font-medium">{athlete.name}</span>
              </div>

              {/* Position */}
              <div className="col-span-3 text-[#a0a0a0]">
                {athlete.position}
              </div>

              {/* Score */}
              <div className="col-span-2 text-center">
                <span className={`text-lg font-bold ${
                  athlete.score >= 70 ? 'text-green-400' :
                  athlete.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {athlete.score}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2 flex justify-center">
                <StatusBadge status={getStatus(athlete.score)} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
