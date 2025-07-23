import React from 'react';
import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const MainDashboardNavbar = () => (
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
        <Link to="/ai-advisor" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
          AI Advisor
        </Link>
        <Link to="/my-goals" className="text-gray-900 font-medium whitespace-nowrap hover:text-blue-600">
          My Goals
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="w-5 h-5 text-gray-600" />
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-600" />
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">Good evening,Riddhi</div>
            <div className="text-xs text-gray-500 pr-10" >Premium Member</div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default MainDashboardNavbar; 