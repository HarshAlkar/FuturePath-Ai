import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowLeft, ArrowRight } from 'lucide-react';
import QuestionWrapper from './QuestionWrapper';

// Import existing question components
import YoungAdult from '../20_ques/youngAdult';
import EarlyCareer from '../20_ques/earlyCareer';
import Unemployed from '../20_ques/unemployed';
import YoungEntrepreneur from '../20_ques/youngEnterpreneur';
import Age30_60 from '../20_ques/30_60';
import Age60Plus from '../20_ques/60+';
import StudentForm from '../20_ques/StudentForm1830';

const QuestionRouter = ({ onComplete, initialAnswers = {} }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState(null);
  const [answers, setAnswers] = useState(initialAnswers || {});

  const userTypes = [
    {
      id: 'student',
      title: 'Student (18-30)',
      description: 'Currently studying or recently graduated',
      icon: '🎓',
      component: StudentForm
    },
    {
      id: 'youngAdult',
      title: 'Young Adult (18-30)',
      description: 'Starting career or early professional life',
      icon: '👤',
      component: YoungAdult
    },
    {
      id: 'earlyCareer',
      title: 'Early Career (25-35)',
      description: 'Building career and financial foundation',
      icon: '💼',
      component: EarlyCareer
    },
    {
      id: 'entrepreneur',
      title: 'Young Entrepreneur',
      description: 'Starting or running your own business',
      icon: '🚀',
      component: YoungEntrepreneur
    },
    {
      id: 'midCareer',
      title: 'Mid-Career (30-60)',
      description: 'Established career with growing responsibilities',
      icon: '📈',
      component: Age30_60
    },
    {
      id: 'senior',
      title: 'Senior (60+)',
      description: 'Planning for retirement or already retired',
      icon: '🏖️',
      component: Age60Plus
    },
    {
      id: 'unemployed',
      title: 'Career Transition',
      description: 'Between jobs or changing career paths',
      icon: '🔄',
      component: Unemployed
    }
  ];

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setCurrentStep(1);
  };

  const handleQuestionsComplete = (questionAnswers) => {
    const finalAnswers = {
      userType: userType.id,
      userTypeTitle: userType.title,
      ...questionAnswers
    };
    
    setAnswers(finalAnswers);
    if (onComplete && typeof onComplete === 'function') {
      onComplete(finalAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      setCurrentStep(0);
      setUserType(null);
    }
  };

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Financial Profile Setup</h1>
            <p className="text-gray-600">Please select the category that best describes your current situation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTypes.map((type) => (
              <motion.button
                key={type.id}
                onClick={() => handleUserTypeSelect(type)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left"
              >
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (currentStep === 1 && userType) {
    const QuestionComponent = userType.component;
    
    return (
      <QuestionWrapper 
        title={userType.title}
        description={userType.description}
      >
        <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6 rounded-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Categories</span>
            </button>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">{userType.title}</h2>
              <p className="text-sm text-gray-600">{userType.description}</p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
        
        <QuestionComponent onComplete={handleQuestionsComplete} />
      </QuestionWrapper>
    );
  }

  return null;
};

export default QuestionRouter;
