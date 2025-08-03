import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import authService from '../services/authService';

const MainDashboardNavbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // First try to get from localStorage for immediate display
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
      
      // Then fetch fresh data from backend
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserGreeting = () => {
    if (!user) return 'Welcome back!';
    
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    
    return `${greeting}, ${user.name || 'User'}`;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 mr-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-semibold text-gray-900">FuturePath AI</span>
        </div>
        <div className="flex items-center justify-center space-x-10 pr-120">
          <Link to="/main-dashboard" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/expense-tracker" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
            Expense Tracker
          </Link>
          <Link to="/investment" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
            Investment
          </Link>
          <Link to="/ai-advisor" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
            AI Advisor
          </Link>
          <Link to="/goals" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
            My Goals
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="w-5 h-5 text-gray-600" />
          <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
            <User className="w-5 h-5 text-gray-600" />
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {loading ? 'Loading...' : getUserGreeting()}
              </div>
              <div className="text-xs text-gray-500">
                {user?.membership || 'Free Member'}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MainDashboardNavbar; 