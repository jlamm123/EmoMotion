import { useState, useEffect } from 'react'
import ScoreCircle from '../../components/ScoreCircle'

const moods = [
  { id: 'rough', label: 'Rough', emoji: '😫', value: 20 },
  { id: 'low', label: 'Low', emoji: '😔', value: 40 },
  { id: 'okay', label: 'Okay', emoji: '😐', value: 60 },
  { id: 'good', label: 'Good', emoji: '😊', value: 80 },
  { id: 'locked', label: 'Locked In', emoji: '🔥', value: 100 },
]

const sleepOptions = [
  { id: 'poor', label: 'Poor', sublabel: '< 5 hrs', value: 25 },
  { id: 'fair', label: 'Fair', sublabel: '5-6 hrs', value: 50 },
  { id: 'good', label: 'Good', sublabel: '7-8 hrs', value: 75 },
  { id: 'great', label: 'Great', sublabel: '8+ hrs', value: 100 },
]

const generateInsights = (mood, energy, sleep) => {
  const insights = []

  if (energy < 40) {
    insights.push({
      icon: '⚡',
      title: 'Low Energy Detected',
      text: 'Consider light stretching or a short walk to boost your energy before practice.',
    })
  } else if (energy >= 70) {
    insights.push({
      icon: '💪',
      title: 'High Energy Today',
      text: "You're primed for high-intensity training. Make the most of this energy!",
    })
  }

  if (sleep < 50) {
    insights.push({
      icon: '😴',
      title: 'Sleep Recovery Needed',
      text: 'Poor sleep affects reaction time by 20%. Focus on rest tonight.',
    })
  } else if (sleep >= 75) {
    insights.push({
      icon: '✨',
      title: 'Well Rested',
      text: 'Great sleep quality! Your cognitive performance should be at its peak.',
    })
  }

  if (mood >= 80) {
    insights.push({
      icon: '🎯',
      title: 'Peak Mental State',
      text: "You're in an optimal mindset for learning new skills and techniques.",
    })
  } else if (mood <= 40) {
    insights.push({
      icon: '🧠',
      title: 'Mental Check-in',
      text: 'Consider talking to a coach or teammate. Connection helps performance.',
    })
  }

  // Always have at least 3 insights
  const defaultInsights = [
    { icon: '📊', title: 'Consistency Matters', text: 'Daily check-ins help identify patterns and optimize your training.' },
    { icon: '🏃', title: 'Active Recovery', text: 'Light movement on rest days can improve next-day performance by 15%.' },
    { icon: '💧', title: 'Stay Hydrated', text: 'Even 2% dehydration can reduce athletic performance significantly.' },
  ]

  while (insights.length < 3) {
    const remaining = defaultInsights.filter(d => !insights.find(i => i.title === d.title))
    if (remaining.length > 0) {
      insights.push(remaining[Math.floor(Math.random() * remaining.length)])
    } else {
      break
    }
  }

  return insights.slice(0, 3)
}

