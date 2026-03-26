import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { moods, sleepOptions, generateInsights } from '../../data/mockData'
import ScoreCircle from '../../components/ScoreCircle'

export default function AthleteCheckIn() {
  const { user, saveCheckIn, showToast } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1: mood, 2: energy, 3: sleep, 4: scan, 5: results
  const [selectedMood, setSelectedMood] = useState(null)
  const [energy, setEnergy] = useState(50)
  const [selectedSleep, setSelectedSleep] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [facialScore, setFacialScore] = useState(0)
  const [score, setScore] = useState(0)
  const [insights, setInsights] = useState([])
  const [cameraError, setCameraError] = useState(false)
  const [photoTaken, setPhotoTaken] = useState(false)

  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const totalSteps = 4

  // Start camera when on scan step
  useEffect(() => {
    if (step === 4 && !scanComplete) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [step, scanComplete])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      setCameraError(false)
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError(true)
      // Auto-proceed without camera
      setTimeout(() => {
        simulateScan()
      }, 1000)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const capturePhoto = () => {
    setPhotoTaken(true)
    setIsScanning(true)

    // Simulate facial analysis
    setTimeout(() => {
      simulateScan()
    }, 2500)
  }

  const simulateScan = () => {
    // Generate random facial score between 50-90
    const facial = Math.floor(Math.random() * 41) + 50
    setFacialScore(facial)
    setIsScanning(false)
    setScanComplete(true)
    stopCamera()
  }

  const calculateScore = () => {
    const moodValue = selectedMood?.value || 50
    const sleepValue = selectedSleep?.value || 50
    // Score = (mood * 0.30) + (energy * 0.25) + (sleep * 0.20) + (facial * 0.25)
    return Math.round(
      (moodValue * 0.30) +
      (energy * 0.25) +
      (sleepValue * 0.20) +
      (facialScore * 0.25)
    )
  }

  const handleComplete = () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    const generatedInsights = generateInsights(
      selectedMood?.value || 50,
      energy,
      selectedSleep?.value || 50
    )
    setInsights(generatedInsights)

    // Save check-in to database
    const checkIn = {
      id: `${user.id}-${new Date().toISOString().split('T')[0]}`,
      athleteId: user.id,
      timestamp: new Date().toISOString(),
      mood: selectedMood,
      energy,
      sleep: selectedSleep,
      facialScore,
      score: finalScore,
      insights: generatedInsights,
    }
    saveCheckIn(checkIn)
    showToast('Check-in complete!', 'success')

    setStep(5)
  }

  const handleDone = () => {
    navigate('/athlete')
  }

  // Results Screen
  if (step === 5) {
    return (
      <div className="max-w-md mx-auto py-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✅</span>
          </div>
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

          {/* Score breakdown */}
          <div className="mt-6 pt-6 border-t border-[#252525]">
            <p className="text-xs text-[#606060] text-center mb-4">Score Breakdown</p>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div>
                <p className="text-[#ff5c5c] font-bold">{selectedMood?.value}</p>
                <p className="text-xs text-[#606060]">Mood</p>
              </div>
              <div>
                <p className="text-[#ff5c5c] font-bold">{energy}</p>
                <p className="text-xs text-[#606060]">Energy</p>
              </div>
              <div>
                <p className="text-[#ff5c5c] font-bold">{selectedSleep?.value}</p>
                <p className="text-xs text-[#606060]">Sleep</p>
              </div>
              <div>
                <p className="text-[#ff5c5c] font-bold">{facialScore}</p>
                <p className="text-xs text-[#606060]">Scan</p>
              </div>
            </div>
          </div>
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
          onClick={handleDone}
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
            {/* Camera / Scan Area */}
            <div className="aspect-[4/3] bg-[#0a0a0a] relative flex items-center justify-center overflow-hidden">
              {!cameraError && !scanComplete && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Face outline overlay */}
              <div className="absolute inset-4 border-2 border-dashed border-[#404040] rounded-xl pointer-events-none" />

              {/* Face guide */}
              <div className={`w-32 h-40 border-2 rounded-[50%] relative z-10 ${
                scanComplete ? 'border-green-500' : isScanning ? 'border-[#ff5c5c] animate-pulse' : 'border-[#ff5c5c]/50'
              }`}>
                {isScanning && (
                  <div className="absolute inset-0 border-2 border-[#ff5c5c] rounded-[50%] animate-ping" />
                )}
              </div>

              {/* Scanning line animation */}
              {isScanning && (
                <div
                  className="absolute inset-x-8 h-1 bg-gradient-to-r from-transparent via-[#ff5c5c] to-transparent animate-bounce z-20"
                  style={{ top: '50%' }}
                />
              )}

              {/* Status text */}
              <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                {cameraError ? (
                  <span className="text-yellow-400 bg-black/50 px-3 py-1 rounded">Camera unavailable - using simulation</span>
                ) : isScanning ? (
                  <div className="flex items-center justify-center gap-2 bg-black/50 mx-auto w-fit px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-[#ff5c5c] rounded-full animate-pulse" />
                    <span className="text-[#ff5c5c]">Analyzing...</span>
                  </div>
                ) : scanComplete ? (
                  <span className="text-green-400 bg-black/50 px-3 py-1 rounded">✓ Analysis Complete</span>
                ) : (
                  <span className="text-[#a0a0a0] bg-black/50 px-3 py-1 rounded">Position your face in the frame</span>
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
                stopCamera()
                setIsScanning(false)
                setScanComplete(false)
                setPhotoTaken(false)
                setStep(3)
              }}
              className="flex-1 py-4 bg-[#252525] hover:bg-[#303030] rounded-xl font-semibold transition-colors"
            >
              Back
            </button>
            {!scanComplete ? (
              <button
                onClick={capturePhoto}
                disabled={isScanning}
                className="flex-1 py-4 bg-[#ff5c5c] hover:bg-[#ff7a7a] disabled:bg-[#252525] disabled:text-[#606060] rounded-xl font-semibold transition-colors"
              >
                {isScanning ? 'Analyzing...' : 'Capture & Analyze'}
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex-1 py-4 bg-[#ff5c5c] hover:bg-[#ff7a7a] rounded-xl font-semibold transition-colors"
              >
                See Results
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
