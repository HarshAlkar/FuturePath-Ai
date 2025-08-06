import React, { useState, useEffect } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const MainDashboardNavbar = () => {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user data
    const currentUser = authService.getStoredUser();
    setUser(currentUser);

    // Set greeting based on time of day
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 17) return 'Good afternoon';
      if (hour < 21) return 'Good evening';
      return 'Good night';
    };

    setGreeting(getGreeting());

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    authService.logout();
    
    // Show confirmation message
    alert('Successfully logged out!');
    
    // Navigate to login page
    navigate('/login');
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
      <div className="flex items-center justify-center space-x-8 pr-120">
        <Link to="/dashboard" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
          Dashboard
        </Link>
        <Link to="/expense-tracker" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
          Expense Tracker
        </Link>
        <Link to="/goals" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
          My Goals
        </Link>
        <Link to="/insights" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
          Insights
        </Link>
        <Link to="/investment" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
          Investment
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-600" />
        <div className="flex items-center space-x-4">
          <Link to="/profile" className="text-gray-900 font-medium hover:text-blue-600">
            Profile
          </Link>
          <Link to="/settings" className="text-gray-900 font-medium hover:text-blue-600">
            Settings
          </Link>
          <Link to="/profile" className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer">
            <User className="w-5 h-5 text-gray-600" />
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {greeting}, {user?.name || 'User'}
              </div>
              <div className="text-xs text-gray-500">Premium Member</div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
  );
};

export default MainDashboardNavbar;