import { Home } from './pages/home'
import RegisterPage from './pages/register'
import LeaderboardPage from './pages/leaderBoard';
import LoginPage from './pages/login'
import SettingsPage from './pages/settings'
import ProfilePage from './pages/profile'
import AchievementsPage from './pages/achievements'
import AdminTextPage from './pages/adminText'
import NotFoundPage from './pages/notFound'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SpaceBackground } from './components/SpaceBackground';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import './App.css'
function App() {

  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <SpaceBackground />
          <div className="relative" style={{ zIndex: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/admin-text" element={<AdminTextPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App


