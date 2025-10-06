// main_dashboard.jsx
// This is the main dashboard page, showing real-time financial summary, charts, and recent transactions.
// It connects to the backend for financial data and transaction APIs, and keeps the UI in sync with the backend.

// --- API CONNECTIONS & ENDPOINTS ---
// Backend Server: http://localhost:5000 (Node.js/Express)
// API Base URL: http://localhost:5000/api
// Authentication: JWT tokens stored in localStorage
// Real-time Updates: Polling every 15 seconds
//
// GET /api/financial-data - Fetch user's financial summary
// PUT /api/financial-data - Update financial summary (reset, sync)
// GET /api/transactions - Fetch all user transactions
//
// Data flows: Frontend fetches and updates data via these endpoints, and updates UI accordingly.

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Bell, User, TrendingUp, TrendingDown, Calendar, FileText, BarChart3, 
  Download, ArrowRight, Plus, Settings, Eye, Edit, Trash2, 
  DollarSign, CreditCard, PiggyBank, Target, AlertCircle, CheckCircle,
  Clock, RefreshCw, Zap, Lightbulb, X, Crown, IndianRupee
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import MainDashboardNavbar from './main_dashboard_navbar';
import { authAPI, financialAPI } from '../services/api';
import UserContextService from '../services/UserContextService';

