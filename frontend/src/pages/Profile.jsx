import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Edit3, Target, TrendingUp, Shield, Brain, 
  CheckCircle, AlertTriangle, BarChart3, PieChart,
  Calendar, DollarSign, Award, Settings, RefreshCw,
  ArrowLeft, Home, Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileQuestions from '../components/ProfileQuestions';
import QuestionRouter from '../components/QuestionRouter';
import ErrorBoundary from '../components/ErrorBoundary';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Get profile data
    const profile = JSON.parse(localStorage.getItem('profileData') || 'null');
    setProfileData(profile);

    if (profile) {
      generateAnalysis(profile);
    }
  }, []);

  const generateAnalysis = (answers) => {
    try {
      // Generate comprehensive analysis based on answers
      const analysis = {
        riskProfile: calculateRiskProfile(answers),
        investmentStrategy: generateInvestmentStrategy(answers),
        recommendations: generateRecommendations(answers),
        goals: extractGoals(answers),
        timeline: calculateTimeline(answers),
        monthlyInvestment: calculateMonthlyInvestment(answers),
        assetAllocation: generateAssetAllocation(answers),
        riskScore: calculateRiskScore(answers),
        experience: getExperienceLevel(answers),
        preferences: extractPreferences(answers),
        userType: answers.userType || 'general',
        userTypeTitle: answers.userTypeTitle || 'General User'
      };
      setAnalysis(analysis);
    } catch (error) {
      console.error('Error generating analysis:', error);
      // Set default analysis if error occurs
      setAnalysis({
        riskProfile: 'Moderate',
        investmentStrategy: { equity: 50, debt: 40, gold: 10 },
        recommendations: [],
        goals: { primary: 'Wealth Building', timeHorizon: '5-10 years', monthlyInvestment: '₹10,000' },
        timeline: 'Medium-term (5-10 years)',
        monthlyInvestment: '₹10,000',
        assetAllocation: [
          { name: 'Equity', value: 50, color: '#3B82F6' },
          { name: 'Debt', value: 40, color: '#10B981' },
          { name: 'Gold', value: 10, color: '#F59E0B' }
        ],
        riskScore: 50,
        experience: 'Intermediate',
        preferences: { reviewFrequency: 'Monthly', approach: 'Balanced' },
        userType: answers.userType || 'general',
        userTypeTitle: answers.userTypeTitle || 'General User'
      });
    }
  };

  const calculateRiskProfile = (answers) => {
    try {
      // Try to get risk-related answers from different possible formats
      const riskAnswers = [
        answers[11] || answers.q11 || answers.riskTolerance,
        answers[12] || answers.q12 || answers.marketReaction,
        answers[13] || answers.q13 || answers.experience,
        answers[14] || answers.q14 || answers.capitalPreservation
      ].filter(Boolean);
      
      if (riskAnswers.length === 0) return 'Moderate';
      
      const riskKeywords = {
        'Very Conservative': 1,
        'Conservative': 2,
        'Moderate': 3,
        'Aggressive': 4,
        'Very Aggressive': 5,
        'I\'m very risk-averse': 1,
        'I prefer moderate and balanced risks': 3,
        'I\'m comfortable with high-risk, high-reward': 5
      };
      
      const avgRisk = riskAnswers.reduce((sum, answer) => {
        return sum + (riskKeywords[answer] || 3);
      }, 0) / riskAnswers.length;

      if (avgRisk <= 2) return 'Conservative';
      if (avgRisk <= 3) return 'Moderate';
      if (avgRisk <= 4) return 'Aggressive';
      return 'Very Aggressive';
    } catch (error) {
      console.error('Error calculating risk profile:', error);
      return 'Moderate';
    }
  };

  const generateInvestmentStrategy = (answers) => {
    try {
      const riskProfile = calculateRiskProfile(answers);
      const strategies = {
        'Conservative': {
          equity: 30,
          debt: 60,
          gold: 10,
          description: 'Focus on capital preservation with steady growth'
        },
        'Moderate': {
          equity: 50,
          debt: 40,
          gold: 10,
          description: 'Balanced approach between growth and stability'
        },
        'Aggressive': {
          equity: 70,
          debt: 20,
          gold: 10,
          description: 'Growth-focused with higher equity allocation'
        },
        'Very Aggressive': {
          equity: 80,
          debt: 15,
          gold: 5,
          description: 'Maximum growth potential with high equity exposure'
        }
      };

      return strategies[riskProfile] || strategies['Moderate'];
    } catch (error) {
      console.error('Error generating investment strategy:', error);
      return {
        equity: 50,
        debt: 40,
        gold: 10,
        description: 'Balanced approach between growth and stability'
      };
    }
  };

  const generateRecommendations = (answers) => {
    const recommendations = [];
    const riskProfile = calculateRiskProfile(answers);
    const experience = answers[13];
    const timeHorizon = answers[7];

    // Risk-based recommendations
    if (riskProfile === 'Conservative') {
      recommendations.push({
        type: 'Investment',
        title: 'Focus on Debt Instruments',
        description: 'Consider FDs, government bonds, and debt mutual funds for stable returns',
        priority: 'high'
      });
    } else if (riskProfile === 'Aggressive' || riskProfile === 'Very Aggressive') {
      recommendations.push({
        type: 'Investment',
        title: 'Equity-Focused Portfolio',
        description: 'Allocate more to equity mutual funds and direct stocks for higher growth',
        priority: 'high'
      });
    }

    // Experience-based recommendations
    if (experience === 'No experience' || experience === 'Beginner (1-2 years)') {
      recommendations.push({
        type: 'Education',
        title: 'Start with SIPs',
        description: 'Begin with Systematic Investment Plans in mutual funds',
        priority: 'high'
      });
    }

    // Time horizon recommendations
    if (timeHorizon === 'Less than 1 year') {
      recommendations.push({
        type: 'Investment',
        title: 'Short-term Instruments',
        description: 'Consider liquid funds and short-term FDs',
        priority: 'medium'
      });
    }

    return recommendations;
  };

  const extractGoals = (answers) => {
    return {
      primary: answers[6],
      timeHorizon: answers[7],
      monthlyInvestment: answers[8],
      retirementAge: answers[9],
      emergencyFund: answers[10]
    };
  };

  const calculateTimeline = (answers) => {
    const timeHorizon = answers[7];
    const timelineMap = {
      'Less than 1 year': 'Short-term (0-1 years)',
      '1-3 years': 'Medium-term (1-3 years)',
      '3-5 years': 'Medium-term (3-5 years)',
      '5-10 years': 'Long-term (5-10 years)',
      '10+ years': 'Very Long-term (10+ years)'
    };
    return timelineMap[timeHorizon] || 'Medium-term';
  };

  const calculateMonthlyInvestment = (answers) => {
    const investmentRange = answers[8];
    const rangeMap = {
      'Below ₹5,000': '₹2,500',
      '₹5,000-10,000': '₹7,500',
      '₹10,000-25,000': '₹17,500',
      '₹25,000-50,000': '₹37,500',
      '₹50,000-1,00,000': '₹75,000',
      'Above ₹1,00,000': '₹1,25,000'
    };
    return rangeMap[investmentRange] || '₹10,000';
  };

  const generateAssetAllocation = (answers) => {
    const strategy = generateInvestmentStrategy(answers);
    return [
      { name: 'Equity', value: strategy.equity, color: '#3B82F6' },
      { name: 'Debt', value: strategy.debt, color: '#10B981' },
      { name: 'Gold', value: strategy.gold, color: '#F59E0B' }
    ];
  };

  const calculateRiskScore = (answers) => {
    const riskFactors = [
      answers[11], // Risk tolerance
      answers[12], // Market decline reaction
      answers[13], // Experience
      answers[14], // Capital preservation vs growth
      answers[15]  // Debt-to-income ratio
    ];

    let score = 0;
    riskFactors.forEach(factor => {
      if (factor?.includes('Very Aggressive') || factor?.includes('Buy more')) score += 5;
      else if (factor?.includes('Aggressive') || factor?.includes('Hold and wait')) score += 4;
      else if (factor?.includes('Moderate') || factor?.includes('Balanced')) score += 3;
      else if (factor?.includes('Conservative') || factor?.includes('Sell some')) score += 2;
      else if (factor?.includes('Very Conservative') || factor?.includes('Sell everything')) score += 1;
    });

    return Math.round((score / riskFactors.length) * 20); // Scale to 0-100
  };

  const getExperienceLevel = (answers) => {
    return answers[13] || 'No experience';
  };

  const extractPreferences = (answers) => {
    return {
      investmentTypes: answers[16] || [],
      reviewFrequency: answers[17],
      activePassive: answers[18],
      approach: answers[19],
      taxOptimization: answers[20]
    };
  };

  const handleProfileComplete = (answers) => {
    localStorage.setItem('profileData', JSON.stringify(answers));
    setProfileData(answers);
    generateAnalysis(answers);
    setShowQuestions(false);
  };

  const handleEditProfile = () => {
    setShowQuestions(true);
  };

  if (showQuestions) {
    return (
      <ErrorBoundary>
        <QuestionRouter onComplete={handleProfileComplete} initialAnswers={profileData} />
      </ErrorBoundary>
    );
  }

  if (!profileData) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          {/* Navigation Header */}
          <div className="w-full max-w-4xl mb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/super-complete')}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <Menu className="w-5 h-5" />
                <span>Super Complete</span>
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
          >
            <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
            <p className="text-gray-600 mb-6">
              Answer 20 questions to get personalized financial recommendations and insights.
            </p>
            <button
              onClick={() => setShowQuestions(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Profile Setup
            </button>
          </motion.div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/super-complete')}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
            <span>Super Complete</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
                <p className="text-gray-600">Premium Member</p>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {analysis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Analysis Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Risk Profile */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 text-blue-600 mr-2" />
                  Risk Profile Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Risk Level</div>
                    <div className={`text-2xl font-bold ${
                      analysis.riskProfile === 'Conservative' ? 'text-green-600' :
                      analysis.riskProfile === 'Moderate' ? 'text-yellow-600' :
                      analysis.riskProfile === 'Aggressive' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {analysis.riskProfile}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Risk Score</div>
                    <div className="text-2xl font-bold text-gray-900">{analysis.riskScore}/100</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        analysis.riskScore <= 30 ? 'bg-green-500' :
                        analysis.riskScore <= 60 ? 'bg-yellow-500' :
                        analysis.riskScore <= 80 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${analysis.riskScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Investment Strategy */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                  Recommended Investment Strategy
                </h3>
                <p className="text-gray-600 mb-4">{analysis.investmentStrategy.description}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysis.investmentStrategy.equity}%</div>
                    <div className="text-sm text-gray-600">Equity</div>
                </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analysis.investmentStrategy.debt}%</div>
                    <div className="text-sm text-gray-600">Debt</div>
                </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{analysis.investmentStrategy.gold}%</div>
                    <div className="text-sm text-gray-600">Gold</div>
                </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-6 h-6 text-purple-600 mr-2" />
                  Personalized Recommendations
                </h3>
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      rec.priority === 'high' ? 'border-red-500 bg-red-50' :
                      rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          rec.priority === 'high' ? 'bg-red-500' :
                          rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
              </div>
            </div>
          </div>
                  ))}
                  </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Goals Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-6 h-6 text-indigo-600 mr-2" />
                  Your Goals
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-600">Primary Goal</div>
                    <div className="font-medium text-gray-900">{analysis.goals.primary}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Time Horizon</div>
                    <div className="font-medium text-gray-900">{analysis.timeline}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Monthly Investment</div>
                    <div className="font-medium text-gray-900">{analysis.monthlyInvestment}</div>
                    </div>
                  <div>
                    <div className="text-sm text-gray-600">Retirement Age</div>
                    <div className="font-medium text-gray-900">{analysis.goals.retirementAge}</div>
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="w-6 h-6 text-yellow-600 mr-2" />
                  Experience Level
                </h3>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{analysis.experience}</div>
                  <div className="text-sm text-gray-600">Investment Experience</div>
              </div>
            </div>

            {/* Preferences */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-6 h-6 text-gray-600 mr-2" />
                  Preferences
                </h3>
                <div className="space-y-3">
                <div>
                    <div className="text-sm text-gray-600">Review Frequency</div>
                    <div className="font-medium text-gray-900">{analysis.preferences.reviewFrequency}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Investment Approach</div>
                    <div className="font-medium text-gray-900">{analysis.preferences.approach}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-600">Tax Optimization</div>
                    <div className="font-medium text-gray-900">{analysis.preferences.taxOptimization}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Profile; 