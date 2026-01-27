import { Home } from './pages/home'
import RegisterPage from './pages/register'
import LeaderboardPage from './pages/leaderBoard';
import LoginPage from './pages/login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/home" element={<Home/> }/>
        <Route path="/leaderboard" element={<LeaderboardPage/>}/>
      </Routes>
        
    </BrowserRouter>
  )
}
 
export default App
