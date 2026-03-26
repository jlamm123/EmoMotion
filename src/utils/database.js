// LocalStorage database utilities for EmoMotion

const STORAGE_KEYS = {
  CHECK_INS: 'emomotion_checkins',
  CURRENT_USER: 'emomotion_user',
  NOTIFICATIONS: 'emomotion_notifications',
  INITIALIZED: 'emomotion_initialized',
}

// Initialize database with mock historical data
export function initializeDatabase(historicalData) {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)

  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(historicalData))
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
    return true
  }
  return false
}

// Reset database (for testing)
export function resetDatabase(historicalData) {
  localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(historicalData))
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]))
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
}

// Check-ins CRUD operations
export function getAllCheckIns() {
  const data = localStorage.getItem(STORAGE_KEYS.CHECK_INS)
  return data ? JSON.parse(data) : []
}

export function getCheckInsByAthleteId(athleteId) {
  const checkIns = getAllCheckIns()
  return checkIns
    .filter(c => c.athleteId === athleteId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

export function getTodaysCheckIn(athleteId) {
  const today = new Date().toISOString().split('T')[0]
  const checkIns = getAllCheckIns()
  return checkIns.find(c =>
    c.athleteId === athleteId &&
    c.timestamp.startsWith(today)
  )
}

export function getTodaysCheckIns() {
  const today = new Date().toISOString().split('T')[0]
  const checkIns = getAllCheckIns()
  return checkIns.filter(c => c.timestamp.startsWith(today))
}

export function saveCheckIn(checkIn) {
  const checkIns = getAllCheckIns()

  // Remove any existing check-in for this athlete today
  const today = new Date().toISOString().split('T')[0]
  const filtered = checkIns.filter(c =>
    !(c.athleteId === checkIn.athleteId && c.timestamp.startsWith(today))
  )

  filtered.push(checkIn)
  localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(filtered))

  // Add notification
  addNotification({
    id: Date.now(),
    type: 'checkin',
    athleteId: checkIn.athleteId,
    message: 'completed their check-in',
    timestamp: new Date().toISOString(),
    read: false,
  })

  return checkIn
}

// Get last N days of check-ins for an athlete
export function getRecentCheckIns(athleteId, days = 7) {
  const checkIns = getCheckInsByAthleteId(athleteId)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  return checkIns.filter(c => new Date(c.timestamp) >= cutoff)
}

// Calculate streak for an athlete
export function getStreak(athleteId) {
  const checkIns = getCheckInsByAthleteId(athleteId)
  if (checkIns.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if today has a check-in
  const todayStr = today.toISOString().split('T')[0]
  const hasToday = checkIns.some(c => c.timestamp.startsWith(todayStr))

  if (hasToday) {
    streak = 1
    let checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - 1)

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0]
      const hasCheckIn = checkIns.some(c => c.timestamp.startsWith(dateStr))
      if (hasCheckIn) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
  }

  return streak
}

// User session management
export function getCurrentUser() {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return data ? JSON.parse(data) : null
}

export function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
}

// Notifications
export function getNotifications() {
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
  return data ? JSON.parse(data) : []
}

export function getUnreadNotifications() {
  return getNotifications().filter(n => !n.read)
}

export function addNotification(notification) {
  const notifications = getNotifications()
  notifications.unshift(notification)
  // Keep only last 50 notifications
  const trimmed = notifications.slice(0, 50)
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(trimmed))
}

export function markNotificationsRead() {
  const notifications = getNotifications()
  const updated = notifications.map(n => ({ ...n, read: true }))
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated))
}

// Team statistics
export function getTeamStats() {
  const todaysCheckIns = getTodaysCheckIns()
  const allCheckIns = getAllCheckIns()

  if (todaysCheckIns.length === 0) {
    return {
      teamAverage: 0,
      checkedInCount: 0,
      alertCount: 0,
      watchCount: 0,
    }
  }

  const teamAverage = Math.round(
    todaysCheckIns.reduce((sum, c) => sum + c.score, 0) / todaysCheckIns.length
  )

  const alertCount = todaysCheckIns.filter(c => c.score < 50).length
  const watchCount = todaysCheckIns.filter(c => c.score >= 50 && c.score < 70).length

  return {
    teamAverage,
    checkedInCount: todaysCheckIns.length,
    alertCount,
    watchCount,
  }
}

// Get 7-day trend data for team
export function getWeeklyTrend() {
  const checkIns = getAllCheckIns()
  const trend = []
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const dayCheckIns = checkIns.filter(c => c.timestamp.startsWith(dateStr))
    const avgScore = dayCheckIns.length > 0
      ? Math.round(dayCheckIns.reduce((sum, c) => sum + c.score, 0) / dayCheckIns.length)
      : null

    trend.push({
      day: days[date.getDay()],
      date: dateStr,
      score: avgScore,
      count: dayCheckIns.length,
    })
  }

  return trend
}

// Get athlete with their latest check-in data
export function getAthleteWithStats(athlete) {
  const todayCheckIn = getTodaysCheckIn(athlete.id)
  const recentCheckIns = getRecentCheckIns(athlete.id, 7)
  const streak = getStreak(athlete.id)

  const weeklyAvg = recentCheckIns.length > 0
    ? Math.round(recentCheckIns.reduce((sum, c) => sum + c.score, 0) / recentCheckIns.length)
    : null

  return {
    ...athlete,
    todayCheckIn,
    hasCheckedInToday: !!todayCheckIn,
    score: todayCheckIn?.score || null,
    weeklyAvg,
    streak,
    recentCheckIns,
  }
}
