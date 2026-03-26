import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as faceapi from 'face-api.js'
import { athletes as athleteList, coach, generateHistoricalData } from '../data/mockData'
import {
  initializeDatabase,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getAllCheckIns,
  getTodaysCheckIn,
  saveCheckIn as dbSaveCheckIn,
  getStreak,
  getTeamStats,
  getWeeklyTrend,
  getAthleteWithStats,
  getUnreadNotifications,
  markNotificationsRead,
  getCheckInsByAthleteId,
} from '../utils/database'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [modelLoadingProgress, setModelLoadingProgress] = useState(0)
  const [toast, setToast] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = import.meta.env.BASE_URL + 'models'

        setModelLoadingProgress(20)
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)

        setModelLoadingProgress(60)
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)

        setModelLoadingProgress(100)
        setModelsLoaded(true)
        console.log('Face-api models loaded')
      } catch (error) {
        console.error('Error loading face-api models:', error)
        // Continue without face detection
        setModelsLoaded(true)
      }
    }

    loadModels()
  }, [])

  // Initialize database and load user on mount
  useEffect(() => {
    const historicalData = generateHistoricalData()
    initializeDatabase(historicalData)

    const savedUser = getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
    }

    setNotifications(getUnreadNotifications())
    setLoading(false)
  }, [])

  // Handle PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show install prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 5000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!deferredPrompt) return false

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    setDeferredPrompt(null)
    setShowInstallPrompt(false)

    return outcome === 'accepted'
  }, [deferredPrompt])

  const dismissInstallPrompt = useCallback(() => {
    setShowInstallPrompt(false)
  }, [])

  // Login functions
  const loginAsAthlete = useCallback((athleteId) => {
    const athlete = athleteList.find(a => a.id === athleteId)
    if (athlete) {
      const userData = { type: 'athlete', ...athlete }
      setUser(userData)
      setCurrentUser(userData)
      vibrate()
      return true
    }
    return false
  }, [])

  const loginAsCoach = useCallback((teamCode) => {
    if (teamCode === 'EAGLES2024') {
      const userData = { type: 'coach', ...coach }
      setUser(userData)
      setCurrentUser(userData)
      vibrate()
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearCurrentUser()
    vibrate()
  }, [])

  // Check-in functions
  const saveCheckIn = useCallback((checkInData) => {
    const saved = dbSaveCheckIn(checkInData)
    setNotifications(getUnreadNotifications())
    vibrate([100, 50, 100])
    return saved
  }, [])

  const getMyTodaysCheckIn = useCallback(() => {
    if (user?.type === 'athlete') {
      return getTodaysCheckIn(user.id)
    }
    return null
  }, [user])

  const getMyStreak = useCallback(() => {
    if (user?.type === 'athlete') {
      return getStreak(user.id)
    }
    return 0
  }, [user])

  // Toast notifications
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    vibrate(50)
    setTimeout(() => setToast(null), 3000)
  }, [])

  // Haptic feedback
  const vibrate = useCallback((pattern = 50) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  // Mark notifications as read
  const clearNotifications = useCallback(() => {
    markNotificationsRead()
    setNotifications([])
  }, [])

  // Refresh notifications
  const refreshNotifications = useCallback(() => {
    setNotifications(getUnreadNotifications())
  }, [])

  const value = {
    // User state
    user,
    isAuthenticated: !!user,
    isAthlete: user?.type === 'athlete',
    isCoach: user?.type === 'coach',
    loading,

    // Model loading state
    modelsLoaded,
    modelLoadingProgress,

    // Auth functions
    loginAsAthlete,
    loginAsCoach,
    logout,

    // Data
    athletes: athleteList,
    coach,

    // Check-in functions
    saveCheckIn,
    getMyTodaysCheckIn,
    getMyStreak,

    // Toast
    toast,
    showToast,

    // Haptic feedback
    vibrate,

    // Notifications
    notifications,
    clearNotifications,
    refreshNotifications,

    // PWA Install
    showInstallPrompt,
    installPWA,
    dismissInstallPrompt,

    // Database utilities
    getTeamStats,
    getWeeklyTrend,
    getAthleteWithStats,
    getAllCheckIns,
    getCheckInsByAthleteId,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
