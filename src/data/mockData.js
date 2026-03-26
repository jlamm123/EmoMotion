// Mock data for EmoMotion MVP

export const TEAM_CODE = 'EAGLES2024'

export const athletes = [
  { id: 1, name: 'Marcus Johnson', position: 'Point Guard', avatar: 'MJ', jerseyNumber: 3 },
  { id: 2, name: 'DeShawn Williams', position: 'Shooting Guard', avatar: 'DW', jerseyNumber: 11 },
  { id: 3, name: 'Tyler Chen', position: 'Small Forward', avatar: 'TC', jerseyNumber: 22 },
  { id: 4, name: 'Jordan Mitchell', position: 'Power Forward', avatar: 'JM', jerseyNumber: 34 },
  { id: 5, name: 'Andre Thompson', position: 'Center', avatar: 'AT', jerseyNumber: 55 },
  { id: 6, name: 'Chris Rodriguez', position: 'Point Guard', avatar: 'CR', jerseyNumber: 7 },
  { id: 7, name: 'Brandon Lee', position: 'Shooting Guard', avatar: 'BL', jerseyNumber: 14 },
  { id: 8, name: 'Isaiah Brown', position: 'Small Forward', avatar: 'IB', jerseyNumber: 21 },
]

export const coach = {
  id: 'coach1',
  name: 'Coach Williams',
  team: 'Eagles Basketball',
}

// Mood mappings
export const moods = [
  { id: 'rough', label: 'Rough', emoji: '😫', value: 20 },
  { id: 'low', label: 'Low', emoji: '😔', value: 40 },
  { id: 'okay', label: 'Okay', emoji: '😐', value: 60 },
  { id: 'good', label: 'Good', emoji: '😊', value: 80 },
  { id: 'locked', label: 'Locked In', emoji: '🔥', value: 100 },
]

// Sleep mappings
export const sleepOptions = [
  { id: 'poor', label: 'Poor', sublabel: '< 5 hrs', value: 25 },
  { id: 'fair', label: 'Fair', sublabel: '5-6 hrs', value: 50 },
  { id: 'good', label: 'Good', sublabel: '7-8 hrs', value: 75 },
  { id: 'great', label: 'Great', sublabel: '8+ hrs', value: 100 },
]

// Generate 7 days of historical check-in data for each athlete
export function generateHistoricalData() {
  const checkIns = []
  const now = new Date()

  athletes.forEach(athlete => {
    // Generate data for past 7 days (not including today)
    for (let daysAgo = 7; daysAgo >= 1; daysAgo--) {
      const date = new Date(now)
      date.setDate(date.getDate() - daysAgo)
      date.setHours(8, 0, 0, 0) // 8 AM check-in

      // Generate somewhat realistic data with athlete-specific patterns
      const baseEnergy = 50 + (athlete.id % 3) * 15 + Math.floor(Math.random() * 20)
      const baseMood = moods[Math.min(4, Math.floor(Math.random() * 3) + (athlete.id % 2) + 1)]
      const baseSleep = sleepOptions[Math.min(3, Math.floor(Math.random() * 3) + (athlete.id % 2))]
      const facialScore = 50 + Math.floor(Math.random() * 40)

      const moodValue = baseMood.value
      const energyValue = Math.min(100, Math.max(0, baseEnergy))
      const sleepValue = baseSleep.value

      // Calculate score using the formula
      const score = Math.round(
        (moodValue * 0.30) +
        (energyValue * 0.25) +
        (sleepValue * 0.20) +
        (facialScore * 0.25)
      )

      checkIns.push({
        id: `${athlete.id}-${date.toISOString().split('T')[0]}`,
        athleteId: athlete.id,
        timestamp: date.toISOString(),
        mood: baseMood,
        energy: energyValue,
        sleep: baseSleep,
        facialScore,
        score,
        insights: generateInsights(moodValue, energyValue, sleepValue),
      })
    }
  })

  return checkIns
}

// Generate AI insights based on scores
export function generateInsights(moodValue, energyValue, sleepValue) {
  const insights = []

  if (energyValue < 40) {
    insights.push({
      icon: '⚡',
      title: 'Low Energy Detected',
      text: 'Consider light stretching or a short walk to boost your energy before practice.',
    })
  } else if (energyValue >= 70) {
    insights.push({
      icon: '💪',
      title: 'High Energy Today',
      text: "You're primed for high-intensity training. Make the most of this energy!",
    })
  }

  if (sleepValue < 50) {
    insights.push({
      icon: '😴',
      title: 'Sleep Recovery Needed',
      text: 'Poor sleep affects reaction time by 20%. Focus on rest tonight.',
    })
  } else if (sleepValue >= 75) {
    insights.push({
      icon: '✨',
      title: 'Well Rested',
      text: 'Great sleep quality! Your cognitive performance should be at its peak.',
    })
  }

  if (moodValue >= 80) {
    insights.push({
      icon: '🎯',
      title: 'Peak Mental State',
      text: "You're in an optimal mindset for learning new skills and techniques.",
    })
  } else if (moodValue <= 40) {
    insights.push({
      icon: '🧠',
      title: 'Mental Check-in',
      text: 'Consider talking to a coach or teammate. Connection helps performance.',
    })
  }

  // Default insights if we don't have enough
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

// Generate coaching recommendations based on athlete patterns
export function generateCoachingRecommendation(checkIns) {
  if (!checkIns || checkIns.length === 0) {
    return {
      type: 'info',
      icon: '📊',
      title: 'Gathering Data',
      text: 'Not enough check-in data yet. Encourage consistent daily check-ins.',
    }
  }

  const recentCheckIns = checkIns.slice(-7)
  const avgScore = Math.round(recentCheckIns.reduce((sum, c) => sum + c.score, 0) / recentCheckIns.length)
  const avgEnergy = Math.round(recentCheckIns.reduce((sum, c) => sum + c.energy, 0) / recentCheckIns.length)
  const lowSleepDays = recentCheckIns.filter(c => c.sleep.value < 50).length
  const lowMoodDays = recentCheckIns.filter(c => c.mood.value < 50).length

  if (avgScore < 50) {
    return {
      type: 'alert',
      icon: '⚠️',
      title: 'Attention Required',
      text: 'This athlete has been struggling. Consider a private check-in to understand what support they need.',
    }
  }

  if (lowSleepDays >= 3) {
    return {
      type: 'warning',
      icon: '😴',
      title: 'Sleep Pattern Concern',
      text: `Poor sleep reported ${lowSleepDays} of the last 7 days. Discuss sleep habits and recovery protocols.`,
    }
  }

  if (lowMoodDays >= 3) {
    return {
      type: 'warning',
      icon: '🧠',
      title: 'Mood Trend Alert',
      text: `Low mood reported ${lowMoodDays} of the last 7 days. Consider discussing mental wellness resources.`,
    }
  }

  if (avgEnergy < 50) {
    return {
      type: 'warning',
      icon: '⚡',
      title: 'Energy Management',
      text: 'Average energy is low. Consider reducing training load or checking nutrition habits.',
    }
  }

  if (avgScore >= 80) {
    return {
      type: 'positive',
      icon: '🔥',
      title: 'Peak Performer',
      text: 'Excellent readiness pattern! This athlete is ready for increased challenges and leadership roles.',
    }
  }

  return {
    type: 'info',
    icon: '✅',
    title: 'Stable Performance',
    text: 'Consistent readiness levels. Keep monitoring for any significant changes.',
  }
}