export default function AthleteCheckIn() {
  const [step, setStep] = useState(0) // 0: welcome, 1: mood, 2: energy, 3: sleep, 4: scan, 5: results
  const [selectedMood, setSelectedMood] = useState(null)
  const [energy, setEnergy] = useState(50)
  const [selectedSleep, setSelectedSleep] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [insights, setInsights] = useState([])

  const totalSteps = 5

  useEffect(() => {
    if (step === 4 && !isScanning && !scanComplete) {
      setIsScanning(true)
      // Simulate facial scan
      setTimeout(() => {
        setIsScanning(false)
        setScanComplete(true)
      }, 3000)
    }
  }, [step, isScanning, scanComplete])

  const calculateScore = () => {
    const moodValue = selectedMood?.value || 50
    const sleepValue = selectedSleep?.value || 50
    return Math.round((moodValue * 0.35) + (energy * 0.35) + (sleepValue * 0.3))
  }

  const handleComplete = () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setInsights(generateInsights(selectedMood?.value || 50, energy, selectedSleep?.value || 50))
    setStep(5)
  }

  const resetCheckin = () => {
    setStep(0)
    setSelectedMood(null)
    setEnergy(50)
    setSelectedSleep(null)
    setIsScanning(false)
    setScanComplete(false)
    setScore(0)
    setInsights([])
  }

  // Welcome Screen
  if (step === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="mb-8">
          <div className="w-20 h-20 bg-[#ff5c5c] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🎯</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">Daily Check-in</h1>
          <p className="text-[#a0a0a0] text-lg">
            Take 60 seconds to log how you're feeling today
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#252525] mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#ff5c5c]">5</p>
              <p className="text-xs text-[#606060]">Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#ff5c5c]">60s</p>
              <p className="text-xs text-[#606060]">To Complete</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#ff5c5c]">AI</p>
              <p className="text-xs text-[#606060]">Insights</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStep(1)}
          className="w-full py-4 bg-[#ff5c5c] hover:bg-[#ff7a7a] rounded-xl font-semibold text-lg transition-colors"
        >
          Start Check-in
        </button>
      </div>
    )
  }

  // Results Screen
  if (step === 5) {
    return (
      <div className="max-w-md mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Check-in Complete!</h1>
          <p className="text-[#a0a0a0]">Here's your readiness score for today</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#252525] mb-6">
          <div className="flex justify-center mb-6">
            <ScoreCircle score={score} size="lg" />
          </div>
          <p className="text-center text-[#a0a0a0]">
            {score >= 70 ? "You're ready to perform!" : score >= 50 ? "Moderate readiness today" : "Take it easy today"}
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] overflow-hidden mb-6">
          <div className="p-4 border-b border-[#252525]">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="text-[#ff5c5c]">✨</span> AI Insights
            </h2>
          </div>
          <div className="divide-y divide-[#252525]">
            {insights.map((insight, index) => (
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

        <button
          onClick={resetCheckin}
          className="w-full py-4 bg-[#ff5c5c] hover:bg-[#ff7a7a] rounded-xl font-semibold transition-colors"
        >
          Done
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s <= step ? 'bg-[#ff5c5c]' : 'bg-[#252525]'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Mood */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">How are you feeling?</h2>
            <p className="text-[#a0a0a0]">Select your current mood</p>
          </div>

          <div className="space-y-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood)}
                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${
                  selectedMood?.id === mood.id
                    ? 'bg-[#ff5c5c]/20 border-[#ff5c5c]'
                    : 'bg-[#1a1a1a] border-[#252525] hover:border-[#404040]'
                }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="font-medium text-lg">{mood.label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!selectedMood}
            className="w-full py-4 bg-[#ff5c5c] hover:bg-[#ff7a7a] disabled:bg-[#252525] disabled:text-[#606060] rounded-xl font-semibold transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Energy */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Energy Level</h2>
            <p className="text-[#a0a0a0]">How energized do you feel right now?</p>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#252525]">
            <div className="text-center mb-6">
              <span className="text-6xl font-bold text-[#ff5c5c]">{energy}</span>
              <p className="text-[#606060] mt-2">
                {energy < 30 ? 'Very Low' : energy < 50 ? 'Low' : energy < 70 ? 'Moderate' : energy < 90 ? 'High' : 'Very High'}
              </p>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full h-3 bg-[#252525] rounded-lg appearance-none cursor-pointer accent-[#ff5c5c]"
            />
            <div className="flex justify-between mt-3 text-sm text-[#606060]">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-4 bg-[#252525] hover:bg-[#303030] rounded-xl font-semibold transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-4 bg-[#ff5c5c] hover:bg-[#ff7a7a] rounded-xl font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Sleep */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Sleep Quality</h2>
            <p className="text-[#a0a0a0]">How did you sleep last night?</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {sleepOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedSleep(option)}
                className={`p-5 rounded-xl border text-center transition-all ${
                  selectedSleep?.id === option.id
                    ? 'bg-[#ff5c5c]/20 border-[#ff5c5c]'
                    : 'bg-[#1a1a1a] border-[#252525] hover:border-[#404040]'
                }`}
              >
                <p className="font-semibold text-lg mb-1">{option.label}</p>
                <p className="text-sm text-[#606060]">{option.sublabel}</p>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-4 bg-[#252525] hover:bg-[#303030] rounded-xl font-semibold transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!selectedSleep}
              className="flex-1 py-4 bg-[#ff5c5c] hover:bg-[#ff7a7a] disabled:bg-[#252525] disabled:text-[#606060] rounded-xl font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Facial Scan */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Facial Scan</h2>
            <p className="text-[#a0a0a0]">AI analysis of your emotional state</p>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border border-[#252525] overflow-hidden">
            {/* Webcam placeholder */}
            <div className="aspect-[4/3] bg-[#0a0a0a] relative flex items-center justify-center">
              <div className="absolute inset-4 border-2 border-dashed border-[#404040] rounded-xl" />

              {/* Face outline */}
              <div className="w-32 h-40 border-2 border-[#ff5c5c]/50 rounded-[50%] relative">
                {isScanning && (
                  <div className="absolute inset-0 border-2 border-[#ff5c5c] rounded-[50%] animate-pulse" />
                )}
              </div>

              {/* Scanning line animation */}
              {isScanning && (
                <div className="absolute inset-x-8 h-0.5 bg-gradient-to-r from-transparent via-[#ff5c5c] to-transparent animate-bounce"
                     style={{ top: '50%' }} />
              )}

              {/* Status text */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                {isScanning ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-[#ff5c5c] rounded-full animate-pulse" />
                    <span className="text-[#ff5c5c]">Scanning...</span>
                  </div>
                ) : scanComplete ? (
                  <span className="text-green-400">✓ Scan Complete</span>
                ) : (
                  <span className="text-[#606060]">Position your face in the frame</span>
                )}
              </div>
            </div>

            {/* Scan info */}
            <div className="p-4 border-t border-[#252525]">
              <div className="flex items-center gap-3 text-sm text-[#a0a0a0]">
                <svg className="w-5 h-5 text-[#ff5c5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your data is processed locally and never stored</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsScanning(false)
                setScanComplete(false)
                setStep(3)
              }}
              className="flex-1 py-4 bg-[#252525] hover:bg-[#303030] rounded-xl font-semibold transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={!scanComplete}
              className="flex-1 py-4 bg-[#ff5c5c] hover:bg-[#ff7a7a] disabled:bg-[#252525] disabled:text-[#606060] rounded-xl font-semibold transition-colors"
            >
              {scanComplete ? 'See Results' : 'Scanning...'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
