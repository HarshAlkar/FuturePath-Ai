import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import dashboard from '../assets/dashboard_icon.svg'
import expense_tracker from '../assets/expense_tracker.svg'
import goals from '../assets/goals_icon.svg'
import insights from '../assets/insights_icon.svg'
import settings from '../assets/settings_icon.svg'
import { getUser } from '../services/api';

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  return (
    <aside className="fixed top-0 left-0 h-screen w-[18%] bg-white shadow-xl px-6 py-10 z-50 border border-gray-200 rounded-tr-3xl rounded-br-3xl transition-all duration-300 ease-in-out hover:translate-x-2 ">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <img className="w-12 h-12" src="/FinPilot_logo.svg" alt="FinPilot Logo" />
        <h1 className="text-2xl font-black font-anton uppercase tracking-wide text-green-800 ml-3">
          FinPilot
        </h1>
      </div>

      {/* User Info */}
      {user && (
        <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="ml-3">
              <p className="font-semibold text-green-800 text-sm">{user.name}</p>
              <p className="text-gray-600 text-xs">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav>
        <ul className="flex flex-col gap-6 text-lg font-medium text-green-800">
          <li>
            <Link
              to="/landingpage"
              className="block flex px-4 py-2 rounded-lg hover:bg-green-800 hover:text-white transition duration-200 ease-in-out"
            >
              <img className="w-6 mr-[2px]" src={dashboard} alt="" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/tracker"
              className="block flex px-4 py-2 rounded-lg hover:bg-green-800 hover:text-white transition duration-200 ease-in-out"
            >
              <img className="w-7 mr-[2px]" src={expense_tracker} alt="" />
              Expense Tracker
            </Link>
          </li>
          <li>
            <Link
              to="/goals"
              className="block flex px-4 py-2 rounded-lg hover:bg-green-800 hover:text-white transition duration-200 ease-in-out"
            >
              <img className="w-7 mr-[2px]" src={goals} alt="" />
              Goals
            </Link>
          </li>
          <li>
            <Link
              to="/insights"
              className="block flex px-4 py-2 rounded-lg hover:bg-green-800 hover:text-white transition duration-200 ease-in-out"
            >
              <img className="w-7 mr-[2px]" src={insights} alt="" />
              Insights
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="block flex px-4 py-2 rounded-lg hover:bg-green-800 hover:text-white transition duration-200 ease-in-out"
            >
              <img className="w-8 mr-[2px]" src={settings} alt="" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Navbar;
