import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Header from './components/Header'
import Toast from './components/Toast'
import Login from './pages/Login'
import AthleteHome from './pages/athlete/AthleteHome'
import AthleteCheckIn from './pages/athlete/AthleteCheckIn'
import CoachDashboard from './pages/coach/CoachDashboard'
import PlayerDetail from './pages/coach/PlayerDetail'
import './index.css'

// Protected route wrapper
function ProtectedRoute({ children, allowedTypes }) {
  const { isAuthenticated, user, loading } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff5c5c] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedTypes && !allowedTypes.includes(user?.type)) {
    return <Navigate to={user?.type === 'coach' ? '/coach' : '/athlete'} replace />
  }

  return children
}

// Public route wrapper (redirects if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated, user, loading } = useApp()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff5c5c] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={user?.type === 'coach' ? '/coach' : '/athlete'} replace />
  }

  return children
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Athlete routes */}
          <Route
            path="/athlete"
            element={
              <ProtectedRoute allowedTypes={['athlete', 'coach']}>
                <AthleteHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/athlete/checkin"
            element={
              <ProtectedRoute allowedTypes={['athlete', 'coach']}>
                <AthleteCheckIn />
              </ProtectedRoute>
            }
          />

          {/* Coach routes */}
          <Route
            path="/coach"
            element={
              <ProtectedRoute allowedTypes={['coach']}>
                <CoachDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coach/athlete/:id"
            element={
              <ProtectedRoute allowedTypes={['coach']}>
                <PlayerDetail />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toast />
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  )
}

export default App
