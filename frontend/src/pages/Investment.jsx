import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Bell, Settings, User, Search, TrendingUp, TrendingDown, ChevronDown, Plus, Link, Bot, Twitter, Facebook, Linkedin, Instagram, Activity, DollarSign, PieChart, Target, Zap, AlertCircle, RefreshCw, Eye, EyeOff, Filter, Calendar, Download, Share2, Wifi, WifiOff } from 'lucide-react';
import MainDashboardNavbar from './main_dashboard_navbar';
import sharedDataService from '../services/sharedDataService';
import realTimeStockService from '../services/realTimeStockService';

const Investment = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6M');
  const [assetFilter, setAssetFilter] = useState('All Types');
  const [investments, setInvestments] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [smartTips, setSmartTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realTimeData, setRealTimeData] = useState({});
  const [marketNews, setMarketNews] = useState([]);
  const [portfolioChart, setPortfolioChart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showAllInvestments, setShowAllInvestments] = useState(false);
  const [showTradeConfirmation, setShowTradeConfirmation] = useState(false);
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastPriceUpdate, setLastPriceUpdate] = useState(null);
  const intervalRef = useRef(null);
  const chartRef = useRef(null);
  const realTimeSubscriptions = useRef([]);

  useEffect(() => {
    // Subscribe to real-time updates
    sharedDataService.on('dataUpdated', handleDataUpdate);
    sharedDataService.on('loading', setLoading);
    sharedDataService.on('error', handleError);
    
    // Initialize real-time stock service
    initializeRealTimeService();
    
    // Initialize and fetch data
    initializeData();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    return () => {
      sharedDataService.removeAllListeners();
      realTimeStockService.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Clean up real-time subscriptions
      realTimeSubscriptions.current.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const initializeRealTimeService = () => {
    // Set up real-time stock service event listeners
    realTimeStockService.on('connected', () => {
      setIsRealTimeConnected(true);
      setConnectionStatus('connected');
      console.log('Real-time connection established');
    });

    realTimeStockService.on('disconnected', () => {
      setIsRealTimeConnected(false);
      setConnectionStatus('disconnected');
      console.log('Real-time connection lost');
    });

    realTimeStockService.on('error', (error) => {
      console.error('Real-time service error:', error);
      setConnectionStatus('error');
    });

    realTimeStockService.on('priceUpdate', (priceData) => {
      setLastPriceUpdate(new Date());
      updateInvestmentPrice(priceData);
    });

    realTimeStockService.on('marketNews', (news) => {
      setMarketNews(news);
    });

    realTimeStockService.on('portfolioPerformance', (performance) => {
      updatePortfolioPerformance(performance);
    });

    // Connect to real-time service
    realTimeStockService.connect();
  };

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Generate real-time stock data
      const stockSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX', 'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'PYPL', 'UBER'];
      const stockNames = {
        'AAPL': 'Apple Inc', 'GOOGL': 'Alphabet Inc', 'MSFT': 'Microsoft Corp', 'AMZN': 'Amazon.com Inc',
        'TSLA': 'Tesla Inc', 'NVDA': 'NVIDIA Corp', 'META': 'Meta Platforms', 'NFLX': 'Netflix Inc',
        'AMD': 'Advanced Micro Devices', 'INTC': 'Intel Corp', 'CRM': 'Salesforce Inc', 'ORCL': 'Oracle Corp',
        'ADBE': 'Adobe Inc', 'PYPL': 'PayPal Holdings', 'UBER': 'Uber Technologies'
      };
      const stockIcons = {
        'AAPL': '🍎', 'GOOGL': '🔍', 'MSFT': '🪟', 'AMZN': '📦', 'TSLA': '🚗', 'NVDA': '🎮',
        'META': '👥', 'NFLX': '🎬', 'AMD': '⚡', 'INTC': '💾', 'CRM': '☁️', 'ORCL': '🗄️',
        'ADBE': '🎨', 'PYPL': '💳', 'UBER': '🚕'
      };
      
      const generateRandomInvestments = () => {
        const selectedStocks = stockSymbols.sort(() => 0.5 - Math.random()).slice(0, 8);
        return selectedStocks.map((symbol, index) => {
          const basePrice = 100 + Math.random() * 400;
          const shares = Math.floor(10 + Math.random() * 200);
          const avgPrice = basePrice * (0.8 + Math.random() * 0.4);
          const currentPrice = basePrice * (0.9 + Math.random() * 0.2);
          const amountInvested = avgPrice * shares;
          const currentValue = currentPrice * shares;
          const returnPercent = ((currentValue - amountInvested) / amountInvested * 100);
          const riskLevels = ['Low', 'Moderate', 'High'];
          const risk = riskLevels[Math.floor(Math.random() * 3)];
          
          return {
            id: index + 1,
            name: stockNames[symbol],
            symbol: symbol,
            type: 'Stock',
            amountInvested: Math.round(amountInvested),
            currentValue: Math.round(currentValue),
            shares: shares,
            avgPrice: Math.round(avgPrice * 100) / 100,
            currentPrice: Math.round(currentPrice * 100) / 100,
            return: `${returnPercent > 0 ? '+' : ''}${returnPercent.toFixed(1)}%`,
            returnColor: returnPercent > 0 ? 'text-green-500' : 'text-red-500',
            risk: risk,
            riskColor: risk === 'Low' ? 'bg-green-100 text-green-700' : 
                      risk === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700',
            icon: stockIcons[symbol],
            change24h: `${Math.random() > 0.5 ? '+' : ''}${((Math.random() - 0.5) * 6).toFixed(1)}%`,
            volume: `${(Math.random() * 100 + 10).toFixed(1)}M`
          };
        });
      };
      
      const mockData = {
        investments: generateRandomInvestments(),
        investmentSuggestions: [
          {
            title: 'NVIDIA Corp', symbol: 'NVDA', expectedReturn: '15-25%', minInvestment: '₹10,000',
            risk: 'High', riskColor: 'text-red-600', icon: '🎮', reason: 'AI boom driving growth', confidence: 85
          },
          {
            title: 'Vanguard S&P 500 ETF', symbol: 'VOO', expectedReturn: '8-12%', minInvestment: '₹5,000',
            risk: 'Low', riskColor: 'text-green-600', icon: '📈', reason: 'Diversified market exposure', confidence: 92
          },
          {
            title: 'Apple Inc', symbol: 'AAPL', expectedReturn: '10-18%', minInvestment: '₹8,000',
            risk: 'Moderate', riskColor: 'text-yellow-600', icon: '🍎', reason: 'Strong ecosystem and services growth', confidence: 88
          },
          {
            title: 'Microsoft Corp', symbol: 'MSFT', expectedReturn: '12-20%', minInvestment: '₹7,500',
            risk: 'Low', riskColor: 'text-green-600', icon: '🪟', reason: 'Cloud computing leadership', confidence: 90
          },
          {
            title: 'Amazon.com Inc', symbol: 'AMZN', expectedReturn: '14-22%', minInvestment: '₹12,000',
            risk: 'Moderate', riskColor: 'text-yellow-600', icon: '📦', reason: 'E-commerce and AWS dominance', confidence: 87
          },
          {
            title: 'Tesla Inc', symbol: 'TSLA', expectedReturn: '20-35%', minInvestment: '₹15,000',
            risk: 'High', riskColor: 'text-red-600', icon: '🚗', reason: 'EV market leader with innovation', confidence: 82
          }
        ],
        investmentTips: [
          'Consider rebalancing your portfolio - your tech allocation is at 75%',
          'Market volatility is high - consider dollar-cost averaging',
          'Your portfolio shows strong growth potential with current holdings'
        ]
      };
      
      handleDataUpdate(mockData);
      generatePortfolioChart(mockData.investments);
      fetchMarketNews();
      
    } catch (err) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = (data) => {
    setInvestments(data.investments || []);
    setSuggestions(data.investmentSuggestions || []);
    setSmartTips(data.investmentTips || []);
    
    // Subscribe to real-time updates for investment symbols
    if (data.investments && data.investments.length > 0) {
      subscribeToInvestmentSymbols(data.investments);
    }
  };

  const subscribeToInvestmentSymbols = (investments) => {
    // Clean up existing subscriptions
    realTimeSubscriptions.current.forEach(unsubscribe => unsubscribe());
    realTimeSubscriptions.current = [];

    // Subscribe to each investment symbol
    investments.forEach(investment => {
      if (investment.symbol) {
        const unsubscribe = realTimeStockService.subscribeToSymbol(
          investment.symbol,
          (priceData) => {
            updateInvestmentPrice(priceData);
          }
        );
        realTimeSubscriptions.current.push(unsubscribe);
      }
    });
  };

  const updateInvestmentPrice = (priceData) => {
    setInvestments(prev => prev.map(investment => {
      if (investment.symbol === priceData.symbol) {
        const newValue = priceData.price * investment.shares;
        const newReturn = ((newValue - investment.amountInvested) / investment.amountInvested * 100).toFixed(1);
        
        return {
          ...investment,
          currentPrice: priceData.price,
          currentValue: newValue,
          return: `${newReturn > 0 ? '+' : ''}${newReturn}%`,
          returnColor: newReturn > 0 ? 'text-green-500' : 'text-red-500',
          change24h: `${priceData.changePercent > 0 ? '+' : ''}${priceData.changePercent.toFixed(1)}%`,
          lastUpdated: priceData.lastUpdated,
          volume: priceData.volume ? `${(priceData.volume / 1000000).toFixed(1)}M` : investment.volume
        };
      }
      return investment;
    }));
  };

  const updatePortfolioPerformance = (performance) => {
    // Update portfolio chart with new performance data
    if (performance.summary) {
      setPortfolioChart(prev => {
        const newDataPoint = {
          date: new Date().toISOString().split('T')[0],
          value: performance.summary.totalCurrentValue
        };
        return [...prev.slice(-29), newDataPoint]; // Keep last 30 days
      });
    }
  };

  const startRealTimeUpdates = () => {
    // Real-time updates are now handled by WebSocket connection
    // Keep fallback interval for news updates
    intervalRef.current = setInterval(() => {
      // Update market news occasionally
      if (Math.random() < 0.1) { // 10% chance to update news
        fetchMarketNews();
      }
      
      // Fetch portfolio performance if real-time connection is not available
      if (!isRealTimeConnected && investments.length > 0) {
        fetchPortfolioPerformance();
      }
    }, 30000); // Update every 30 seconds
  };

  const fetchPortfolioPerformance = async () => {
    try {
      const performance = await realTimeStockService.fetchPortfolioPerformance(investments);
      updatePortfolioPerformance(performance);
    } catch (error) {
      console.error('Error fetching portfolio performance:', error);
    }
  };

  const generatePortfolioChart = (investments) => {
    const chartData = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const totalValue = investments.reduce((sum, inv) => {
        const randomVariation = 0.95 + Math.random() * 0.1;
        return sum + (inv.currentValue * randomVariation);
      }, 0);
      
      chartData.push({
        date: date.toISOString().split('T')[0],
        value: totalValue
      });
    }
    
    setPortfolioChart(chartData);
  };

  const fetchMarketNews = async () => {
    try {
      if (isRealTimeConnected) {
        // Try to fetch real-time news
        const newsData = await realTimeStockService.fetchMarketNews();
        setMarketNews(newsData.news || []);
      } else {
        // Fallback to mock news
        const newsOptions = [
          {
            id: 1,
            title: 'Tech Stocks Rally on AI Optimism',
            summary: 'Major tech companies see gains as AI adoption accelerates across industries.',
            time: `${Math.floor(Math.random() * 6) + 1} hours ago`,
            impact: 'positive'
          },
          {
            id: 2,
            title: 'Federal Reserve Hints at Rate Stability',
            summary: 'Latest Fed comments suggest interest rates may remain stable through Q4.',
            time: `${Math.floor(Math.random() * 8) + 2} hours ago`,
            impact: 'neutral'
          },
          {
            id: 3,
            title: 'Energy Sector Faces Headwinds',
            summary: 'Oil prices decline amid global economic uncertainty.',
            time: `${Math.floor(Math.random() * 12) + 4} hours ago`,
            impact: 'negative'
          },
          {
            id: 4,
            title: 'Market Volatility Expected This Week',
            summary: 'Analysts predict increased volatility due to upcoming economic data releases.',
            time: `${Math.floor(Math.random() * 3) + 1} hours ago`,
            impact: 'neutral'
          },
          {
            id: 5,
            title: 'Cryptocurrency Market Surges',
            summary: 'Bitcoin and major altcoins see significant gains amid institutional adoption.',
            time: `${Math.floor(Math.random() * 5) + 1} hours ago`,
            impact: 'positive'
          }
        ];
        
        // Randomly select 3 news items
        const selectedNews = newsOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
        setMarketNews(selectedNews);
      }
    } catch (error) {
      console.error('Error fetching market news:', error);
      // Fallback to empty array or cached news
    }
  };

  const handleError = (err) => {
    setError('Failed to load data. Please try again.');
  };

  const handleViewDetails = (investment) => {
    setSelectedInvestment(investment);
    setShowDetailsModal(true);
  };

  const handleInvestNow = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setShowInvestModal(true);
  };

  const handleLearnMore = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setShowLearnMoreModal(true);
  };

  const tradingPlatforms = [
    { name: 'Zerodha', logo: '🟢', url: 'https://zerodha.com', description: 'India\'s largest stock broker' },
    { name: 'Groww', logo: '💚', url: 'https://groww.in', description: 'Simple investing for everyone' },
    { name: 'Upstox', logo: '🔵', url: 'https://upstox.com', description: 'Trade with advanced tools' },
    { name: 'Angel One', logo: '😇', url: 'https://angelone.in', description: 'Smart trading platform' },
    { name: 'HDFC Securities', logo: '🏦', url: 'https://hdfcsec.com', description: 'Trusted banking partner' },
    { name: 'ICICI Direct', logo: '🏛️', url: 'https://icicidirect.com', description: 'Complete investment solution' }
  ];

  const openTradingPlatform = (platform) => {
    window.open(platform.url, '_blank');
    setShowInvestModal(false);
    setShowTradeConfirmation(true);
    setTimeout(() => setShowTradeConfirmation(false), 3000);
  };

  const handleNewsReadMore = (news) => {
    setSelectedNews(news);
    setShowNewsModal(true);
  };

  const handleViewAllInvestments = () => {
    setShowAllInvestments(true);
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'add':
        alert('Add Investment feature - Would integrate with brokerage APIs');
        break;
      case 'rebalance':
        alert('Portfolio Rebalancing - Analyzing your current allocation...');
        break;
      case 'export':
        const csvContent = investments.map(inv => 
          `${inv.name},${inv.symbol},${inv.type},${inv.amountInvested},${inv.currentValue},${inv.return}`
        ).join('\n');
        const blob = new Blob([`Name,Symbol,Type,Invested,Current Value,Return\n${csvContent}`], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio_data.csv';
        a.click();
        break;
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'My Investment Portfolio',
            text: `Check out my portfolio performance: Total value ₹${investments.reduce((sum, inv) => sum + inv.currentValue, 0).toLocaleString()}`,
            url: window.location.href
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
          alert('Portfolio link copied to clipboard!');
        }
        break;
    }
  };

  // Add this function inside the Investment component
  const addMockInvestment = async () => {
    const mock = {
      name: 'Apple Inc',
      type: 'Stock',
      amountInvested: 10000,
      currentValue: 12500,
      return: '+25%',
      returnColor: 'text-green-500',
      risk: 'Moderate',
      riskColor: 'bg-yellow-100 text-yellow-700',
      icon: '🍎'
    };
    if (sharedDataService.addInvestment) {
      await sharedDataService.addInvestment(mock);
      alert('Mock investment added!');
    } else {
      alert('No addInvestment method found in sharedDataService.');
    }
  };

  // Filter investments by asset type
  const filteredInvestments = assetFilter === 'All Types'
    ? investments
    : investments.filter(inv => inv.type && inv.type.toLowerCase().includes(assetFilter.toLowerCase().replace('s', '')));

  return (
    <div className="min-h-screen bg-gray-50">
      <MainDashboardNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <span className="text-red-600">⚠️</span>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}
        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading investments...</div>
        ) : (
          <>
        {/* Real-time Connection Status */}
        <div className="mb-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {isRealTimeConnected ? (
                  <Wifi className="w-5 h-5 text-green-600" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  isRealTimeConnected ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isRealTimeConnected ? 'Live Data' : 'Offline Mode'}
                </span>
              </div>
              {lastPriceUpdate && (
                <span className="text-xs text-gray-500">
                  Last update: {lastPriceUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                isRealTimeConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <span className="text-xs text-gray-500">
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'disconnected' ? 'Disconnected' : 'Error'}
              </span>
            </div>
          </div>
        </div>

        {/* Portfolio Snapshot */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Portfolio Snapshot</h1>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* You can calculate these from investments if needed */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Invested</p>
                <div className="p-1 bg-blue-50 rounded">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{investments.reduce((sum, inv) => sum + (Number(inv.amountInvested) || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Current Value</p>
                <div className="p-1 bg-blue-50 rounded">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{investments.reduce((sum, inv) => sum + (Number(inv.currentValue) || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Returns</p>
                <div className="p-1 bg-green-50 rounded">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-green-600">
                  {(() => {
                    const invested = investments.reduce((sum, inv) => sum + (Number(inv.amountInvested) || 0), 0);
                    const current = investments.reduce((sum, inv) => sum + (Number(inv.currentValue) || 0), 0);
                    if (!invested) return '0%';
                    const percent = ((current - invested) / invested) * 100;
                    return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
                  })()}
                </p>
                <span className="text-sm text-gray-500">
                  (₹{(investments.reduce((sum, inv) => sum + (Number(inv.currentValue) || 0), 0) - investments.reduce((sum, inv) => sum + (Number(inv.amountInvested) || 0), 0)).toLocaleString()})
                </span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Risk Level</p>
                <div className="p-1 bg-yellow-50 rounded">
                  <BarChart3 className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {investments.length > 0 ? (investments[0].risk || 'Moderate') : 'N/A'}
                </p>
                <span className="inline-block bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded mt-1">
                  {investments.length > 0 ? (investments[0].risk || 'Moderate') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          {/* Chart and Watchlist sections can be made dynamic if you have data */}
        </div>
        {/* Your Investments */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Investments</h2>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <button
                onClick={addMockInvestment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add Mock Investment
              </button>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search investments..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  // Add search logic if needed
                />
              </div>
              <div className="relative">
                <select 
                  value={assetFilter}
                  onChange={(e) => setAssetFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>All Types</option>
                  <option>Stocks</option>
                  <option>Bonds</option>
                  <option>Crypto</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Invested</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvestments.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-gray-500">No investments found.</td></tr>
                  ) : (
                    filteredInvestments.map((investment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{investment.icon || '📈'}</span>
                            <span className="text-sm font-medium text-gray-900">{investment.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investment.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{Number(investment.amountInvested).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{Number(investment.currentValue).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${investment.returnColor || ''}`}>{investment.return || ''}</span>
                            {isRealTimeConnected && investment.lastUpdated && (
                              <div className="flex items-center space-x-1">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-400">{investment.lastUpdated}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${investment.riskColor || ''}`}>
                            {investment.risk || 'Moderate'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleViewDetails(investment)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Real-time Market News */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Market News & Alerts</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  isRealTimeConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className={`text-sm ${
                  isRealTimeConnected ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {isRealTimeConnected ? 'Live' : 'Offline'}
                </span>
              </div>
              <button 
                onClick={() => fetchMarketNews()}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {marketNews.map((news) => (
              <div key={news.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    news.impact === 'positive' ? 'bg-green-500' :
                    news.impact === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-xs text-gray-500">{news.time}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{news.title}</h3>
                <p className="text-xs text-gray-600 mb-3">{news.summary}</p>
                <button 
                  onClick={() => handleNewsReadMore(news)}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Performance Chart */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Chart Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Portfolio Performance</h2>
                  <p className="text-sm text-gray-600 mt-1">Track your investment growth over time</p>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Performance Indicator */}
                  <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">Live Data</span>
                  </div>
                  
                  {/* Time Period Selector */}
                  <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                    {['1D', '1W', '1M', '3M', '6M', '1Y'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                          selectedPeriod === period
                            ? 'bg-blue-600 text-white shadow-md transform scale-105'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Content */}
            <div className="p-6">
              {/* Portfolio Value Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Current Value</p>
                      <p className="text-2xl font-bold text-green-900">
                        ₹{investments.reduce((sum, inv) => sum + inv.currentValue, 0).toLocaleString()}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Total Invested</p>
                      <p className="text-2xl font-bold text-blue-900">
                        ₹{investments.reduce((sum, inv) => sum + inv.amountInvested, 0).toLocaleString()}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Net Gain/Loss</p>
                      <p className={`text-2xl font-bold ${
                        (investments.reduce((sum, inv) => sum + inv.currentValue, 0) - investments.reduce((sum, inv) => sum + inv.amountInvested, 0)) >= 0 
                          ? 'text-green-900' : 'text-red-900'
                      }`}>
                        ₹{(investments.reduce((sum, inv) => sum + inv.currentValue, 0) - investments.reduce((sum, inv) => sum + inv.amountInvested, 0)).toLocaleString()}
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Professional Chart */}
              <div className="relative bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                <div className="h-80 relative">
                  <svg className="w-full h-full" viewBox="0 0 900 300">
                    {/* Enhanced Chart Background */}
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1E40AF" />
                        <stop offset="50%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#60A5FA" />
                      </linearGradient>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.1"/>
                      </filter>
                    </defs>
                    
                    {/* Chart Area Background */}
                    <rect x="80" y="40" width="740" height="200" fill="#FAFAFA" stroke="#E5E7EB" strokeWidth="1" rx="4" />
                    
                    {/* Enhanced Grid Lines */}
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <g key={i}>
                        <line x1="80" y1={50 + i * 33} x2="820" y2={50 + i * 33} stroke="#F3F4F6" strokeWidth="1" strokeDasharray="2,2" />
                        {portfolioChart.length > 0 && (
                          <text x="70" y={55 + i * 33} fontSize="11" fill="#6B7280" textAnchor="end">
                            ₹{Math.round((Math.max(...portfolioChart.map(p => p.value)) - (i * (Math.max(...portfolioChart.map(p => p.value)) - Math.min(...portfolioChart.map(p => p.value))) / 5)) / 1000)}K
                          </text>
                        )}
                      </g>
                    ))}
                    
                    {/* Vertical Grid Lines */}
                    {portfolioChart.length > 0 && portfolioChart.map((point, index) => {
                      if (index % Math.ceil(portfolioChart.length / 6) === 0) {
                        const x = 80 + (index * 740 / (portfolioChart.length - 1));
                        return (
                          <g key={`vgrid-${index}`}>
                            <line x1={x} y1="40" x2={x} y2="240" stroke="#F3F4F6" strokeWidth="1" strokeDasharray="2,2" />
                            <text x={x} y="260" fontSize="11" fill="#6B7280" textAnchor="middle">
                              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </text>
                          </g>
                        );
                      }
                      return null;
                    })}
                    
                    {/* Fill Area with Enhanced Gradient */}
                    {portfolioChart.length > 0 && (
                      <path
                        d={portfolioChart.map((point, index) => {
                          const x = 80 + (index * 740 / (portfolioChart.length - 1));
                          const maxValue = Math.max(...portfolioChart.map(p => p.value));
                          const minValue = Math.min(...portfolioChart.map(p => p.value));
                          const y = 230 - ((point.value - minValue) / (maxValue - minValue)) * 180;
                          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ') + ' L 820 230 L 80 230 Z'}
                        fill="url(#chartGradient)"
                        filter="url(#shadow)"
                      />
                    )}
                    
                    {/* Main Chart Line with Enhanced Styling */}
                    {portfolioChart.length > 0 && (
                      <path
                        d={portfolioChart.map((point, index) => {
                          const x = 80 + (index * 740 / (portfolioChart.length - 1));
                          const maxValue = Math.max(...portfolioChart.map(p => p.value));
                          const minValue = Math.min(...portfolioChart.map(p => p.value));
                          const y = 230 - ((point.value - minValue) / (maxValue - minValue)) * 180;
                          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                        }).join(' ')}
                        stroke="url(#lineGradient)"
                        strokeWidth="4"
                        fill="none"
                        filter="url(#shadow)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    
                    {/* Enhanced Data Points */}
                    {portfolioChart.map((point, index) => {
                      const x = 80 + (index * 740 / (portfolioChart.length - 1));
                      const maxValue = Math.max(...portfolioChart.map(p => p.value));
                      const minValue = Math.min(...portfolioChart.map(p => p.value));
                      const y = 230 - ((point.value - minValue) / (maxValue - minValue)) * 180;
                      
                      // Show points only at key intervals
                      if (index % Math.ceil(portfolioChart.length / 8) === 0 || index === portfolioChart.length - 1) {
                        return (
                          <g key={`point-${index}`}>
                            <circle cx={x} cy={y} r="6" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="3" filter="url(#shadow)" />
                            <circle cx={x} cy={y} r="3" fill="#3B82F6" />
                            
                            {/* Tooltip on hover */}
                            <g className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                              <rect x={x - 40} y={y - 35} width="80" height="25" fill="#1F2937" rx="4" filter="url(#shadow)" />
                              <text x={x} y={y - 18} fontSize="11" fill="white" textAnchor="middle" fontWeight="bold">
                                ₹{Math.round(point.value / 1000)}K
                              </text>
                            </g>
                          </g>
                        );
                      }
                      return null;
                    })}
                    
                    {/* Chart Title and Axis Labels */}
                    <text x="450" y="25" fontSize="14" fontWeight="bold" fill="#1F2937" textAnchor="middle">
                      Portfolio Value Trend ({selectedPeriod})
                    </text>
                    
                    {/* Y-axis Label */}
                    <text x="25" y="140" fontSize="12" fill="#6B7280" textAnchor="middle" transform="rotate(-90 25 140)">
                      Portfolio Value (₹)
                    </text>
                    
                    {/* X-axis Label */}
                    <text x="450" y="290" fontSize="12" fill="#6B7280" textAnchor="middle">
                      Time Period
                    </text>
                  </svg>
                </div>
                
                {/* Chart Legend */}
                <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
                    <span className="text-sm font-medium text-gray-700">Portfolio Value</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Data Points</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded border border-blue-200"></div>
                    <span className="text-sm font-medium text-gray-700">Growth Area</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Asset Allocation */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Asset Allocation</h3>
            <div className="space-y-4">
              {investments.map((investment, index) => {
                const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
                const percentage = totalValue > 0 ? (investment.currentValue / totalValue * 100).toFixed(1) : 0;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{investment.icon}</span>
                      <span className="text-sm font-medium text-gray-900">{investment.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk Analysis */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Portfolio Risk Score</span>
                <span className="text-lg font-bold text-yellow-600">6.5/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-3 rounded-full relative">
                  <div className="absolute top-0 left-[65%] w-3 h-3 bg-white border-2 border-yellow-600 rounded-full transform -translate-x-1/2"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-green-600 text-sm font-bold">L</span>
                  </div>
                  <span className="text-xs text-gray-600">Low Risk</span>
                  <p className="text-sm font-medium text-gray-900">25%</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-yellow-600 text-sm font-bold">M</span>
                  </div>
                  <span className="text-xs text-gray-600">Medium Risk</span>
                  <p className="text-sm font-medium text-gray-900">42%</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-red-600 text-sm font-bold">H</span>
                  </div>
                  <span className="text-xs text-gray-600">High Risk</span>
                  <p className="text-sm font-medium text-gray-900">33%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Investment Suggestions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-gray-900">AI Investment Recommendations</h2>
              <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
                <Zap className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">AI Powered</span>
              </div>
            </div>
            <button 
              onClick={handleViewAllInvestments}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                      <p className="text-sm text-gray-600">{suggestion.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <Target className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{suggestion.confidence}% Confidence</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expected Return</span>
                    <span className="text-sm font-medium text-green-600">{suggestion.expectedReturn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Minimum Investment</span>
                    <span className="text-sm font-medium text-gray-900">{suggestion.minInvestment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Risk Level</span>
                    <span className={`text-sm font-medium ${suggestion.riskColor}`}>{suggestion.risk}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-600 italic">{suggestion.reason}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleInvestNow(suggestion)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Invest Now
                  </button>
                  <button 
                    onClick={() => handleLearnMore(suggestion)}
                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Tips & Insights */}
        {smartTips.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">AI Insights & Tips</h2>
              </div>
              <div className="space-y-3">
                {smartTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-white p-4 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => handleQuickAction('add')}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
            >
              <Plus className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Investment</span>
            </button>
            <button 
              onClick={() => handleQuickAction('rebalance')}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
            >
              <PieChart className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Rebalance</span>
            </button>
            <button 
              onClick={() => handleQuickAction('export')}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
            >
              <Download className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Export Data</span>
            </button>
            <button 
              onClick={() => handleQuickAction('share')}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
            >
              <Share2 className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-900">Share Portfolio</span>
            </button>
          </div>
        </div>
        {/* View Details Modal */}
        {showDetailsModal && selectedInvestment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Investment Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{selectedInvestment.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{selectedInvestment.name}</h3>
                      <p className="text-gray-600">{selectedInvestment.symbol} • {selectedInvestment.type}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Investment Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shares Owned</span>
                        <span className="font-medium">{selectedInvestment.shares}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Price</span>
                        <span className="font-medium">₹{selectedInvestment.avgPrice?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Price</span>
                        <span className="font-medium">₹{selectedInvestment.currentPrice?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">24h Change</span>
                        <span className={`font-medium ${selectedInvestment.change24h?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedInvestment.change24h}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Volume</span>
                        <span className="font-medium">{selectedInvestment.volume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated</span>
                        <span className="font-medium text-sm">{selectedInvestment.lastUpdated || 'Just now'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Total Return</span>
                          <span className={`font-bold ${selectedInvestment.returnColor}`}>{selectedInvestment.return}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${selectedInvestment.return?.startsWith('+') ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(Math.abs(parseFloat(selectedInvestment.return?.replace('%', '') || 0)), 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">₹{selectedInvestment.amountInvested?.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Invested</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">₹{selectedInvestment.currentValue?.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Current Value</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Risk Assessment</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedInvestment.riskColor}`}>
                        {selectedInvestment.risk}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedInvestment.risk === 'Low' && 'This investment has historically shown stable returns with minimal volatility.'}
                      {selectedInvestment.risk === 'Moderate' && 'This investment carries moderate risk with potential for good returns.'}
                      {selectedInvestment.risk === 'High' && 'This investment is high-risk with potential for significant gains or losses.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Trade Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invest Now Modal */}
        {showInvestModal && selectedSuggestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Choose Trading Platform</h2>
                <button 
                  onClick={() => setShowInvestModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedSuggestion.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedSuggestion.title}</h3>
                    <p className="text-sm text-gray-600">{selectedSuggestion.symbol}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">Select a trading platform to invest in {selectedSuggestion.title}:</p>
              
              <div className="space-y-3">
                {tradingPlatforms.map((platform, index) => (
                  <button
                    key={index}
                    onClick={() => openTradingPlatform(platform)}
                    className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  >
                    <span className="text-2xl">{platform.logo}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{platform.name}</p>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                    <span className="text-blue-600">→</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Disclaimer:</strong> Please do your own research before investing. Past performance doesn't guarantee future results.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Learn More Modal */}
        {showLearnMoreModal && selectedSuggestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Investment Analysis</h2>
                <button 
                  onClick={() => setShowLearnMoreModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <span className="text-3xl">{selectedSuggestion.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedSuggestion.title}</h3>
                    <p className="text-gray-600">{selectedSuggestion.symbol}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{selectedSuggestion.confidence}% AI Confidence</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">Expected Return</h4>
                    <p className="text-2xl font-bold text-green-600">{selectedSuggestion.expectedReturn}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">Min Investment</h4>
                    <p className="text-2xl font-bold text-blue-600">{selectedSuggestion.minInvestment}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <h4 className="font-semibold text-gray-900 mb-2">Risk Level</h4>
                    <p className={`text-2xl font-bold ${selectedSuggestion.riskColor}`}>{selectedSuggestion.risk}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Why We Recommend This</h4>
                  <p className="text-gray-700 mb-3">{selectedSuggestion.reason}</p>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">Key Highlights:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                      {selectedSuggestion.symbol === 'NVDA' && (
                        <>
                          <li>Leading AI chip manufacturer with dominant market position</li>
                          <li>Strong revenue growth driven by AI and data center demand</li>
                          <li>Expanding into autonomous vehicles and edge computing</li>
                          <li>High volatility but significant growth potential</li>
                        </>
                      )}
                      {selectedSuggestion.symbol === 'VOO' && (
                        <>
                          <li>Tracks the S&P 500 index with low expense ratio (0.03%)</li>
                          <li>Diversified exposure to 500 largest US companies</li>
                          <li>Consistent long-term returns with lower volatility</li>
                          <li>Ideal for passive, long-term investment strategy</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Risk Considerations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                    {selectedSuggestion.risk === 'High' && (
                      <>
                        <li>High volatility - prices can fluctuate significantly</li>
                        <li>Market sentiment can heavily impact stock price</li>
                        <li>Regulatory risks in emerging technologies</li>
                        <li>Competition from other tech giants</li>
                      </>
                    )}
                    {selectedSuggestion.risk === 'Low' && (
                      <>
                        <li>Market risk - overall market downturns affect performance</li>
                        <li>Inflation risk - may erode real returns over time</li>
                        <li>Currency risk for international holdings</li>
                        <li>Interest rate sensitivity</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowLearnMoreModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={() => {
                      setShowLearnMoreModal(false);
                      handleInvestNow(selectedSuggestion);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Invest Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View All Investments Modal */}
        {showAllInvestments && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Investment Recommendations (A-Z)</h2>
                <button 
                  onClick={() => setShowAllInvestments(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.sort((a, b) => a.title.localeCompare(b.title)).map((suggestion, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-xl">{suggestion.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{suggestion.title}</h3>
                        <p className="text-xs text-gray-600">{suggestion.symbol}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Return</span>
                        <span className="font-medium text-green-600">{suggestion.expectedReturn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Investment</span>
                        <span className="font-medium">{suggestion.minInvestment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk</span>
                        <span className={`font-medium ${suggestion.riskColor}`}>{suggestion.risk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Confidence</span>
                        <span className="font-medium text-blue-600">{suggestion.confidence}%</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <button 
                        onClick={() => {
                          setShowAllInvestments(false);
                          handleInvestNow(suggestion);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs font-medium transition-colors"
                      >
                        Invest
                      </button>
                      <button 
                        onClick={() => {
                          setShowAllInvestments(false);
                          handleLearnMore(suggestion);
                        }}
                        className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-1 px-2 rounded text-xs font-medium transition-colors"
                      >
                        Learn
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trade Confirmation Toast */}
        {showTradeConfirmation && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-pulse">
            <div className="flex items-center space-x-2">
              <span className="text-lg">✅</span>
              <span className="font-medium">Redirected to trading platform!</span>
            </div>
          </div>
        )}
        </>
        )}
      </div>
      {/* Footer remains unchanged */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">FuturePath AI</span>
              </div>
              <p className="text-sm text-gray-600">Making smart investing accessible to everyone.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Features</a></li>
                <li><a href="#" className="hover:text-gray-900">Security</a></li>
                <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">Support</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">© 2024 FuturePath AI. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Twitter className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Facebook className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Investment;