import React from 'react';
import ai_advisor from '../assets/Ai_advisor.svg';
import goal_path from '../assets/goal_planning.svg';
import v_to_t from '../assets/voice_to_text.svg';
import dashboard_icon from '../assets/dashboard_icon.svg';
import expense_tracker from '../assets/expense_tracker.svg';
import insights_icon from '../assets/insights_icon.svg';

const Features = () => {
  return (
    <div className="w-full px-4 py-16" id="features">
      <h1 className="text-4xl font-bold text-center text-green-800 mb-12 font-anton">
        What FinPilot Provides
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        
        {/* Feature Card 1 - AI Financial Advisor */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-2xl hover:shadow-4xl transition-all duration-300 hover:-translate-y-2">
          <h2 className="text-xl font-semibold text-green-700 mb-4 font-outfit">AI Financial Advisor</h2>
          <img className="w-40 mx-auto mb-4" src={ai_advisor} alt="AI Advisor" />
          <p className="text-gray-700 text-sm font-outfit">
            Get smart saving tips and real-time financial insights based on your habits, income, and goals.
          </p>
        </div>

        {/* Feature Card 2 - Goal-Driven Financial Path */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-2xl hover:shadow-4xl transition-all duration-300 hover:-translate-y-2">
          <h2 className="text-xl font-semibold text-green-700 mb-4 font-outfit">Goal-Driven Financial Path</h2>
          <img className="w-40 mx-auto mb-4" src={goal_path} alt="Goal Path" />
          <p className="text-gray-700 text-sm font-outfit">
            Set a goal like a trip or phone — FinPilot builds a monthly plan and tracks your progress with reminders.
          </p>
        </div>

        {/* Feature Card 3 - Voice-Based Expense Tracker */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-2xl hover:shadow-4xl transition-all duration-300 hover:-translate-y-2">
          <h2 className="text-xl font-semibold text-green-700 mb-4 font-outfit">Voice-Based Expense Tracker</h2>
          <img className="w-40 mx-auto mb-4" src={v_to_t} alt="Voice to Text" />
          <p className="text-gray-700 text-sm font-outfit">
            Log your daily expenses by simply speaking — our AI understands and auto-categorizes it.
          </p>
        </div>

        {/* Feature Card 4 - Smart Dashboard */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-2xl hover:shadow-4xl transition-all duration-300 hover:-translate-y-2">
          <h2 className="text-xl font-semibold text-green-700 mb-4 font-outfit">Smart Dashboard</h2>
          <img className="w-40 mx-auto mb-4" src={dashboard_icon} alt="Dashboard" />
          <p className="text-gray-700 text-sm font-outfit">
            Comprehensive overview of your finances with real-time updates and personalized insights.
          </p>
        </div>

        {/* Feature Card 5 - Expense Tracking */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-2xl hover:shadow-4xl transition-all duration-300 hover:-translate-y-2">
          <h2 className="text-xl font-semibold text-green-700 mb-4 font-outfit">Expense Tracking</h2>
          <img className="w-40 mx-auto mb-4" src={expense_tracker} alt="Expense Tracker" />
          <p className="text-gray-700 text-sm font-outfit">
            Track every penny with detailed categorization and spending pattern analysis.
          </p>
        </div>

        {/* Feature Card 6 - Financial Insights */}
        <div className="w-full bg-white p-6 rounded-2xl shadow-2xl hover:shadow-4xl transition-all duration-300 hover:-translate-y-2">
          <h2 className="text-xl font-semibold text-green-700 mb-4 font-outfit">Financial Insights</h2>
          <img className="w-40 mx-auto mb-4" src={insights_icon} alt="Insights" />
          <p className="text-gray-700 text-sm font-outfit">
            Get actionable insights and recommendations to optimize your financial health.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Features;
