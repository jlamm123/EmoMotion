import { useParams, Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import StatusBadge from '../../components/StatusBadge'
import ScoreCircle from '../../components/ScoreCircle'

const athleteData = {
  1: { name: 'Marcus Johnson', position: 'Point Guard', score: 87, avatar: 'MJ', energy: 82, sleep: 'Great', mood: 'Locked In' },
  2: { name: 'DeShawn Williams', position: 'Shooting Guard', score: 64, avatar: 'DW', energy: 58, sleep: 'Fair', mood: 'Okay' },
  3: { name: 'Tyler Chen', position: 'Small Forward', score: 42, avatar: 'TC', energy: 35, sleep: 'Poor', mood: 'Rough' },
  4: { name: 'Jordan Mitchell', position: 'Power Forward', score: 78, avatar: 'JM', energy: 75, sleep: 'Good', mood: 'Good' },
  5: { name: 'Andre Thompson', position: 'Center', score: 91, avatar: 'AT', energy: 88, sleep: 'Great', mood: 'Locked In' },
  6: { name: 'Chris Rodriguez', position: 'Point Guard', score: 55, avatar: 'CR', energy: 50, sleep: 'Fair', mood: 'Low' },
  7: { name: 'Brandon Lee', position: 'Shooting Guard', score: 73, avatar: 'BL', energy: 70, sleep: 'Good', mood: 'Good' },
  8: { name: 'Isaiah Brown', position: 'Small Forward', score: 38, avatar: 'IB', energy: 32, sleep: 'Poor', mood: 'Rough' },
  9: { name: 'Kevin Davis', position: 'Power Forward', score: 82, avatar: 'KD', energy: 78, sleep: 'Great', mood: 'Good' },
  10: { name: 'Ryan Martinez', position: 'Center', score: 69, avatar: 'RM', energy: 65, sleep: 'Good', mood: 'Okay' },
}

const getStatus = (score) => {
  if (score >= 70) return 'green'
  if (score >= 50) return 'yellow'
  return 'red'
}

// Generate unique history data based on athlete ID
const generateHistoryData = (id, currentScore) => {
  const baseScore = currentScore
  const variance = 15
  return [
    { date: 'Mon', score: Math.max(0, Math.min(100, baseScore - 8 + (id % 5))), energy: Math.max(0, Math.min(100, baseScore - 10 + (id % 7))), sleep: Math.max(0, Math.min(100, baseScore - 5)) },
    { date: 'Tue', score: Math.max(0, Math.min(100, baseScore - 12 + (id % 3))), energy: Math.max(0, Math.min(100, baseScore - 15)), sleep: Math.max(0, Math.min(100, baseScore + 2)) },
    { date: 'Wed', score: Math.max(0, Math.min(100, baseScore - 5)), energy: Math.max(0, Math.min(100, baseScore - 8 + (id % 4))), sleep: Math.max(0, Math.min(100, baseScore - 3)) },
    { date: 'Thu', score: Math.max(0, Math.min(100, baseScore + 2 - (id % 6))), energy: Math.max(0, Math.min(100, baseScore)), sleep: Math.max(0, Math.min(100, baseScore + 5)) },
    { date: 'Fri', score: Math.max(0, Math.min(100, baseScore - 3)), energy: Math.max(0, Math.min(100, baseScore + 3)), sleep: Math.max(0, Math.min(100, baseScore - 2)) },
    { date: 'Sat', score: Math.max(0, Math.min(100, baseScore + 5)), energy: Math.max(0, Math.min(100, baseScore + 8)), sleep: Math.max(0, Math.min(100, baseScore + 10)) },
    { date: 'Sun', score: baseScore, energy: Math.max(0, Math.min(100, baseScore - 2)), sleep: Math.max(0, Math.min(100, baseScore + 3)) },
  ]
}

const recentCheckins = [
  { date: 'Today', mood: 'Locked In', energy: 82, sleep: 'Great' },
  { date: 'Yesterday', mood: 'Good', energy: 75, sleep: 'Good' },
  { date: '2 days ago', mood: 'Okay', energy: 68, sleep: 'Fair' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#252525] border border-[#404040] rounded-lg px-3 py-2">
        <p className="text-[#a0a0a0] text-xs mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function PlayerDetail() {
  const { id } = useParams()
  const athlete = athleteData[id] || { name: 'Unknown', position: 'N/A', score: 0, avatar: '??', energy: 0, sleep: 'N/A', mood: 'N/A' }
  const status = getStatus(athlete.score)
  const historyData = generateHistoryData(parseInt(id) || 1, athlete.score)

  // Generate dynamic insights based on athlete data
  const getInsights = () => {
    const insights = []

    if (athlete.score < 50) {
      insights.push({
        type: 'alert',
        icon: '⚠️',
        title: 'Attention Required',
        text: `${athlete.name.split(' ')[0]}'s readiness is below optimal. Consider a 1-on-1 check-in to understand what's affecting their performance.`
      })
    }

    if (athlete.energy < 50) {
      insights.push({
        type: 'warning',
        icon: '⚡',
        title: 'Low Energy Pattern',
        text: 'Energy levels have been consistently low. Consider reducing training intensity or checking for sleep issues.'
      })
    } else if (athlete.energy >= 80) {
      insights.push({
        type: 'positive',
        icon: '💪',
        title: 'High Energy',
        text: 'Energy levels are excellent. This is a great time for high-intensity skill development.'
      })
    }

    if (athlete.sleep === 'Poor') {
      insights.push({
        type: 'warning',
        icon: '😴',
        title: 'Sleep Quality Concern',
        text: 'Poor sleep quality reported. Consider discussing sleep habits and recovery protocols.'
      })
    }

    if (athlete.score >= 80) {
      insights.push({
        type: 'positive',
        icon: '🔥',
        title: 'Peak Performance Ready',
        text: `${athlete.name.split(' ')[0]} is in excellent condition. Consider featuring them in high-pressure situations.`
      })
    }

    // Always show at least 2 insights
    if (insights.length < 2) {
      insights.push({
        type: 'info',
        icon: '📊',
        title: 'Consistent Performance',
        text: 'Metrics are stable. Continue monitoring for any significant changes.'
      })
    }

    return insights.slice(0, 3)
  }

  const insights = getInsights()

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
              <h1 className="text-2xl font-bold">{athlete.name}</h1>
              <p className="text-[#a0a0a0]">{athlete.position}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ScoreCircle score={athlete.score} size="md" label="Today's Score" />
            <StatusBadge status={status} size="lg" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#252525]">
          <p className="text-[#606060] text-sm mb-1">Mood</p>
          <p className="text-xl font-bold">{athlete.mood}</p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#252525]">
          <p className="text-[#606060] text-sm mb-1">Energy</p>
          <p className={`text-xl font-bold ${athlete.energy >= 70 ? 'text-green-400' : athlete.energy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {athlete.energy}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#252525]">
          <p className="text-[#606060] text-sm mb-1">Sleep Quality</p>
          <p className={`text-xl font-bold ${athlete.sleep === 'Great' ? 'text-green-400' : athlete.sleep === 'Good' ? 'text-green-400' : athlete.sleep === 'Fair' ? 'text-yellow-400' : 'text-red-400'}`}>
            {athlete.sleep}
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#252525]">
          <p className="text-[#606060] text-sm mb-1">7-Day Avg</p>
          <p className="text-xl font-bold text-[#ff5c5c]">
            {Math.round(historyData.reduce((sum, d) => sum + d.score, 0) / historyData.length)}
          </p>
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
                />
                <Line
                  type="monotone"
                  dataKey="sleep"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                  name="Sleep"
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
        <div className="space-y-3">
          {recentCheckins.map((checkin, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-[#252525]/50 rounded-xl">
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#606060] w-24">{checkin.date}</span>
                <span className="px-3 py-1 bg-[#1a1a1a] rounded-full text-sm">{checkin.mood}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[#606060]">Energy:</span>
                  <span className="font-medium">{checkin.energy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#606060]">Sleep:</span>
                  <span className="font-medium">{checkin.sleep}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#252525]">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="text-[#ff5c5c]">✨</span> AI Insights
        </h2>
        <div className="space-y-3">
          {insights.map((insight, index) => (
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
