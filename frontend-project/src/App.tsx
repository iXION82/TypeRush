import { Home } from './pages/home'
import RegisterPage from './pages/register'
import LeaderboardPage from './pages/leaderBoard';
import LoginPage from './pages/login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SpaceBackground } from './components/SpaceBackground';
import './App.css'
function App() {

  return (
    <BrowserRouter>
      <SpaceBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
