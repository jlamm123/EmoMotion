import { createContext, useContext, useState, useEffect, useCallback } from 'react'
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
  const [athletes, setAthletes] = useState(athleteList)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [notifications, setNotifications] = useState([])

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

  // Login functions
  const loginAsAthlete = useCallback((athleteId) => {
    const athlete = athleteList.find(a => a.id === athleteId)
    if (athlete) {
      const userData = { type: 'athlete', ...athlete }
      setUser(userData)
      setCurrentUser(userData)
      return true
    }
    return false
  }, [])

  const loginAsCoach = useCallback((teamCode) => {
    if (teamCode === 'EAGLES2024') {
      const userData = { type: 'coach', ...coach }
      setUser(userData)
      setCurrentUser(userData)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    clearCurrentUser()
  }, [])

  // Check-in functions
  const saveCheckIn = useCallback((checkInData) => {
    const saved = dbSaveCheckIn(checkInData)
    // Refresh notifications
    setNotifications(getUnreadNotifications())
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
    setTimeout(() => setToast(null), 3000)
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

    // Notifications
    notifications,
    clearNotifications,
    refreshNotifications,

    // Database utilities (re-exported for convenience)
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
