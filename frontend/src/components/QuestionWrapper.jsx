import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuestionWrapper = ({ children, title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-emerald-50 font-sans flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center space-x-2 text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
        
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-800">{title}</h1>
          <p className="text-md text-gray-600 mt-2">{description}</p>
        </header>

        {children}
      </div>
    </div>
  );
};

export default QuestionWrapper;
