import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage/LandingPage'
import MainDashboard from './pages/main_dashboard'
import ExpenseTracker from './pages/Expense_tracker'
import Goals from './pages/Goals'
import Insights from './pages/Insights'
import Investment from './pages/Investment'
import GoldDashboard from './pages/GoldDashboard'
import GoldBuyingPage from './pages/GoldBuyingPage'
import SuperComplete from './pages/SuperComplete'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import LoginSignupComponent from './SignUp/LoginSignupComponent'
import ProtectedRoute from './components/ProtectedRoute'
import OnboardingFlow from './components/OnboardingFlow'
import LandPage from './LandingPage/LandPage'
import { Toaster } from 'react-hot-toast'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landpage" element={<LandPage />} />
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
        <Route path="/gold-dashboard" element={<ProtectedRoute><GoldDashboard /></ProtectedRoute>} />
        <Route path="/gold-buy" element={<ProtectedRoute><GoldBuyingPage /></ProtectedRoute>} />
        <Route path="/super-complete" element={<ProtectedRoute><SuperComplete /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingFlow /></ProtectedRoute>} />
        
        
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  )
}

export default App
