import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Header from './components/Header'
import Toast from './components/Toast'
import InstallPrompt from './components/InstallPrompt'
import LoadingScreen from './components/LoadingScreen'
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
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedTypes && !allowedTypes.includes(user?.type)) {
    return <Navigate to={user?.type === 'coach' ? '/coach' : '/athlete'} replace />
  }

  return children
}

// Public route wrapper
function PublicRoute({ children }) {
  const { isAuthenticated, user, loading } = useApp()

  if (loading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to={user?.type === 'coach' ? '/coach' : '/athlete'} replace />
  }

  return children
}

function AppRoutes() {
  const { loading, modelsLoaded, modelLoadingProgress } = useApp()

  // Show loading screen while models are loading
  if (!modelsLoaded) {
    const message = modelLoadingProgress < 50
      ? 'Loading AI models...'
      : modelLoadingProgress < 100
      ? 'Almost ready...'
      : 'Starting app...'

    return <LoadingScreen progress={modelLoadingProgress} message={message} />
  }

  if (loading) {
    return <LoadingScreen progress={100} message="Loading..." />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <main className="pb-safe">
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
      <InstallPrompt />
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
