import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as faceapi from 'face-api.js'
import { useApp } from '../../context/AppContext'
import { moods, sleepOptions, generateInsights } from '../../data/mockData'
import ScoreCircle from '../../components/ScoreCircle'

const EMOTION_SCORES = {
  happy: 95,
  surprised: 80,
  neutral: 60,
  sad: 35,
  angry: 25,
  fearful: 25,
  disgusted: 30,
}

export default function AthleteCheckIn() {
  const { user, saveCheckIn, showToast, modelsLoaded, vibrate } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [selectedMood, setSelectedMood] = useState(null)
  const [energy, setEnergy] = useState(50)
  const [selectedSleep, setSelectedSleep] = useState(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [facialScore, setFacialScore] = useState(0)
  const [detectedEmotion, setDetectedEmotion] = useState(null)
  const [scanComplete, setScanComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [insights, setInsights] = useState([])
  const [cameraError, setCameraError] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const detectionIntervalRef = useRef(null)

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
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream

        // Start face detection loop
        videoRef.current.onloadedmetadata = () => {
          startFaceDetection()
        }
      }
      setCameraError(false)
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError(true)
    }
  }

  const stopCamera = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const startFaceDetection = () => {
    if (!modelsLoaded || !videoRef.current) return

    detectionIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || countdown !== null) return

      try {
        const detections = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions()

        setFaceDetected(!!detections)
      } catch (err) {
        console.error('Face detection error:', err)
      }
    }, 200)
  }

  const startCountdown = useCallback(() => {
    vibrate(50)
    setCountdown(3)

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          captureAndAnalyze()
          return null
        }
        vibrate(50)
        return prev - 1
      })
    }, 1000)
  }, [vibrate])

  const captureAndAnalyze = async () => {
    setIsAnalyzing(true)
    vibrate([50, 100, 50])

    if (!modelsLoaded || !videoRef.current) {
      // Fallback if models not loaded
      simulateAnalysis()
      return
    }

    try {
      // Run final detection with expressions
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions()

      if (detections) {
        const expressions = detections.expressions
        let totalScore = 0
        let totalWeight = 0
        let dominantEmotion = 'neutral'
        let maxProbability = 0

        // Calculate weighted score from all emotions
        Object.entries(expressions).forEach(([emotion, probability]) => {
          if (EMOTION_SCORES[emotion]) {
            totalScore += EMOTION_SCORES[emotion] * probability
            totalWeight += probability

            if (probability > maxProbability) {
              maxProbability = probability
              dominantEmotion = emotion
            }
          }
        })

        const calculatedScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 60
        setFacialScore(calculatedScore)
        setDetectedEmotion(dominantEmotion)
      } else {
        // No face detected, use neutral score
        setFacialScore(60)
        setDetectedEmotion('neutral')
      }
    } catch (err) {
      console.error('Analysis error:', err)
      simulateAnalysis()
      return
    }

    // Short delay for UX
    setTimeout(() => {
      setIsAnalyzing(false)
      setScanComplete(true)
      stopCamera()
      vibrate([100, 50, 100])
    }, 1500)
  }

  const simulateAnalysis = () => {
    // Fallback simulation
    const facial = Math.floor(Math.random() * 41) + 50
    setFacialScore(facial)
    setDetectedEmotion(facial >= 70 ? 'happy' : facial >= 50 ? 'neutral' : 'sad')

    setTimeout(() => {
      setIsAnalyzing(false)
      setScanComplete(true)
      stopCamera()
      vibrate([100, 50, 100])
    }, 1500)
  }

  const handleSkipScan = () => {
    setFacialScore(60)
    setDetectedEmotion('neutral')
    setScanComplete(true)
    stopCamera()
  }

  const calculateScore = () => {
    const moodValue = selectedMood?.value || 50
    const sleepValue = selectedSleep?.value || 50
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

    const checkIn = {
      id: `${user.id}-${new Date().toISOString().split('T')[0]}`,
      athleteId: user.id,
      timestamp: new Date().toISOString(),
      mood: selectedMood,
      energy,
      sleep: selectedSleep,
      facialScore,
      detectedEmotion,
      score: finalScore,
      insights: generatedInsights,
    }
    saveCheckIn(checkIn)
    showToast('Check-in complete!', 'success')
    vibrate([100, 50, 200])

    setStep(5)
  }

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      happy: '😊',
      surprised: '😮',
      neutral: '😐',
      sad: '😢',
      angry: '😠',
      fearful: '😨',
      disgusted: '🤢',
    }
    return emojis[emotion] || '😐'
  }

  const handleDone = () => {
    navigate('/athlete')
  }

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    vibrate(30)
  }

  const handleSleepSelect = (option) => {
    setSelectedSleep(option)
    vibrate(30)
  }

  const nextStep = () => {
    vibrate(30)
    setStep(step + 1)
  }

  const prevStep = () => {
    vibrate(30)
    setStep(step - 1)
  }

  // Results Screen
  if (step === 5) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col px-4 py-6 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#00ff88]/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="font-display text-4xl mb-2">CHECK-IN COMPLETE</h1>
          <p className="text-[#9ca3af]">Here's your readiness score</p>
        </div>

        <div className="glass-card p-8 mb-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-center mb-6">
            <ScoreCircle score={score} size="lg" animated />
          </div>
          <p className="text-center text-[#9ca3af]">
            {score >= 70 ? "You're ready to perform!" : score >= 50 ? "Moderate readiness today" : "Take it easy today"}
          </p>

          {/* Detected emotion */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-[#6b7280] mb-2">Detected Emotion</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl">{getEmotionEmoji(detectedEmotion)}</span>
              <span className="text-lg capitalize">{detectedEmotion}</span>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-[#6b7280] text-center mb-4">Score Breakdown</p>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div className="animate-fade-in stagger-1">
                <p className="text-[#ff4757] font-bold text-lg">{selectedMood?.value}</p>
                <p className="text-xs text-[#6b7280]">Mood</p>
              </div>
              <div className="animate-fade-in stagger-2">
                <p className="text-[#ff4757] font-bold text-lg">{energy}</p>
                <p className="text-xs text-[#6b7280]">Energy</p>
              </div>
              <div className="animate-fade-in stagger-3">
                <p className="text-[#ff4757] font-bold text-lg">{selectedSleep?.value}</p>
                <p className="text-xs text-[#6b7280]">Sleep</p>
              </div>
              <div className="animate-fade-in stagger-4">
                <p className="text-[#ff4757] font-bold text-lg">{facialScore}</p>
                <p className="text-xs text-[#6b7280]">Scan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="p-4 border-b border-white/10">
            <h2 className="font-semibold flex items-center gap-2">
              <span className="text-[#ff4757]">✨</span> AI Insights
            </h2>
          </div>
          <div className="divide-y divide-white/10">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 animate-fade-in stagger-${index + 1}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{insight.icon}</span>
                  <div>
                    <p className="font-medium mb-1">{insight.title}</p>
                    <p className="text-sm text-[#9ca3af]">{insight.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleDone}
            className="w-full py-4 bg-gradient-to-r from-[#ff4757] to-[#ff6b81] rounded-2xl font-semibold text-lg btn-press"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col px-4 py-6">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              s <= step ? 'bg-gradient-to-r from-[#ff4757] to-[#ff6b81]' : 'bg-[#1a1a24]'
            }`}
          />
        ))}
      </div>

      {/* Step 1: Mood */}
      {step === 1 && (
        <div className="flex-1 flex flex-col animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl mb-2">HOW ARE YOU FEELING?</h2>
            <p className="text-[#9ca3af]">Select your current mood</p>
          </div>

          <div className="space-y-3 flex-1">
            {moods.map((mood, index) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all btn-press animate-fade-in stagger-${index + 1} ${
                  selectedMood?.id === mood.id
                    ? 'bg-[#ff4757]/20 border-[#ff4757] shadow-lg shadow-[#ff4757]/20'
                    : 'glass-card border-transparent hover:border-white/20'
                }`}
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className="font-semibold text-lg">{mood.label}</span>
                {selectedMood?.id === mood.id && (
                  <div className="ml-auto w-6 h-6 bg-[#ff4757] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={!selectedMood}
            className="mt-6 w-full py-4 bg-gradient-to-r from-[#ff4757] to-[#ff6b81] disabled:from-[#1a1a24] disabled:to-[#1a1a24] disabled:text-[#6b7280] rounded-2xl font-semibold text-lg btn-press transition-all"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Energy */}
      {step === 2 && (
        <div className="flex-1 flex flex-col animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl mb-2">ENERGY LEVEL</h2>
            <p className="text-[#9ca3af]">How energized do you feel?</p>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="glass-card p-8 rounded-3xl">
              <div className="text-center mb-8">
                <span className="font-display text-8xl gradient-text">{energy}</span>
                <p className="text-[#6b7280] mt-2 text-lg">
                  {energy < 30 ? 'Very Low' : energy < 50 ? 'Low' : energy < 70 ? 'Moderate' : energy < 90 ? 'High' : 'Very High'}
                </p>
              </div>

              <div className="relative">
                <div
                  className="absolute h-4 rounded-full bg-gradient-to-r from-[#ff4757] to-[#00ff88] top-1/2 -translate-y-1/2 left-0 transition-all"
                  style={{ width: `${energy}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={energy}
                  onChange={(e) => {
                    setEnergy(parseInt(e.target.value))
                    vibrate(10)
                  }}
                  className="relative z-10 w-full"
                />
              </div>
              <div className="flex justify-between mt-3 text-sm text-[#6b7280]">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={prevStep}
              className="flex-1 py-4 glass-card rounded-2xl font-semibold btn-press"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex-1 py-4 bg-gradient-to-r from-[#ff4757] to-[#ff6b81] rounded-2xl font-semibold btn-press"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Sleep */}
      {step === 3 && (
        <div className="flex-1 flex flex-col animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl mb-2">SLEEP QUALITY</h2>
            <p className="text-[#9ca3af]">How did you sleep last night?</p>
          </div>

          <div className="grid grid-cols-2 gap-4 flex-1 content-center">
            {sleepOptions.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleSleepSelect(option)}
                className={`p-6 rounded-2xl border-2 text-center transition-all btn-press animate-fade-in stagger-${index + 1} ${
                  selectedSleep?.id === option.id
                    ? 'bg-[#ff4757]/20 border-[#ff4757] shadow-lg shadow-[#ff4757]/20'
                    : 'glass-card border-transparent hover:border-white/20'
                }`}
              >
                <p className="text-3xl mb-2">
                  {option.id === 'poor' ? '😴' : option.id === 'fair' ? '🌙' : option.id === 'good' ? '⭐' : '🌟'}
                </p>
                <p className="font-semibold text-lg mb-1">{option.label}</p>
                <p className="text-sm text-[#6b7280]">{option.sublabel}</p>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={prevStep}
              className="flex-1 py-4 glass-card rounded-2xl font-semibold btn-press"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!selectedSleep}
              className="flex-1 py-4 bg-gradient-to-r from-[#ff4757] to-[#ff6b81] disabled:from-[#1a1a24] disabled:to-[#1a1a24] disabled:text-[#6b7280] rounded-2xl font-semibold btn-press transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Facial Scan */}
      {step === 4 && (
        <div className="flex-1 flex flex-col animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="font-display text-4xl mb-2">FACIAL SCAN</h2>
            <p className="text-[#9ca3af]">AI emotion analysis</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden glass-card">
              {!cameraError && !scanComplete && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />

              {/* Face guide overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-48 h-64 border-4 rounded-[50%] transition-all duration-300 ${
                  scanComplete ? 'border-[#00ff88] shadow-[0_0_30px_rgba(0,255,136,0.5)]' :
                  faceDetected ? 'border-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.3)]' :
                  'border-[#ff4757]/50'
                }`}>
                  {isAnalyzing && (
                    <div className="absolute inset-0 border-4 border-[#00d4ff] rounded-[50%] animate-ping" />
                  )}
                </div>
              </div>

              {/* Scanning line */}
              {isAnalyzing && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent animate-scan-line" />
              )}

              {/* Countdown */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="font-display text-9xl text-white animate-countdown">{countdown}</span>
                </div>
              )}

              {/* Status */}
              <div className="absolute bottom-6 inset-x-0 text-center">
                {cameraError ? (
                  <span className="bg-[#ffd93d]/20 text-[#ffd93d] px-4 py-2 rounded-full text-sm">
                    Camera unavailable
                  </span>
                ) : isAnalyzing ? (
                  <span className="bg-[#00d4ff]/20 text-[#00d4ff] px-4 py-2 rounded-full text-sm flex items-center justify-center gap-2 mx-auto w-fit">
                    <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse" />
                    Analyzing...
                  </span>
                ) : scanComplete ? (
                  <span className="bg-[#00ff88]/20 text-[#00ff88] px-4 py-2 rounded-full text-sm">
                    ✓ Analysis Complete
                  </span>
                ) : faceDetected ? (
                  <span className="bg-[#00ff88]/20 text-[#00ff88] px-4 py-2 rounded-full text-sm">
                    Face detected! Tap capture
                  </span>
                ) : (
                  <span className="bg-white/10 text-white/60 px-4 py-2 rounded-full text-sm">
                    Position your face in the circle
                  </span>
                )}
              </div>
            </div>

            {/* Privacy note */}
            <div className="flex items-center gap-2 mt-4 text-sm text-[#6b7280]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your image is never stored</span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                stopCamera()
                prevStep()
              }}
              className="flex-1 py-4 glass-card rounded-2xl font-semibold btn-press"
            >
              Back
            </button>
            {!scanComplete ? (
              <button
                onClick={cameraError ? handleSkipScan : (faceDetected ? startCountdown : undefined)}
                disabled={!cameraError && !faceDetected}
                className="flex-1 py-4 bg-gradient-to-r from-[#ff4757] to-[#ff6b81] disabled:from-[#1a1a24] disabled:to-[#1a1a24] disabled:text-[#6b7280] rounded-2xl font-semibold btn-press transition-all"
              >
                {cameraError ? 'Skip Scan' : isAnalyzing ? 'Analyzing...' : 'Capture'}
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex-1 py-4 bg-gradient-to-r from-[#00ff88] to-[#00d4ff] rounded-2xl font-semibold text-black btn-press"
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
