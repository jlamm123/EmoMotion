import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import AthleteCheckIn from './pages/athlete/AthleteCheckIn'
import CoachDashboard from './pages/coach/CoachDashboard'
import PlayerDetail from './pages/coach/PlayerDetail'
import './index.css'

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0f0f0f]">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/athlete" replace />} />
            <Route path="/athlete" element={<AthleteCheckIn />} />
            <Route path="/coach" element={<CoachDashboard />} />
            <Route path="/coach/athlete/:id" element={<PlayerDetail />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
