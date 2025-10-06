import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

const ProfileQuestions = ({ onComplete, initialAnswers = {} }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers || {});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = [
    {
      id: 1,
      category: 'Personal Information',
      question: 'What is your age range?',
      type: 'radio',
      options: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
      required: true
    },
    {
      id: 2,
      category: 'Personal Information',
      question: 'What is your annual income range?',
      type: 'radio',
      options: ['Below ₹3 Lakhs', '₹3-5 Lakhs', '₹5-10 Lakhs', '₹10-20 Lakhs', '₹20-50 Lakhs', 'Above ₹50 Lakhs'],
      required: true
    },
    {
      id: 3,
      category: 'Personal Information',
      question: 'What is your employment status?',
      type: 'radio',
      options: ['Salaried Employee', 'Business Owner', 'Freelancer', 'Student', 'Retired', 'Unemployed'],
      required: true
    },
    {
      id: 4,
      category: 'Personal Information',
      question: 'What is your marital status?',
      type: 'radio',
      options: ['Single', 'Married', 'Divorced', 'Widowed'],
      required: true
    },
    {
      id: 5,
      category: 'Personal Information',
      question: 'How many dependents do you have?',
      type: 'radio',
      options: ['None', '1', '2', '3', '4+'],
      required: true
    },
    {
      id: 6,
      category: 'Financial Goals',
      question: 'What is your primary financial goal?',
      type: 'radio',
      options: ['Retirement Planning', 'Buying a House', 'Children\'s Education', 'Emergency Fund', 'Wealth Building', 'Other'],
      required: true
    },
    {
      id: 7,
      category: 'Financial Goals',
      question: 'What is your investment time horizon?',
      type: 'radio',
      options: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'],
      required: true
    },
    {
      id: 8,
      category: 'Financial Goals',
      question: 'How much can you invest monthly?',
      type: 'radio',
      options: ['Below ₹5,000', '₹5,000-10,000', '₹10,000-25,000', '₹25,000-50,000', '₹50,000-1,00,000', 'Above ₹1,00,000'],
      required: true
    },
    {
      id: 9,
      category: 'Financial Goals',
      question: 'What is your target retirement age?',
      type: 'radio',
      options: ['50-55', '55-60', '60-65', '65-70', 'No specific age'],
      required: true
    },
    {
      id: 10,
      category: 'Financial Goals',
      question: 'What is your emergency fund target?',
      type: 'radio',
      options: ['3 months expenses', '6 months expenses', '12 months expenses', '2+ years expenses', 'No emergency fund needed'],
      required: true
    },
    {
      id: 11,
      category: 'Risk Assessment',
      question: 'How would you describe your risk tolerance?',
      type: 'radio',
      options: ['Very Conservative', 'Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'],
      required: true
    },
    {
      id: 12,
      category: 'Risk Assessment',
      question: 'How would you react to a 20% market decline?',
      type: 'radio',
      options: ['Sell everything immediately', 'Sell some investments', 'Hold and wait', 'Buy more at lower prices', 'No reaction needed'],
      required: true
    },
    {
      id: 13,
      category: 'Risk Assessment',
      question: 'What is your investment experience?',
      type: 'radio',
      options: ['No experience', 'Beginner (1-2 years)', 'Intermediate (3-5 years)', 'Advanced (5+ years)', 'Professional'],
      required: true
    },
    {
      id: 14,
      category: 'Risk Assessment',
      question: 'How important is capital preservation vs growth?',
      type: 'radio',
      options: ['Capital preservation is most important', 'Balanced approach', 'Growth is more important', 'Maximum growth regardless of risk'],
      required: true
    },
    {
      id: 15,
      category: 'Risk Assessment',
      question: 'What is your debt-to-income ratio?',
      type: 'radio',
      options: ['No debt', 'Below 20%', '20-40%', '40-60%', 'Above 60%'],
      required: true
    },
    {
      id: 16,
      category: 'Investment Preferences',
      question: 'Which investment types interest you most?',
      type: 'checkbox',
      options: ['Stocks', 'Mutual Funds', 'Gold', 'Real Estate', 'Bonds', 'Cryptocurrency', 'Fixed Deposits', 'PPF/EPF'],
      required: true
    },
    {
      id: 17,
      category: 'Investment Preferences',
      question: 'How often do you want to review your portfolio?',
      type: 'radio',
      options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'As needed'],
      required: true
    },
    {
      id: 18,
      category: 'Investment Preferences',
      question: 'Do you prefer active or passive investing?',
      type: 'radio',
      options: ['Active (frequent trading)', 'Passive (buy and hold)', 'Balanced approach', 'Depends on market conditions'],
      required: true
    },
    {
      id: 19,
      category: 'Investment Preferences',
      question: 'What is your preferred investment approach?',
      type: 'radio',
      options: ['DIY (Do it yourself)', 'Advisory services', 'Robo-advisor', 'Full-service broker', 'Combination'],
      required: true
    },
    {
      id: 20,
      category: 'Investment Preferences',
      question: 'How important is tax optimization in your investments?',
      type: 'radio',
      options: ['Not important', 'Somewhat important', 'Very important', 'Critical', 'I don\'t understand tax implications'],
      required: true
    }
  ];

  const handleAnswer = (questionId, answer) => {
    try {
      setAnswers(prev => ({
        ...prev,
        [questionId]: answer
      }));
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  const handleNext = () => {
    try {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        setIsCompleted(true);
        if (onComplete && typeof onComplete === 'function') {
          onComplete(answers);
        }
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
    }
  };

  const handlePrevious = () => {
    try {
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error in handlePrevious:', error);
    }
  };

  const currentQ = questions[currentQuestion] || questions[0];
  const isCurrentQuestionAnswered = currentQ ? answers[currentQ.id] !== undefined : false;

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  // Safety check for questions
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Questions</h2>
          <p className="text-gray-600 mb-6">
            There was an error loading the profile questions. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Complete!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing your financial profile. We'll use this information to provide personalized recommendations.
          </p>
          <button
            onClick={() => window.location.href = '/profile'}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Profile
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full"
      >
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Category */}
        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {currentQ?.category || 'General'}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQ?.question || 'Loading question...'}
        </h2>

        {/* Answer Options */}
        <div className="space-y-3 mb-8">
          {currentQ?.type === 'radio' ? (
            (currentQ?.options || []).map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[currentQ.id] === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQ?.id || index}`}
                  value={option}
                  checked={answers[currentQ?.id] === option}
                  onChange={() => handleAnswer(currentQ?.id, option)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[currentQ?.id] === option
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQ?.id] === option && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-900">{option}</span>
              </label>
            ))
          ) : (
            (currentQ?.options || []).map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  answers[currentQ?.id]?.includes(option)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={answers[currentQ?.id]?.includes(option) || false}
                  onChange={(e) => {
                    const currentAnswers = answers[currentQ?.id] || [];
                    if (e.target.checked) {
                      handleAnswer(currentQ?.id, [...currentAnswers, option]);
                    } else {
                      handleAnswer(currentQ?.id, currentAnswers.filter(a => a !== option));
                    }
                  }}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center ${
                  answers[currentQ?.id]?.includes(option)
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQ?.id]?.includes(option) && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-gray-900">{option}</span>
              </label>
            ))
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentQuestion === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
              !isCurrentQuestionAnswered
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <span>{currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Required Field Warning */}
        {!isCurrentQuestionAnswered && (
          <div className="mt-4 flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">This question is required</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileQuestions;
