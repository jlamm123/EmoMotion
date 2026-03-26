# EmoMotion

**AI-powered athlete emotion tracking for peak performance.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3-FF6384?logo=chartdotjs&logoColor=white)](https://recharts.org/)

EmoMotion helps coaches and sports teams monitor athlete emotional wellness through quick daily check-ins. Athletes complete 60-second assessments, and coaches get real-time insights into team readiness with AI-powered recommendations.

**[Live Demo](https://jlamm123.github.io/EmoMotion/)**

---

## Features

### Authentication
- **Role Selection** - Choose between Athlete or Coach login
- **Athlete Login** - Select your name from the team roster
- **Coach Login** - Enter team code (`EAGLES2024` for demo)
- **Persistent Sessions** - Stay logged in across browser sessions

### Athlete Experience
- **Daily Check-in Flow** - 60-second wellness assessment
  - Mood Selection (Rough, Low, Okay, Good, Locked In)
  - Energy Slider (0-100 scale)
  - Sleep Quality (Poor, Fair, Good, Great)
  - Facial Scan with webcam capture
- **Readiness Score** - Calculated using weighted formula:
  ```
  Score = (Mood × 0.30) + (Energy × 0.25) + (Sleep × 0.20) + (Facial × 0.25)
  ```
- **AI Insights** - 3 personalized recommendations based on your data
- **Streak Tracking** - Track consecutive daily check-ins
- **Home Dashboard** - View today's score, insights, and streak

### Coach Dashboard
- **Real-time Team Stats**
  - Team Average Score
  - Check-in Completion Rate
  - Watch List (scores 50-69)
  - Alerts (scores below 50)
  - Weekly Change Indicator
- **7-Day Trend Chart** - Visualize team wellness over time
- **Smart Roster** - Athletes sorted by score (lowest first for attention)
- **Status Badges** - Green (70-100), Yellow (50-69), Red (0-49)
- **Notification Bell** - See new check-ins as they happen

### Player Detail (Coach View)
- **Individual Analytics** - 7-day readiness trend chart
- **Energy vs Sleep Chart** - Correlation visualization
- **Recent Check-ins** - Full history with mood, energy, sleep, score
- **AI Coaching Insights** - Pattern-based recommendations
- **Streak Display** - See athlete's consistency

### Data Persistence
- **localStorage Database** - All data persists between sessions
- **Mock Historical Data** - 7 days of check-in history per athlete
- **Real-time Updates** - Coach dashboard refreshes every 5 seconds

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with hooks |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router 7** | Client-side routing (HashRouter) |
| **Recharts 3** | Data visualization |
| **React Context** | Global state management |
| **localStorage** | Client-side data persistence |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jlamm123/EmoMotion.git

# Navigate to project directory
cd EmoMotion

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:5173/EmoMotion/`

### Demo Credentials
- **Athletes**: Select any name from roster
- **Coach**: Team code `EAGLES2024`

### Build for Production

```bash
npm run build
npm run preview
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

---

## Project Structure

```
EmoMotion/
├── src/
│   ├── components/
│   │   ├── Header.jsx        # Nav with user info & logout
│   │   ├── ScoreCircle.jsx   # Animated circular score display
│   │   ├── StatusBadge.jsx   # Color-coded status indicators
│   │   └── Toast.jsx         # Toast notifications
│   ├── context/
│   │   └── AppContext.jsx    # Global state management
│   ├── data/
│   │   └── mockData.js       # Athletes, moods, historical data
│   ├── pages/
│   │   ├── Login.jsx         # Role selection & authentication
│   │   ├── athlete/
│   │   │   ├── AthleteHome.jsx     # Athlete dashboard
│   │   │   └── AthleteCheckIn.jsx  # 4-step check-in flow
│   │   └── coach/
│   │       ├── CoachDashboard.jsx  # Team overview & roster
│   │       └── PlayerDetail.jsx    # Individual athlete analytics
│   ├── utils/
│   │   └── database.js       # localStorage CRUD operations
│   ├── App.jsx               # Routes with auth protection
│   ├── main.jsx              # App entry point
│   └── index.css             # Global styles & animations
├── vite.config.js
└── package.json
```

---

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/#/login` | Public | Role selection & login |
| `/#/athlete` | Athletes, Coaches | Athlete home dashboard |
| `/#/athlete/checkin` | Athletes, Coaches | Check-in flow |
| `/#/coach` | Coaches only | Team dashboard |
| `/#/coach/athlete/:id` | Coaches only | Player detail view |

---

## Score Calculation

The readiness score is calculated using a weighted formula:

| Factor | Weight | Range |
|--------|--------|-------|
| Mood | 30% | Rough=20, Low=40, Okay=60, Good=80, Locked In=100 |
| Energy | 25% | 0-100 slider |
| Sleep | 20% | Poor=25, Fair=50, Good=75, Great=100 |
| Facial Scan | 25% | 50-90 (AI analysis placeholder) |

---

## Roadmap

- [x] User authentication (athletes & coaches)
- [x] Webcam facial capture
- [x] Historical data & 7-day trend analysis
- [x] Streak tracking
- [x] AI coaching recommendations
- [ ] Real facial emotion detection with ML
- [ ] Push notifications for check-in reminders
- [ ] Team comparison analytics
- [ ] Export reports (PDF/CSV)
- [ ] Mobile app (React Native)
- [ ] Integration with wearables (heart rate, sleep data)
- [ ] Multi-team support for organizations

---

## Author

**Justin Lam**
- GitHub: [@jlamm123](https://github.com/jlamm123)

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>EmoMotion</strong> - Empowering athletes through emotional intelligence
</p>
