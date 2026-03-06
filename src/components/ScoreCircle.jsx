export default function ScoreCircle({ score, size = 'md', label }) {
  const getColor = (score) => {
    if (score >= 70) return { stroke: '#22c55e', text: 'text-green-400' }
    if (score >= 40) return { stroke: '#eab308', text: 'text-yellow-400' }
    return { stroke: '#ef4444', text: 'text-red-400' }
  }

  const sizeConfig = {
    sm: { width: 60, strokeWidth: 4, fontSize: 'text-lg' },
    md: { width: 100, strokeWidth: 6, fontSize: 'text-2xl' },
    lg: { width: 140, strokeWidth: 8, fontSize: 'text-4xl' }
  }

  const config = sizeConfig[size]
  const color = getColor(score)
  const radius = (config.width - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = ((100 - score) / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          className="transform -rotate-90"
          width={config.width}
          height={config.width}
        >
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="#252525"
            strokeWidth={config.strokeWidth}
          />
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${config.fontSize} ${color.text}`}>
            {score}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-sm text-[#a0a0a0]">{label}</span>
      )}
    </div>
  )
}
