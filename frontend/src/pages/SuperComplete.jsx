import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, MessageCircle, TrendingUp, Target, DollarSign, BarChart3, 
  Play, Pause, Volume2, VolumeX, Settings, HelpCircle, 
  Zap, Crown, Star, Award, Trophy, Gift, Sparkles,
  Mic, MicOff, Video, Camera, Phone, Mail, Calendar,
  Users, Shield, Lock, Eye, EyeOff, Download, Share2,
  RefreshCw, Bell, AlertCircle, CheckCircle, X, Plus,
  ChevronRight, ChevronDown, ExternalLink, Maximize2,
  Minimize2, RotateCcw, Save, Edit, Trash2, Heart,
  ThumbsUp, ThumbsDown, Flag, Bookmark, Tag, Filter,
  Search, Grid, List, MoreHorizontal, MoreVertical
} from 'lucide-react';
import MainDashboardNavbar from './main_dashboard_navbar';
import AIAssistant from '../components/AIAssistant';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const SuperComplete = () => {
  // State management for all features
  const [activeTab, setActiveTab] = useState('overview');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userProgress, setUserProgress] = useState({
    goalsCompleted: 3,
    totalGoals: 8,
    investmentsActive: 5,
    totalSavings: 125000,
    monthlyIncome: 75000,
    monthlyExpenses: 45000
  });

  // Video content data
  const videoContent = [
    {
      id: 1,
      title: "Financial Planning Basics",
      duration: "5:30",
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop",
      category: "Education",
      views: "12.5K",
      likes: "890",
      description: "Learn the fundamentals of personal finance and budgeting"
    },
    {
      id: 2,
      title: "Investment Strategies for Beginners",
      duration: "8:15",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=225&fit=crop",
      category: "Investment",
      views: "8.2K",
      likes: "654",
      description: "Discover proven investment strategies for long-term wealth building"
    },
    {
      id: 3,
      title: "AI-Powered Financial Insights",
      duration: "6:45",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop",
      category: "Technology",
      views: "15.3K",
      likes: "1.2K",
      description: "How artificial intelligence is revolutionizing personal finance"
    },
    {
      id: 4,
      title: "Goal Setting & Achievement",
      duration: "7:20",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
      category: "Motivation",
      views: "9.8K",
      likes: "743",
      description: "Master the art of setting and achieving financial goals"
    }
  ];

  // Real-time data simulation
  const [realTimeData, setRealTimeData] = useState({
    portfolioValue: 125000,
    dailyChange: 2.3,
    weeklyChange: 5.7,
    monthlyChange: 12.4
  });

  // Chart data
  const portfolioData = [
    { name: 'Jan', value: 100000 },
    { name: 'Feb', value: 105000 },
    { name: 'Mar', value: 110000 },
    { name: 'Apr', value: 115000 },
    { name: 'May', value: 120000 },
    { name: 'Jun', value: 125000 }
  ];

  const goalData = [
    { name: 'Emergency Fund', value: 75, color: '#3B82F6' },
    { name: 'Vacation', value: 45, color: '#10B981' },
    { name: 'Car Purchase', value: 30, color: '#F59E0B' },
    { name: 'Retirement', value: 20, color: '#EF4444' }
  ];

  // AI Advisor responses
  const advisorResponses = [
    {
      id: 1,
      type: "tip",
      title: "Smart Savings Tip",
      message: "Consider automating your savings by setting up recurring transfers to your savings account. This ensures consistent progress toward your goals.",
      icon: "💡",
      priority: "high"
    },
    {
      id: 2,
      type: "alert",
      title: "Market Opportunity",
      message: "Current market conditions present a good opportunity to diversify your portfolio. Consider adding some international stocks.",
      icon: "📈",
      priority: "medium"
    },
    {
      id: 3,
      type: "achievement",
      title: "Goal Milestone",
      message: "Congratulations! You've reached 75% of your emergency fund goal. Keep up the great work!",
      icon: "🎉",
      priority: "high"
    }
  ];

  // Help topics
  const helpTopics = [
    {
      id: 1,
      title: "Getting Started",
      description: "Learn how to set up your account and make your first investment",
      icon: "🚀",
      articles: 5
    },
    {
      id: 2,
      title: "Investment Guide",
      description: "Comprehensive guide to understanding different investment options",
      icon: "📊",
      articles: 12
    },
    {
      id: 3,
      title: "Goal Setting",
      description: "How to set and achieve your financial goals effectively",
      icon: "🎯",
      articles: 8
    },
    {
      id: 4,
      title: "AI Assistant",
      description: "Maximize your experience with our AI-powered financial advisor",
      icon: "🤖",
      articles: 6
    }
  ];

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        portfolioValue: prev.portfolioValue + (Math.random() - 0.5) * 1000,
        dailyChange: prev.dailyChange + (Math.random() - 0.5) * 0.5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Video controls
  const handleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleVideoMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoChange = (index) => {
    setCurrentVideo(index);
    setIsVideoPlaying(true);
  };

  // Notification system
  const addNotification = (notification) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now(), timestamp: new Date() }]);
  };

  // Quick actions
  const handleQuickAction = (action) => {
    switch(action) {
      case 'chatbot':
        setShowChatbot(true);
        addNotification({ type: 'info', message: 'AI Assistant activated' });
        break;
      case 'advisor':
        setShowAdvisor(true);
        addNotification({ type: 'success', message: 'Financial advisor session started' });
        break;
      case 'help':
        setShowHelp(true);
        addNotification({ type: 'info', message: 'Help center opened' });
        break;
      case 'investment':
        setActiveTab('investment');
        addNotification({ type: 'info', message: 'Investment dashboard opened' });
        break;
      case 'goals':
        setActiveTab('goals');
        addNotification({ type: 'info', message: 'Goals section opened' });
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <MainDashboardNavbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Super Complete
              <span className="block text-2xl md:text-3xl text-blue-200 mt-2">
                Your All-in-One Financial Command Center
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Experience the future of personal finance with AI-powered insights, real-time data, 
              interactive videos, and comprehensive financial management tools.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => handleQuickAction('chatbot')}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <Bot className="w-5 h-5" />
                <span>AI Assistant</span>
              </button>
              <button 
                onClick={() => handleQuickAction('advisor')}
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors flex items-center space-x-2"
              >
                <Crown className="w-5 h-5" />
                <span>Smart Advisor</span>
              </button>
              <button 
                onClick={() => handleQuickAction('help')}
                className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors flex items-center space-x-2"
              >
                <HelpCircle className="w-5 h-5" />
                <span>Help Center</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Real-time Status Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Live Data</span>
              </div>
              <div className="text-sm text-gray-600">
                Portfolio: ₹{realTimeData.portfolioValue.toLocaleString()}
              </div>
              <div className={`text-sm font-medium ${realTimeData.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {realTimeData.dailyChange >= 0 ? '+' : ''}{realTimeData.dailyChange.toFixed(2)}% Today
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'investment', label: 'Investment', icon: TrendingUp },
                { id: 'goals', label: 'Goals', icon: Target },
                { id: 'videos', label: 'Learn', icon: Play },
                { id: 'advisor', label: 'AI Advisor', icon: Bot },
                { id: 'help', label: 'Help', icon: HelpCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Financial Summary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Portfolio Performance</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={portfolioData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Portfolio Value']} />
                        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Income</span>
                        <span className="font-semibold">₹{userProgress.monthlyIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Expenses</span>
                        <span className="font-semibold">₹{userProgress.monthlyExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Savings</span>
                        <span className="font-semibold text-green-600">₹{userProgress.totalSavings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h4>
                    <div className="space-y-3">
                      {goalData.map((goal, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{goal.name}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-300"
                                style={{ width: `${goal.value}%`, backgroundColor: goal.color }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{goal.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
                  <div className="space-y-4">
                    {advisorResponses.map((response) => (
                      <div key={response.id} className={`p-4 rounded-lg border-l-4 ${
                        response.priority === 'high' ? 'border-red-500 bg-red-50' :
                        response.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                        'border-blue-500 bg-blue-50'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{response.icon}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{response.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{response.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Achievement Unlocked!</h3>
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-8 h-8 text-yellow-300" />
                    <div>
                      <p className="font-medium">Consistent Saver</p>
                      <p className="text-sm text-blue-100">You've saved for 3 months straight!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Investment Tab */}
          {activeTab === 'investment' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Investment Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">₹{realTimeData.portfolioValue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Portfolio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">5</div>
                    <div className="text-sm text-gray-600">Active Investments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">12.4%</div>
                    <div className="text-sm text-gray-600">Monthly Return</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">₹15,000</div>
                    <div className="text-sm text-gray-600">Monthly Investment</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Stocks', value: 60, color: '#3B82F6' },
                            { name: 'Bonds', value: 25, color: '#10B981' },
                            { name: 'Crypto', value: 10, color: '#F59E0B' },
                            { name: 'Cash', value: 5, color: '#EF4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {[
                            { name: 'Stocks', value: 60, color: '#3B82F6' },
                            { name: 'Bonds', value: 25, color: '#10B981' },
                            { name: 'Crypto', value: 10, color: '#F59E0B' },
                            { name: 'Cash', value: 5, color: '#EF4444' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h4>
                  <div className="space-y-4">
                    {[
                      { name: 'Apple Inc.', symbol: 'AAPL', return: '+15.2%', color: 'text-green-600' },
                      { name: 'Tesla Inc.', symbol: 'TSLA', return: '+12.8%', color: 'text-green-600' },
                      { name: 'Microsoft Corp.', symbol: 'MSFT', return: '+8.5%', color: 'text-green-600' },
                      { name: 'Amazon.com Inc.', symbol: 'AMZN', return: '-2.1%', color: 'text-red-600' }
                    ].map((stock, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{stock.name}</div>
                          <div className="text-sm text-gray-600">{stock.symbol}</div>
                        </div>
                        <div className={`font-semibold ${stock.color}`}>{stock.return}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Financial Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'Emergency Fund', target: 100000, current: 75000, deadline: 'Dec 2024', color: 'blue' },
                    { name: 'Vacation Fund', target: 50000, current: 22500, deadline: 'Jun 2024', color: 'green' },
                    { name: 'Car Purchase', target: 300000, current: 90000, deadline: 'Mar 2025', color: 'purple' },
                    { name: 'Retirement Fund', target: 1000000, current: 150000, deadline: 'Dec 2030', color: 'orange' }
                  ].map((goal, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{goal.name}</h4>
                        <span className="text-sm text-gray-600">{goal.deadline}</span>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>₹{goal.current.toLocaleString()}</span>
                          <span>₹{goal.target.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-${goal.color}-500`}
                            style={{ width: `${(goal.current / goal.target) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round((goal.current / goal.target) * 100)}% Complete
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Educational Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoContent.map((video) => (
                    <div key={video.id} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <button 
                            onClick={() => handleVideoChange(video.id - 1)}
                            className="bg-white text-gray-900 rounded-full p-3 hover:bg-gray-100 transition-colors"
                          >
                            <Play className="w-6 h-6" />
                          </button>
                        </div>
                        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">{video.category}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{video.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{video.views} views</span>
                          <span>{video.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Player Modal */}
              {isVideoPlaying && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {videoContent[currentVideo]?.title}
                      </h3>
                      <button 
                        onClick={() => setIsVideoPlaying(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                      <div className="aspect-video flex items-center justify-center">
                        <div className="text-center text-white">
                          <Play className="w-16 h-16 mx-auto mb-4" />
                          <p className="text-lg">Video Player</p>
                          <p className="text-sm text-gray-300">Click to play {videoContent[currentVideo]?.title}</p>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4">
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={handleVideoPlay}
                            className="text-white hover:text-gray-300"
                          >
                            {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                          </button>
                          <div className="flex-1 bg-gray-600 rounded-full h-2">
                            <div className="bg-white h-2 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                          <button 
                            onClick={handleVideoMute}
                            className="text-white hover:text-gray-300"
                          >
                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Advisor Tab */}
          {activeTab === 'advisor' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">AI Financial Advisor</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Bot className="w-8 h-8 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Smart Recommendations</h4>
                      </div>
                      <p className="text-sm text-gray-700">
                        Based on your financial profile, I recommend increasing your emergency fund 
                        allocation by 15% and considering a diversified investment strategy.
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                        <h4 className="font-semibold text-gray-900">Market Insights</h4>
                      </div>
                      <p className="text-sm text-gray-700">
                        Current market conditions favor growth stocks. Consider rebalancing your 
                        portfolio to include more technology and healthcare sector investments.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Target className="w-8 h-8 text-purple-600" />
                        <h4 className="font-semibold text-gray-900">Goal Optimization</h4>
                      </div>
                      <p className="text-sm text-gray-700">
                        Your retirement goal is on track. To accelerate progress, consider 
                        increasing your monthly contribution by ₹5,000.
                      </p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <AlertCircle className="w-8 h-8 text-orange-600" />
                        <h4 className="font-semibold text-gray-900">Risk Assessment</h4>
                      </div>
                      <p className="text-sm text-gray-700">
                        Your current risk level is moderate. For your age and income, 
                        this is an appropriate allocation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Help Tab */}
          {activeTab === 'help' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Help Center</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {helpTopics.map((topic) => (
                    <div key={topic.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-3xl">{topic.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">{topic.title}</h4>
                          <p className="text-sm text-gray-600">{topic.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{topic.articles} articles</span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Explore →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Component */}
      {showChatbot && <AIAssistant />}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-16 right-4 bg-white rounded-xl shadow-lg border border-gray-200 w-80 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button 
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 space-y-3 z-40">
        <button 
          onClick={() => handleQuickAction('chatbot')}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="AI Assistant"
        >
          <Bot className="w-6 h-6" />
        </button>
        <button 
          onClick={() => handleQuickAction('advisor')}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
          title="Smart Advisor"
        >
          <Crown className="w-6 h-6" />
        </button>
        <button 
          onClick={() => handleQuickAction('help')}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors"
          title="Help Center"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default SuperComplete;
