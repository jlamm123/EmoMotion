# EmoMotion

AI-powered athlete emotion tracking app for coaches and athletes.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan)

## Overview

EmoMotion helps sports teams monitor athlete wellness through daily emotional check-ins. Athletes complete quick assessments, and coaches get real-time insights into team readiness.

## Features

### Athlete Check-in Flow
- Welcome screen with quick start
- Mood selection (Rough, Low, Okay, Good, Locked In)
- Energy level slider (0-100)
- Sleep quality assessment
- AI-powered facial scan (placeholder)
- Personalized AI insights and readiness score

### Coach Dashboard
- Team overview with key metrics
- Real-time alerts for athletes needing attention
- 7-day trend visualization
- Individual athlete profiles with detailed analytics
- AI-generated coaching recommendations

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx       # Navigation header
│   ├── ScoreCircle.jsx  # Circular score display
│   └── StatusBadge.jsx  # Status indicators (green/yellow/red)
├── pages/
│   ├── athlete/
│   │   └── AthleteCheckIn.jsx  # Check-in flow
│   └── coach/
│       ├── CoachDashboard.jsx  # Team overview
│       └── PlayerDetail.jsx    # Individual athlete view
└── App.jsx              # Routes configuration
```

## Routes

| Route | Description |
|-------|-------------|
| `/athlete` | Athlete daily check-in flow |
| `/coach` | Coach team dashboard |
| `/coach/athlete/:id` | Individual athlete details |

## License

MIT