const API_KEY = '0a7786ee8c5b4597859684eb17df7e6c';
const STOCK_OPTIONS = [
  { label: 'Apple (AAPL)', value: 'AAPL' },
  { label: 'Tesla (TSLA)', value: 'TSLA' },
  { label: 'Microsoft (MSFT)', value: 'MSFT' },
  { label: 'Google (GOOGL)', value: 'GOOGL' },
  { label: 'Amazon (AMZN)', value: 'AMZN' },
  { label: 'Nvidia (NVDA)', value: 'NVDA' },
  { label: 'Meta (META)', value: 'META' },
  { label: 'Reliance (RELIANCE.BSE)', value: 'RELIANCE.BSE' },
  { label: 'Tata Motors (TATAMOTORS.BSE)', value: 'TATAMOTORS.BSE' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const MainDashboard = () => {
  const navigate = useNavigate();
  
  // Real-time state management - all starting with empty/zero values
  const [stockData, setStockData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  
  // Personalized data from 20-question survey
  const [userProfile, setUserProfile] = useState(null);
  const [personalizedGoals, setPersonalizedGoals] = useState([]);
  const [personalizedInsights, setPersonalizedInsights] = useState([]);
  const [personalizedExpenses, setPersonalizedExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Financial data - starts with zeros, will be populated from backend
  const [financialData, setFinancialData] = useState({
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    netSavings: 0,
    budget: 50000,
    spent: 0,
    budgetProgress: 0
  });
  
  // Recent transactions - starts empty, populated from backend
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  // AI tips - starts empty, populated from backend
  const [aiTips, setAiTips] = useState([]);
  
  // Notifications - starts empty, populated from backend
  const [notifications, setNotifications] = useState([]);
  
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [toasts, setToasts] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [budgetForm, setBudgetForm] = useState({
    amount: '',
    category: 'general'
  });

  // Real-time data fetching
  const fetchStockData = useCallback(async () => {
      setLoading(true);
      const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&apikey=${API_KEY}&outputsize=30`;
      try {
        const response = await axios.get(url);
        if (response.data && response.data.values) {
          // Get USD to INR exchange rate
          const usdToInrRate = await getUSDToINRRate();
          
          setStockData(
            response.data.values
              .reverse()
              .map(item => ({
                time: item.datetime.slice(11, 16),
                price: parseFloat(item.close) * usdToInrRate // Convert USD to INR
              }))
          );
        }
      } catch (err) {
      console.error('Stock data fetch error:', err);
    }
    setLoading(false);
  }, [symbol]);

  // Get USD to INR exchange rate
  const getUSDToINRRate = async () => {
    try {
      // Using a free exchange rate API
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      return response.data.rates.INR;
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
      // Fallback to approximate rate if API fails
      return 83.0; // Approximate USD to INR rate
    }
  };

  const fetchUserData = useCallback(async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response) {
        setUser(response);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, []);

  // Fetch real financial data from backend
  const fetchFinancialData = useCallback(async () => {
    try {
      console.log('Fetching financial data...');
      const response = await financialAPI.getFinancialData();
      console.log('Financial data response:', response);
      if (response.success) {
        setFinancialData(response.data);
        console.log('Financial data updated:', response.data);
      } else {
        console.error('Failed to fetch financial data:', response.message);
      }
    } catch (error) {
      console.error('Failed to fetch financial data:', error);
    }
  }, []);

  // Fetch real transactions from backend
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await financialAPI.getTransactions();
      if (response.success) {
        // Take only the most recent 5 transactions for dashboard
        const recent = response.data.slice(0, 5);
        setRecentTransactions(recent);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  }, []);

  // Fetch AI tips from backend
  const fetchAiTips = useCallback(async () => {
    try {
      const response = await financialAPI.getAiTips();
      if (response.success) {
        setAiTips(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch AI tips:', error);
    }
  }, []);

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await financialAPI.getNotifications();
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  const updateFinancialData = useCallback(() => {
    // Fetch real data from API instead of simulating
    fetchFinancialData();
    fetchTransactions(); // Also fetch transactions to sync with expense tracker
    setLastUpdated(new Date());
  }, [fetchFinancialData, fetchTransactions]);

  // Real-time intervals
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      navigate('/login');
      return;
    }

    setUser(userData);
    
    // Load personalized data from survey answers
    loadPersonalizedData();
    
    fetchFinancialData();
    fetchStockData();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchFinancialData();
      fetchStockData();
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  // Load personalized data based on 20-question survey answers
  const loadPersonalizedData = () => {
    const profile = UserContextService.getFinancialProfile();
    const goals = UserContextService.getPersonalizedGoals();
    const insights = UserContextService.getPersonalizedInsights();
    const expenses = UserContextService.getPersonalizedExpenseCategories();
    
    setUserProfile(profile);
    setPersonalizedGoals(goals);
    setPersonalizedInsights(insights);
    setPersonalizedExpenses(expenses);
    
    // Update financial data with survey answers if available
    if (profile && profile.monthlyIncome) {
      setFinancialData(prev => ({
        ...prev,
        monthlyIncome: profile.monthlyIncome,
        monthlyExpenses: profile.monthlyExpenses || prev.monthlyExpenses,
        currentBalance: profile.currentSavings || prev.currentBalance,
        netSavings: (profile.monthlyIncome || 0) - (profile.monthlyExpenses || 0)
      }));
    }
  };

  // Real-time data initialization
  useEffect(() => {
    const initializeData = async () => {
      setDataLoading(true);
      try {
        await Promise.all([
          fetchStockData(),
          fetchUserData(),
          fetchFinancialData(),
          fetchTransactions(),
          fetchAiTips(),
          fetchNotifications()
        ]);
      } catch (error) {
        console.error('Failed to initialize dashboard data:', error);
        addToast('Failed to load dashboard data', 'error');
      } finally {
        setDataLoading(false);
      }
    };

    initializeData();
    
    const stockInterval = setInterval(fetchStockData, 60000); // Every minute
    const financialInterval = setInterval(updateFinancialData, 15000); // Every 15 seconds - faster sync
    const transactionInterval = setInterval(fetchTransactions, 15000); // Every 15 seconds
    const notificationInterval = setInterval(fetchNotifications, 45000); // Every 45 seconds
    
    return () => {
      clearInterval(stockInterval);
      clearInterval(financialInterval);
      clearInterval(transactionInterval);
      clearInterval(notificationInterval);
    };
  }, [fetchStockData, fetchUserData, fetchFinancialData, fetchTransactions, fetchAiTips, fetchNotifications, updateFinancialData]);

  // Click handlers
  const handleCardClick = (cardType) => {
    switch (cardType) {
      case 'balance':
        navigate('/expense-tracker');
        break;
      case 'income':
        navigate('/goals');
        break;
      case 'expenses':
        navigate('/expense-tracker');
        break;
      case 'savings':
        navigate('/insights');
        break;
      default:
        break;
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'reports':
        navigate('/insights');
        break;
      case 'analysis':
        navigate('/insights');
        break;
      case 'generate':
        // Generate report logic
        break;
      case 'download':
        // Download statement logic
        break;
      default:
        break;
    }
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleBudgetEdit = () => {
    setBudgetForm({
      amount: financialData.budget.toString(),
      category: 'general'
    });
    setShowBudgetModal(true);
  };

  const handleBudgetSave = async () => {
    try {
      const response = await financialAPI.updateBudget(budgetForm);
      if (response.success) {
        addToast('Budget updated successfully!', 'success');
        setShowBudgetModal(false);
        fetchFinancialData(); // Refresh data
      }
    } catch (error) {
      addToast('Failed to update budget', 'error');
    }
  };

  const handleNotificationClick = (notification) => {
    addToast(`Notification: ${notification.message}`, 'info');
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
  };

  const handleReset = async () => {
    try {
      // Reset financial data to zero
      await financialAPI.updateFinancialData({
        monthlyIncome: 0,
        monthlyExpenses: 0,
        currentBalance: 0,
        netSavings: 0
      });
      
      // Refresh data
      fetchFinancialData();
      fetchTransactions();
      
      addToast('Dashboard reset successfully!', 'success');
    } catch (error) {
      addToast('Failed to reset dashboard', 'error');
    }
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainDashboardNavbar />

      {/* Loading Overlay */}
      {dataLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your financial dashboard...</p>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Real-time status bar */}
        <div className="mb-6 flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Data</span>
            </div>
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleReset}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Reset All</span>
            </button>
            <button 
              onClick={() => {
                fetchStockData();
                fetchFinancialData();
                fetchTransactions();
                fetchAiTips();
                fetchNotifications();
                setLastUpdated(new Date());
              }}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Refresh</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Stock Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Live Market Data</h3>
                <div className="flex space-x-2">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-black"
                    value={symbol}
                    onChange={e => setSymbol(e.target.value)}
                  >
                    {STOCK_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockData}>
                    <XAxis dataKey="time" />
                    <YAxis 
                      domain={['auto', 'auto']} 
                      tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Price']}
                      labelStyle={{ color: '#000' }}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={false}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
                {loading && (
                  <div className="text-center text-gray-500 mt-2">
                    <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
                    Loading...
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Balance */}
              <div 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
                onClick={() => handleCardClick('balance')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Current Balance</span>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatCurrency(financialData.currentBalance)}
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Real-time from backend
                </div>
              </div>

              {/* Monthly Income */}
              <div 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
                onClick={() => handleCardClick('income')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Monthly Income</span>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatCurrency(financialData.monthlyIncome)}
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  From expense tracker
                </div>
              </div>

              {/* Monthly Expenses */}
              <div 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
                onClick={() => handleCardClick('expenses')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Monthly Expenses</span>
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatCurrency(financialData.monthlyExpenses)}
                </div>
                <div className="flex items-center text-red-600 text-sm">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  From expense tracker
                </div>
              </div>

              {/* Net Savings */}
              <div 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
                onClick={() => handleCardClick('savings')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Net Savings</span>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <PiggyBank className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatCurrency(financialData.netSavings)}
                </div>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Calculated from data
                </div>
              </div>
            </div>

            {/* Interactive Budget Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
                <button 
                  onClick={handleBudgetEdit}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Set/Edit Budget</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                {/* Animated Circular Progress */}
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={financialData.budgetProgress > 80 ? "#ef4444" : "#10b981"}
                      strokeWidth="3"
                      strokeDasharray={`${financialData.budgetProgress}, 100`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{financialData.budgetProgress.toFixed(0)}%</div>
                      <div className="text-xs text-gray-500">of budget</div>
                    </div>
                  </div>
                </div>
                
                {/* Budget Details */}
                <div className="flex-1 ml-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Monthly Budget</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(financialData.budget)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600">Spent so far</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(financialData.spent)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        financialData.budgetProgress > 80 ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{width: `${financialData.budgetProgress}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Sidebar */}
          <div className="space-y-6">
            {/* Smart AI Tips */}
            <div className="space-y-3">
              {aiTips.length > 0 ? (
                aiTips.map((tip) => (
                  <div 
                    key={tip.id}
                    className={`rounded-xl p-4 border transition-all hover:shadow-md cursor-pointer ${
                      tip.type === 'warning' 
                        ? 'bg-orange-50 border-orange-200' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        tip.type === 'warning' ? 'bg-orange-600' : 'bg-green-600'
                      }`}>
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <span className={`font-medium text-sm ${
                        tip.type === 'warning' ? 'text-orange-900' : 'text-green-900'
                      }`}>
                        Smart AI Tip
                      </span>
                    </div>
                    <p className={`text-sm ${
                      tip.type === 'warning' ? 'text-orange-800' : 'text-green-800'
                    }`}>
                      {tip.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl p-4 border border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-600">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <span className="font-medium text-sm text-gray-900">
                      No AI Tips Yet
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Add some transactions to get personalized financial tips!
                  </p>
                </div>
              )}
            </div>

            {/* Recent Transactions from Expense Tracker */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button 
                  onClick={() => navigate('/expense-tracker')}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View All →
                </button>
              </div>
              
              <div className="space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div 
                      key={transaction._id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          <Calendar className={`w-4 h-4 ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{transaction.title}</div>
                          <div className="text-xs text-gray-500">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold text-sm ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500">{transaction.category}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm mb-4">No transactions yet</p>
                    <button 
                      onClick={() => navigate('/expense-tracker')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Add First Transaction
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/gold-dashboard')}
                  className="flex flex-col items-center space-y-2 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-all transform hover:scale-105"
                >
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-900">Gold Dashboard</span>
                </button>
                
                
                <button 
                  onClick={() => handleQuickAction('reports')}
                  className="flex flex-col items-center space-y-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all transform hover:scale-105"
                >
                  <FileText className="w-6 h-6 text-purple-600" />
                  <span className="text-xs font-medium text-purple-900">View Reports</span>
                </button>
                
                <button 
                  onClick={() => handleQuickAction('analysis')}
                  className="flex flex-col items-center space-y-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-all transform hover:scale-105"
                >
                  <BarChart3 className="w-6 h-6 text-green-600" />
                  <span className="text-xs font-medium text-green-900">Category Analysis</span>
                </button>
                
                <button 
                  onClick={() => navigate('/expense-tracker')}
                  className="flex flex-col items-center space-y-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all transform hover:scale-105"
                >
                  <Plus className="w-6 h-6 text-blue-600" />
                  <span className="text-xs font-medium text-blue-900">Add Transaction</span>
                </button>
              </div>
            </div>

            {/* Real-time Notifications */}
            {notifications.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{notification.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Budget</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Budget Amount
                </label>
                <input
                  type="number"
                  value={budgetForm.amount}
                  onChange={(e) => setBudgetForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter budget amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={budgetForm.category}
                  onChange={(e) => setBudgetForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="food">Food & Dining</option>
                  <option value="transportation">Transportation</option>
                  <option value="utilities">Utilities</option>
                  <option value="shopping">Shopping</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowBudgetModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleBudgetSave}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Title:</span>
                <span className="font-semibold text-gray-900">{selectedTransaction.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(selectedTransaction.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold text-gray-900">{selectedTransaction.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Type:</span>
                <span className="font-semibold text-gray-900">{selectedTransaction.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold text-gray-900">{selectedTransaction.category}</span>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => setShowTransactionModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`p-3 rounded-lg shadow-lg flex items-center space-x-3 ${
                toast.type === 'success' ? 'bg-green-500 text-white' :
                toast.type === 'error' ? 'bg-red-500 text-white' :
                toast.type === 'warning' ? 'bg-orange-500 text-white' :
                'bg-blue-500 text-white'
              }`}
            >
              {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'warning' && <Lightbulb className="w-5 h-5" />}
              {toast.type === 'info' && <Zap className="w-5 h-5" />}
              <span>{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="text-white hover:text-gray-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainDashboard;