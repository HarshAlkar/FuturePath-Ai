import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage/LandingPage'
import MainDashboard from './pages/main_dashboard'
import ExpenseTracker from './pages/Expense_tracker'
import Goals from './pages/Goals'
import Insights from './pages/Insights'
import Investment from './pages/Investment'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import LoginSignupComponent from './SignUp/LoginSignupComponent'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignupComponent />} />
        <Route path="/signup" element={<LoginSignupComponent />} />
        <Route path="/get-started" element={<LoginSignupComponent />} />
        <Route path="/dashboard" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />
        <Route path="/main-dashboard" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />
        <Route path="/expense-tracker" element={<ProtectedRoute><ExpenseTracker /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/my-goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/ai-advisor" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/investment" element={<ProtectedRoute><Investment /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App
