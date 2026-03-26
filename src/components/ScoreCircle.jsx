import { useState, useEffect } from 'react'

export default function ScoreCircle({ score, size = 'md', label, animated = false }) {
  const [displayScore, setDisplayScore] = useState(0)
  const [animatedOffset, setAnimatedOffset] = useState(440)
  const hasScore = score !== null && score !== undefined

  const getColor = (s) => {
    if (!hasScore) return { stroke: '#1a1a24', text: 'text-[#6b7280]', glow: 'transparent' }
    if (s >= 70) return { stroke: '#00ff88', text: 'text-[#00ff88]', glow: 'rgba(0, 255, 136, 0.3)' }
    if (s >= 50) return { stroke: '#ffd93d', text: 'text-[#ffd93d]', glow: 'rgba(255, 217, 61, 0.3)' }
    return { stroke: '#ff4757', text: 'text-[#ff4757]', glow: 'rgba(255, 71, 87, 0.3)' }
  }

  const sizeConfig = {
    sm: { width: 70, strokeWidth: 5, fontSize: 'text-xl' },
    md: { width: 110, strokeWidth: 7, fontSize: 'text-3xl' },
    lg: { width: 160, strokeWidth: 10, fontSize: 'text-5xl' }
  }

  const config = sizeConfig[size]
  const color = getColor(hasScore ? score : 0)
  const radius = (config.width - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset = ((100 - (hasScore ? score : 0)) / 100) * circumference

  // Animate on mount if animated prop is true
  useEffect(() => {
    if (animated && hasScore) {
      // Animate score count
      const duration = 1000
      const startTime = Date.now()
      const startScore = 0

      const animateCount = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3)

        setDisplayScore(Math.round(startScore + (score - startScore) * easeProgress))

        if (progress < 1) {
          requestAnimationFrame(animateCount)
        }
      }

      // Animate circle
      setAnimatedOffset(circumference)
      requestAnimationFrame(() => {
        setTimeout(() => {
          setAnimatedOffset(targetOffset)
        }, 50)
      })

      animateCount()
    } else {
      setDisplayScore(hasScore ? score : 0)
      setAnimatedOffset(targetOffset)
    }
  }, [score, animated, hasScore, circumference, targetOffset])

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative"
        style={{
          width: config.width,
          height: config.width,
          filter: hasScore ? `drop-shadow(0 0 20px ${color.glow})` : 'none'
        }}
      >
        <svg
          className="transform -rotate-90"
          width={config.width}
          height={config.width}
        >
          {/* Background circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke="#1a1a24"
            strokeWidth={config.strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? animatedOffset : targetOffset}
            style={{
              transition: animated ? 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-display ${config.fontSize} ${color.text}`}>
            {hasScore ? displayScore : '--'}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-sm text-[#9ca3af]">{label}</span>
      )}
    </div>
  )
}
