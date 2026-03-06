# EmoMotion

**AI-powered athlete emotion tracking for peak performance.**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-3-FF6384?logo=chartdotjs&logoColor=white)](https://recharts.org/)

EmoMotion helps coaches and sports teams monitor athlete emotional wellness through quick daily check-ins. Athletes complete 60-second assessments, and coaches get real-time insights into team readiness with AI-powered recommendations.

**[Live Demo](https://jlamm123.github.io/EmoMotion/)**

---

## Screenshots

<!-- Add screenshots here -->
| Athlete Check-in | Coach Dashboard | Player Detail |
|:---:|:---:|:---:|
| *Coming soon* | *Coming soon* | *Coming soon* |

---

## Features

### Athlete Daily Check-in
- **Mood Selection** - 5 levels: Rough, Low, Okay, Good, Locked In
- **Energy Slider** - 0-100 scale with real-time feedback
- **Sleep Quality** - Quick assessment (Poor, Fair, Good, Great)
- **Facial Scan** - AI-powered emotion detection (placeholder)
- **AI Insights** - Personalized recommendations based on your check-in

### Coach Dashboard
- **Team Emotional Index** - Real-time team average score
- **Color-coded Roster** - Green (70-100), Yellow (50-69), Red (0-49)
- **7-Day Trend Charts** - Visualize team wellness over time
- **Real-time Alerts** - Instant notifications for athletes needing attention
- **Watch List** - Track athletes who need monitoring
- **Individual Profiles** - Deep dive into each athlete's data

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **React Router 7** | Client-side routing |
| **Recharts 3** | Data visualization |

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

The app will be running at `http://localhost:5173`

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
├── public/
│   └── _redirects          # Netlify routing config
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Navigation header with Athlete/Coach toggle
│   │   ├── ScoreCircle.jsx # Animated circular score display
│   │   └── StatusBadge.jsx # Color-coded status indicators
│   ├── pages/
│   │   ├── athlete/
│   │   │   └── AthleteCheckIn.jsx   # 5-step check-in flow
│   │   └── coach/
│   │       ├── CoachDashboard.jsx   # Team overview & roster
│   │       └── PlayerDetail.jsx     # Individual athlete analytics
│   ├── App.jsx             # Route configuration
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles & Tailwind
├── vite.config.js          # Vite configuration
└── package.json
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/#/athlete` | Athlete daily check-in flow |
| `/#/coach` | Coach team dashboard |
| `/#/coach/athlete/:id` | Individual athlete details |

---

## Roadmap

- [ ] User authentication (athletes & coaches)
- [ ] Real facial emotion detection with AI/ML
- [ ] Push notifications for check-in reminders
- [ ] Historical data & long-term trend analysis
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
