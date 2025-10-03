import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import UserContextService from '../services/UserContextService';
import StudentForm1830 from '../20_ques/StudentForm1830';
import SalariedFinancialSurvey from '../20_ques/earlyCareer';
import FinancialHealthSurvey from '../20_ques/youngAdult';
import EntrepreneurFinancialSurvey from '../20_ques/youngEnterpreneur';
import UnemployedFinancialSurvey from '../20_ques/unemployed';
import EstablishedBusinessOwnerSurvey from '../20_ques/30_60';
import RetiredFinancialSurvey from '../20_ques/60+.jsx';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState('loading');
  const [userProfile, setUserProfile] = useState(null);
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage or context
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!user.id || !token) {
      navigate('/get-started');
      return;
    }

    // Check if user has already completed onboarding
    if (user.onboardingCompleted) {
      // User has already completed onboarding, redirect to dashboard
      navigate('/dashboard');
      return;
    }

    setUserProfile(user);
    setCurrentStep('survey');
  }, [navigate]);

  // Determine which survey to show based on user profile
  const getSurveyComponent = () => {
    if (!userProfile) return null;

    const { age, occupation, employmentStatus } = userProfile;

    // Student (18-30)
    if (age >= 18 && age <= 30 && occupation === 'student') {
      return <StudentForm1830 onComplete={handleSurveyComplete} />;
    }

    // Early Career (18-30, employed)
    if (age >= 18 && age <= 30 && employmentStatus === 'employed') {
      return <SalariedFinancialSurvey onComplete={handleSurveyComplete} />;
    }

    // Young Adult (18-30, not student)
    if (age >= 18 && age <= 30 && occupation !== 'student') {
      return <FinancialHealthSurvey onComplete={handleSurveyComplete} />;
    }

    // Young Entrepreneur (18-30, self-employed)
    if (age >= 18 && age <= 30 && employmentStatus === 'self-employed') {
      return <EntrepreneurFinancialSurvey onComplete={handleSurveyComplete} />;
    }

    // Unemployed
    if (employmentStatus === 'unemployed') {
      return <UnemployedFinancialSurvey onComplete={handleSurveyComplete} />;
    }

    // 30-60 age group
    if (age >= 30 && age <= 60) {
      return <EstablishedBusinessOwnerSurvey onComplete={handleSurveyComplete} />;
    }

    // 60+ age group
    if (age >= 60) {
      return <RetiredFinancialSurvey onComplete={handleSurveyComplete} />;
    }

    // Default to early career
    return <SalariedFinancialSurvey onComplete={handleSurveyComplete} />;
  };

  const handleSurveyComplete = async (answers) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Store answers locally using UserContextService
      const stored = UserContextService.storeSurveyAnswers(answers);
      if (!stored) {
        throw new Error('Failed to store survey answers locally');
      }

      // Try to update backend, but don't fail if it's not available
      try {
        const updateResponse = await fetch(`http://localhost:5000/api/users/${user.id}/onboarding`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            surveyAnswers: answers,
            onboardingCompleted: true
          })
        });

        if (updateResponse.ok) {
          // Backend update successful
          const updatedUser = await updateResponse.json();
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (backendError) {
        console.warn('Backend update failed, continuing with local storage:', backendError);
        // Update user locally if backend fails
        const updatedUser = {
          ...user,
          onboardingCompleted: true,
          onboardingDate: new Date().toISOString(),
          surveyAnswers: answers
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setCurrentStep('completed');

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/main-dashboard');
      }, 2000);

    } catch (error) {
      console.error('Onboarding error:', error);
      setError(error.message);
      setIsSubmitting(false);
    }
  };

  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Setting up your personalized experience...</h2>
        </div>
      </div>
    );
  }

  if (currentStep === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to FinPilot!</h2>
          <p className="text-gray-600 mb-6">Your personalized financial dashboard is ready.</p>
          <div className="flex items-center justify-center text-green-600">
            <span>Redirecting to dashboard</span>
            <ArrowRight className="w-4 h-4 ml-2 animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => setCurrentStep('survey')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Creating your personalized experience</h3>
            <p className="text-gray-600">Setting up your goals, expenses, and insights...</p>
          </div>
        </div>
      )}
      
      {getSurveyComponent()}
    </div>
  );
};

export default OnboardingFlow; 