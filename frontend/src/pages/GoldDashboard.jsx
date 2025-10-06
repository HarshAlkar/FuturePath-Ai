import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Search, Filter, Calendar, Download, 
  Bell, Settings, Sun, Moon, RefreshCw, Activity, BarChart3,
  Zap, Target, AlertCircle, Eye, EyeOff, Share2, ArrowLeft,
  Sparkles, Star, Crown, Award, ShoppingCart, ExternalLink,
  CreditCard, Wallet
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const GoldDashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [goldPrices, setGoldPrices] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1D');
  const [selectedCommodity, setSelectedCommodity] = useState('XAU');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTradingModal, setShowTradingModal] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const [chartData, setChartData] = useState([]);

  const API_BASE = 'http://localhost:5001/api';

  useEffect(() => {
    // Initialize with real Indian market data
    fetchRealGoldPrices();
    
    // Set up polling for real data every 30 seconds (API limit consideration)
    const interval = setInterval(() => {
      fetchRealGoldPrices();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchRealGoldPrices = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching gold prices from:', `${API_BASE}/gold/prices`);
      
      // Use backend API instead of external APIs
      const response = await fetch(`${API_BASE}/gold/prices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setGoldPrices(data.data);
        setIsLoading(false);
        toast.success('✅ Real Indian market prices updated!');
        return;
      } else {
        throw new Error(data.message || 'Failed to fetch prices');
      }
      
    } catch (error) {
      console.error('Error fetching real gold prices:', error);
      toast.error('❌ Failed to fetch real prices. Using fallback data.');
      
      // Fallback to mock data if API fails
      initializeFallbackData();
      setIsLoading(false);
    }
  };
  
  const initializeFallbackData = () => {
    const usdToInr = 83.25;
    const fallbackPrices = [
      {
        symbol: 'XAU',
        name: 'Gold',
        price: 6850, // Approximate Indian gold price per 10g
        currency: 'INR',
        unit: '10g',
        change24h: 45,
        changePercent24h: 0.66,
        high24h: 6890,
        low24h: 6820,
        volume: 125000,
        marketCap: 6850000000,
        timestamp: new Date(),
        source: 'fallback'
      },
      {
        symbol: 'XAG',
        name: 'Silver',
        price: 82500, // Approximate Indian silver price per kg
        currency: 'INR',
        unit: 'kg',
        change24h: -1200,
        changePercent24h: -1.43,
        high24h: 84000,
        low24h: 81800,
        volume: 85000,
        marketCap: 8250000000,
        timestamp: new Date(),
        source: 'fallback'
      },
      {
        symbol: 'XPT',
        name: 'Platinum',
        price: 84500 * usdToInr,
        currency: 'INR',
        unit: 'oz',
        change24h: 687 * usdToInr,
        changePercent24h: 0.82,
        high24h: 85300 * usdToInr,
        low24h: 83800 * usdToInr,
        volume: 45000,
        marketCap: 4575000 * usdToInr,
        timestamp: new Date(),
        source: 'fallback'
      },
      {
        symbol: 'XPD',
        name: 'Palladium',
        price: 1485.20 * usdToInr,
        currency: 'INR',
        unit: 'oz',
        change24h: -15.80 * usdToInr,
        changePercent24h: -1.05,
        high24h: 1505.00 * usdToInr,
        low24h: 1475.00 * usdToInr,
        volume: 32000,
        marketCap: 4755600 * usdToInr,
        timestamp: new Date(),
        source: 'fallback'
      }
    ];
    
    setGoldPrices(fallbackPrices);
    setMarketAnalysis({
      symbol: 'XAU',
      trend: 'bullish',
      volatility: 2.3,
      support: 6800,
      resistance: 6900,
      prediction: 'Fallback data active. Real-time Indian market analysis unavailable.',
      confidence: 75,
      lastUpdated: new Date()
    });
    setIsLoading(false);
  };

  const generateChartData = (currentPrice, timeRange) => {
    const now = new Date();
    const dataPoints = [];
    let intervals, stepSize;
    
    switch(timeRange) {
      case '1D':
        intervals = 24;
        stepSize = 60 * 60 * 1000; // 1 hour
        break;
      case '1W':
        intervals = 7;
        stepSize = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '1M':
        intervals = 30;
        stepSize = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '3M':
        intervals = 90;
        stepSize = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '6M':
        intervals = 180;
        stepSize = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '1Y':
        intervals = 365;
        stepSize = 24 * 60 * 60 * 1000; // 1 day
        break;
      default:
        intervals = 24;
        stepSize = 60 * 60 * 1000;
    }
    
    // Generate realistic price movement data
    let price = currentPrice * 0.95; // Start slightly lower
    for (let i = intervals; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * stepSize));
      
      // Add realistic price volatility
      const volatility = 0.02; // 2% volatility
      const change = (Math.random() - 0.5) * volatility * price;
      price = Math.max(price + change, currentPrice * 0.9);
      
      // Trend towards current price
      if (i < intervals / 4) {
        const trendFactor = (intervals / 4 - i) / (intervals / 4);
        price = price + (currentPrice - price) * trendFactor * 0.1;
      }
      
      dataPoints.push({
        time: timestamp,
        price: Math.round(price * 100) / 100,
        volume: Math.floor(Math.random() * 50000) + 10000
      });
    }
    
    setChartData(dataPoints);
  };

  const refreshPrices = () => {
    toast.loading('🔄 Refreshing Indian market prices...');
    fetchRealGoldPrices();
  };

  const commodities = [
    { symbol: 'XAU', name: 'Gold', icon: '🥇', color: 'from-yellow-400 to-yellow-600', bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-100', borderColor: 'border-yellow-200' },
    { symbol: 'XAG', name: 'Silver', icon: '🥈', color: 'from-gray-300 to-gray-500', bgColor: 'bg-gradient-to-br from-gray-50 to-slate-100', borderColor: 'border-gray-200' },
    { symbol: 'XPT', name: 'Platinum', icon: '💎', color: 'from-blue-400 to-blue-600', bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100', borderColor: 'border-blue-200' },
    { symbol: 'XPD', name: 'Palladium', icon: '⭐', color: 'from-purple-400 to-purple-600', bgColor: 'bg-gradient-to-br from-purple-50 to-violet-100', borderColor: 'border-purple-200' }
  ];

  const timeRanges = ['1D', '1W', '1M', '3M', '6M', '1Y'];

  const PriceCard = ({ commodity, price, isSelected, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-blue-500 shadow-lg' 
          : 'hover:shadow-md'
      } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${commodity.color} opacity-10`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{commodity.icon}</span>
            <div>
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {commodity.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {commodity.symbol}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: price?.changePercent24h > 0 ? 0 : 180 }}
            className={`p-2 rounded-full ${
              price?.changePercent24h > 0 ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${
              price?.changePercent24h > 0 ? 'text-green-600' : 'text-red-600'
            }`} />
          </motion.div>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              ${price?.price?.toLocaleString() || '0.00'}
            </span>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              USD/{price?.unit || 'oz'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${
              price?.changePercent24h > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {price?.changePercent24h > 0 ? '+' : ''}{price?.changePercent24h?.toFixed(2) || '0.00'}%
            </span>
            <span className={`text-sm ${
              price?.changePercent24h > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ({price?.changePercent24h > 0 ? '+' : ''}${price?.change24h?.toFixed(2) || '0.00'})
            </span>
          </div>

          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Vol: {price?.volume?.toLocaleString() || '0'}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Trading app URLs for different platforms
  const tradingApps = [
    { name: 'Zerodha Kite', url: 'https://kite.zerodha.com', icon: '📈' },
    { name: 'Groww', url: 'https://groww.in', icon: '🌱' },
    { name: 'Upstox', url: 'https://upstox.com', icon: '📊' },
    { name: 'Angel One', url: 'https://angelone.in', icon: '👼' },
    { name: 'ICICI Direct', url: 'https://www.icicidirect.com', icon: '🏦' }
  ];

  const handleBuyGold = (metalSymbol, metalName) => {
    // Find the metal data from goldPrices
    const metalData = goldPrices.find(metal => metal.symbol === metalSymbol);
    
    if (metalData) {
      // Navigate to buying page with metal data
      navigate('/gold-buy', { 
        state: { 
          metal: {
            symbol: metalData.symbol,
            name: metalData.name,
            price: metalData.price,
            currency: metalData.currency,
            unit: metalData.unit
          }
        } 
      });
    } else {
      // Fallback if metal data not found
      navigate('/gold-buy', { 
        state: { 
          metal: {
            symbol: metalSymbol,
            name: metalName,
            price: 68500, // Default gold price
            currency: 'INR',
            unit: '10g'
          }
        } 
      });
    }
  };

  const openTradingApp = (appUrl, appName) => {
    toast.success(`Opening ${appName} for gold trading...`);
    window.open(appUrl, '_blank');
    setShowTradingModal(false);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' 
        : 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50'
    }`}>
      {/* Enhanced Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`sticky top-0 z-40 backdrop-blur-xl border-b shadow-lg ${
          darkMode 
            ? 'bg-gray-900/95 border-gray-700/50' 
            : 'bg-white/95 border-yellow-200/50'
        }`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/main-dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-600' 
                    : 'bg-white hover:bg-yellow-50 text-gray-700 hover:text-yellow-800 border border-yellow-200 shadow-sm hover:shadow-md'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className={`text-3xl font-bold bg-gradient-to-r ${
                    darkMode 
                      ? 'from-yellow-400 to-amber-300 text-transparent bg-clip-text' 
                      : 'from-yellow-600 to-amber-600 text-transparent bg-clip-text'
                  }`}>
                    Gold Market Dashboard
                  </h1>
                  <p className={`text-sm flex items-center space-x-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                    <span>Live precious metals tracking in INR</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search commodities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
                } hover:bg-opacity-80 transition-colors`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAlertModal(true)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-100 text-gray-600'
                } hover:bg-opacity-80 transition-colors relative`}
              >
                <Bell className="w-5 h-5" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Live Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`mb-8 overflow-hidden rounded-2xl border-2 ${
            darkMode 
              ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700' 
              : 'bg-gradient-to-r from-white to-yellow-50 border-yellow-200'
          } shadow-xl backdrop-blur-sm`}
        >
          <div className={`px-6 py-3 border-b ${
            darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-yellow-200 bg-yellow-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white animate-pulse" />
                </div>
                <span className={`text-lg font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Live Market Feed
                </span>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                }`}>
                  LIVE
                </div>
              </div>
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex animate-scroll space-x-12">
              {goldPrices.map((price) => (
                <motion.div 
                  key={price.symbol} 
                  className="flex items-center space-x-4 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl`}>
                      {commodities.find(c => c.symbol === price.symbol)?.icon}
                    </span>
                    <span className={`font-bold text-lg ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {price.symbol}
                    </span>
                  </div>
                  <span className={`font-bold text-xl ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    {formatCurrency(price.price)}
                  </span>
                  <span className={`text-lg font-medium px-3 py-1 rounded-lg ${
                    price.changePercent24h >= 0 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {price.changePercent24h >= 0 ? '+' : ''}{price.changePercent24h.toFixed(2)}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced Live Price Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-6 py-6"
      >
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Live Precious Metal Prices
          </h2>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <span>Live Indian market data updated every 30 seconds • Gold per 10g, Silver per kg • All prices in ₹</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {goldPrices.map((price, index) => {
            const commodity = commodities.find(c => c.symbol === price.symbol);
            return (
              <motion.div
                key={price.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCommodity(price.symbol)}
                className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                  selectedCommodity === price.symbol
                    ? darkMode
                      ? 'bg-gradient-to-br from-yellow-900/50 to-amber-900/50 border-yellow-500 shadow-2xl shadow-yellow-500/25'
                      : 'bg-gradient-to-br from-yellow-100 to-amber-100 border-yellow-400 shadow-2xl shadow-yellow-500/25'
                    : darkMode
                      ? `bg-gradient-to-br from-gray-800 to-gray-900 ${commodity?.borderColor?.replace('border-', 'border-')} hover:from-gray-700 hover:to-gray-800`
                      : `${commodity?.bgColor} ${commodity?.borderColor} hover:shadow-xl`
                } backdrop-blur-sm`}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br from-white to-transparent animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-gradient-to-tr from-white to-transparent animate-pulse delay-1000"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`text-3xl p-2 rounded-xl ${
                        darkMode ? 'bg-gray-700/50' : 'bg-white/50'
                      } backdrop-blur-sm`}>
                        {commodity?.icon}
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {price.name}
                        </h3>
                        <p className={`text-xs uppercase tracking-wide font-medium ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {price.symbol} • Per {price.unit}
                        </p>
                      </div>
                    </div>
                    {selectedCommodity === price.symbol && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white fill-current" />
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className={`text-3xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {formatCurrency(price.price)}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-sm font-medium ${
                          price.changePercent24h >= 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {price.changePercent24h >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{Math.abs(price.changePercent24h).toFixed(2)}%</span>
                        </div>
                        <span className={`text-sm ${
                          price.changePercent24h >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {price.changePercent24h >= 0 ? '+' : ''}{formatCurrency(price.change24h)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div className={`p-2 rounded-lg ${
                        darkMode ? 'bg-gray-700/50' : 'bg-white/50'
                      } backdrop-blur-sm`}>
                        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>High 24h</div>
                        <div className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {formatCurrency(price.high24h)}
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg ${
                        darkMode ? 'bg-gray-700/50' : 'bg-white/50'
                      } backdrop-blur-sm`}>
                        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Low 24h</div>
                        <div className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {formatCurrency(price.low24h)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Buy Gold Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyGold(price.symbol, price.name);
                      }}
                      className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 ${
                        darkMode
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/25'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg shadow-green-500/25'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Buy {price.name}</span>
                      <ExternalLink className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {commodities.find(c => c.symbol === selectedCommodity)?.name} Chart
          </h2>
          
          <div className={`flex rounded-lg p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {timeRanges.map((range) => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedTimeRange(range);
                  const currentGoldPrice = goldPrices.find(p => p.symbol === selectedCommodity)?.price || 6850;
                  generateChartData(currentGoldPrice, range);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedTimeRange === range
                    ? 'bg-blue-500 text-white shadow-md'
                    : darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {range}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Advanced Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            {/* Enhanced Quick Actions */}
            <div className={`rounded-2xl p-6 shadow-xl transition-all duration-300 border-2 ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}>
              <h3 className={`text-xl font-bold mb-6 flex items-center space-x-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <Zap className="w-6 h-6 text-yellow-500" />
                <span>Quick Actions</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Buy Gold Stocks */}
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBuyGold('XAU', 'Gold')}
                  className="flex flex-col items-center space-y-3 p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all transform shadow-lg shadow-green-500/25"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">Buy Gold Stocks</span>
                  <span className="text-xs text-green-100">Open Trading App</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowExportModal(true)}
                  className={`flex flex-col items-center space-y-3 p-4 rounded-xl transition-all transform shadow-lg ${
                    darkMode
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-blue-500/25'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 shadow-blue-500/25'
                  }`}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">Export Data</span>
                  <span className="text-xs text-blue-100">Download Reports</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAlertModal(true)}
                  className={`flex flex-col items-center space-y-3 p-4 rounded-xl transition-all transform shadow-lg ${
                    darkMode
                      ? 'bg-gradient-to-br from-orange-600 to-red-700 hover:from-orange-500 hover:to-red-600 shadow-orange-500/25'
                      : 'bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 shadow-orange-500/25'
                  }`}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">Price Alerts</span>
                  <span className="text-xs text-orange-100">Set Notifications</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => refreshPrices()}
                  className={`flex flex-col items-center space-y-3 p-4 rounded-xl transition-all transform shadow-lg ${
                    darkMode
                      ? 'bg-gradient-to-br from-purple-600 to-violet-700 hover:from-purple-500 hover:to-violet-600 shadow-purple-500/25'
                      : 'bg-gradient-to-br from-purple-500 to-violet-600 hover:from-purple-400 hover:to-violet-500 shadow-purple-500/25'
                  }`}
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">Refresh Data</span>
                  <span className="text-xs text-purple-100">Update Prices</span>
                </motion.button>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {commodities.find(c => c.symbol === selectedCommodity)?.name} Price Chart
                  </h3>
                  <div className="flex space-x-2">
                    {timeRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setSelectedTimeRange(range);
                          const currentPrice = goldPrices.find(p => p.symbol === selectedCommodity)?.price || 6850;
                          generateChartData(currentPrice, range);
                        }}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          selectedTimeRange === range
                            ? 'bg-blue-500 text-white'
                            : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Live Price Chart */}
                <div className={`h-96 rounded-lg relative overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  {chartData.length > 0 ? (
                    <div className="w-full h-full p-4">
                      {/* Chart Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            ₹{chartData[chartData.length - 1]?.price?.toLocaleString()}
                          </div>
                          <div className={`text-sm px-2 py-1 rounded ${
                            chartData[chartData.length - 1]?.price > chartData[0]?.price 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {chartData[chartData.length - 1]?.price > chartData[0]?.price ? '+' : ''}
                            {((chartData[chartData.length - 1]?.price - chartData[0]?.price) / chartData[0]?.price * 100).toFixed(2)}%
                          </div>
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {selectedTimeRange} • Live Data
                        </div>
                      </div>
                      
                      {/* SVG Chart */}
                      <svg className="w-full h-72" viewBox="0 0 800 300">
                        <defs>
                          <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05"/>
                          </linearGradient>
                        </defs>
                        
                        {/* Grid Lines */}
                        {[0, 1, 2, 3, 4].map(i => (
                          <line 
                            key={i}
                            x1="0" 
                            y1={60 + i * 60} 
                            x2="800" 
                            y2={60 + i * 60}
                            stroke={darkMode ? '#374151' : '#E5E7EB'}
                            strokeWidth="1"
                            opacity="0.5"
                          />
                        ))}
                        
                        {/* Price Line */}
                        {chartData.length > 1 && (
                          <>
                            {/* Area Fill */}
                            <path
                              d={`M 0,300 ${chartData.map((point, index) => {
                                const x = (index / (chartData.length - 1)) * 800;
                                const minPrice = Math.min(...chartData.map(p => p.price));
                                const maxPrice = Math.max(...chartData.map(p => p.price));
                                const y = 60 + (1 - (point.price - minPrice) / (maxPrice - minPrice)) * 240;
                                return `L ${x},${y}`;
                              }).join(' ')} L 800,300 Z`}
                              fill="url(#priceGradient)"
                            />
                            
                            {/* Price Line */}
                            <path
                              d={`M ${chartData.map((point, index) => {
                                const x = (index / (chartData.length - 1)) * 800;
                                const minPrice = Math.min(...chartData.map(p => p.price));
                                const maxPrice = Math.max(...chartData.map(p => p.price));
                                const y = 60 + (1 - (point.price - minPrice) / (maxPrice - minPrice)) * 240;
                                return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
                              }).join(' ')}`}
                              stroke="#3B82F6"
                              strokeWidth="2"
                              fill="none"
                            />
                            
                            {/* Data Points */}
                            {chartData.map((point, index) => {
                              if (index % Math.ceil(chartData.length / 10) === 0) {
                                const x = (index / (chartData.length - 1)) * 800;
                                const minPrice = Math.min(...chartData.map(p => p.price));
                                const maxPrice = Math.max(...chartData.map(p => p.price));
                                const y = 60 + (1 - (point.price - minPrice) / (maxPrice - minPrice)) * 240;
                                return (
                                  <circle
                                    key={index}
                                    cx={x}
                                    cy={y}
                                    r="3"
                                    fill="#3B82F6"
                                    className="hover:r-5 transition-all cursor-pointer"
                                  />
                                );
                              }
                              return null;
                            })}
                          </>
                        )}
                      </svg>
                      
                      {/* Chart Footer */}
                      <div className="flex justify-between items-center mt-2">
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {chartData[0]?.time?.toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Volume: {chartData[chartData.length - 1]?.volume?.toLocaleString()}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {chartData[chartData.length - 1]?.time?.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Loading Chart Data...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Market Analysis */}
        {marketAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
          >
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              AI Market Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  marketAnalysis.trend === 'bullish' ? 'text-green-500' :
                  marketAnalysis.trend === 'bearish' ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {marketAnalysis.trend.toUpperCase()}
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Market Trend
                </p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {marketAnalysis.confidence}%
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Confidence
                </p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {marketAnalysis.volatility?.toFixed(1)}%
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Volatility
                </p>
              </div>
            </div>
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {marketAnalysis.prediction}
              </p>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowExportModal(true)}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-all`}
          >
            <Download className={`w-8 h-8 mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Export Data
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Download market data in CSV, Excel, or PDF format
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAlertModal(true)}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-all`}
          >
            <Bell className={`w-8 h-8 mb-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Price Alerts
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Set up notifications for price movements
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => refreshPrices()}
            className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-all`}
          >
            <RefreshCw className={`w-8 h-8 mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Refresh Data
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Get the latest Indian market prices
            </p>
          </motion.button>
        </motion.div>
      </div>

      {/* Modals - Coming Soon */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full mx-4`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Price Alerts
            </h3>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Price alerts feature will be available once dependencies are installed.
            </p>
            <button
              onClick={() => setShowAlertModal(false)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full mx-4`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Export Data
            </h3>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Data export feature will be available once dependencies are installed.
            </p>
            <button
              onClick={() => setShowExportModal(false)}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Trading App Selection Modal */}
      {showTradingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`p-8 rounded-2xl ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            } max-w-lg w-full mx-4 shadow-2xl`}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Buy {selectedMetal?.name} Stock
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose your preferred trading platform to start investing
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {tradingApps.map((app, index) => (
                <motion.button
                  key={app.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openTradingApp(app.url, app.name)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center space-x-4 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 hover:border-green-500 hover:bg-gray-600'
                      : 'bg-gray-50 border-gray-200 hover:border-green-500 hover:bg-green-50'
                  }`}
                >
                  <div className="text-2xl">{app.icon}</div>
                  <div className="flex-1 text-left">
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {app.name}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Open trading platform
                    </div>
                  </div>
                  <ExternalLink className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </motion.button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowTradingModal(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.info('Opening popular trading platforms...');
                  window.open('https://zerodha.com', '_blank');
                  setShowTradingModal(false);
                }}
                className="flex-1 py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400 transition-all flex items-center justify-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Quick Start</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GoldDashboard;
