import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Search, Filter, Calendar, Download, 
  Bell, Settings, Sun, Moon, RefreshCw, Activity, BarChart3,
  Zap, Target, AlertCircle, Eye, EyeOff, Share2, ArrowLeft,
  Sparkles, Star, Crown, Award, ShoppingCart, ExternalLink,
  CreditCard, Wallet, IndianRupee, Globe, Clock, ArrowUp, ArrowDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const IndianGoldDashboard = () => {
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
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:5000/api';
  const socketRef = useRef(null);

  useEffect(() => {
    initializeDashboard();
    setupWebSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const initializeDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch initial data
      await Promise.all([
        fetchGoldPrices(),
        fetchHistoricalData(),
        fetchMarketAnalysis()
      ]);
      
    } catch (error) {
      console.error('Dashboard initialization error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const setupWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:5000');
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'priceUpdate') {
            setGoldPrices(data.prices);
            setLastUpdate(new Date());
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setConnectionStatus('disconnected');
        // Only attempt to reconnect if it wasn't a manual close
        if (event.code !== 1000) {
          setTimeout(() => {
            setupWebSocket();
          }, 5000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
        setError('Gold server not running. WebSocket connection failed.');
      };

    } catch (error) {
      console.error('WebSocket setup error:', error);
      setConnectionStatus('error');
      setError('Failed to connect to gold server. Please start the gold server.');
    }
  };

  const fetchGoldPrices = async () => {
    try {
      const response = await fetch(`${API_BASE}/gold/prices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setGoldPrices(data.data);
        setLastUpdate(new Date());
        setError(null); // Clear any previous errors
      } else {
        throw new Error(data.message || 'Failed to fetch prices');
      }
    } catch (error) {
      console.error('Error fetching gold prices:', error);
      // Use fallback data
      setGoldPrices(generateFallbackData());
      setError('Gold server not running. Using fallback data. Please run: cd backend && node simple-gold-server.js');
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`${API_BASE}/gold/historical/${selectedCommodity}?period=${selectedTimeRange}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setHistoricalData(data.data);
        processChartData(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch historical data');
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      // Generate mock historical data
      const mockData = generateMockHistoricalData();
      setHistoricalData(mockData);
      processChartData(mockData);
    }
  };

  const fetchMarketAnalysis = async () => {
    try {
      const response = await fetch(`${API_BASE}/gold/analysis/${selectedCommodity}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setMarketAnalysis(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch market analysis');
      }
    } catch (error) {
      console.error('Error fetching market analysis:', error);
      // Generate mock analysis
      setMarketAnalysis(generateMockAnalysis());
    }
  };

  const processChartData = (data) => {
    const chartData = data.map(item => ({
      date: new Date(item.date).toLocaleDateString(),
      price: item.close,
      high: item.high,
      low: item.low,
      volume: item.volume
    }));
    setChartData(chartData);
  };

  const generateFallbackData = () => {
    return [
      {
        symbol: 'XAU',
        name: 'Gold',
        price: 6850,
        currency: 'INR',
        unit: '10g',
        indianUnit: 'per 10 grams',
        change24h: 45,
        changePercent24h: 0.66,
        high24h: 6890,
        low24h: 6820,
        volume: 1250000,
        marketCap: 1500000000,
        timestamp: new Date(),
        source: 'fallback',
        isIndianMarket: true
      },
      {
        symbol: 'XAG',
        name: 'Silver',
        price: 82500,
        currency: 'INR',
        unit: 'kg',
        indianUnit: 'per kg',
        change24h: -1200,
        changePercent24h: -1.43,
        high24h: 84000,
        low24h: 81800,
        volume: 850000,
        marketCap: 1200000000,
        timestamp: new Date(),
        source: 'fallback',
        isIndianMarket: true
      },
      {
        symbol: 'XPT',
        name: 'Platinum',
        price: 7034625,
        currency: 'INR',
        unit: 'oz',
        indianUnit: 'per oz',
        change24h: 57193,
        changePercent24h: 0.82,
        high24h: 7101225,
        low24h: 6976350,
        volume: 450000,
        marketCap: 800000000,
        timestamp: new Date(),
        source: 'fallback',
        isIndianMarket: true
      },
      {
        symbol: 'XPD',
        name: 'Palladium',
        price: 123643,
        currency: 'INR',
        unit: 'oz',
        indianUnit: 'per oz',
        change24h: -1315,
        changePercent24h: -1.05,
        high24h: 125291,
        low24h: 122794,
        volume: 320000,
        marketCap: 600000000,
        timestamp: new Date(),
        source: 'fallback',
        isIndianMarket: true
      }
    ];
  };

  const generateMockHistoricalData = () => {
    const data = [];
    const basePrice = selectedCommodity === 'XAU' ? 6850 : 
                     selectedCommodity === 'XAG' ? 82500 :
                     selectedCommodity === 'XPT' ? 7034625 : 123643;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * volatility * basePrice;
      
      const open = basePrice + change;
      const close = open + (Math.random() - 0.5) * basePrice * 0.01;
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);
      
      data.push({
        date,
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close),
        volume: Math.floor(Math.random() * 100000) + 10000
      });
    }
    
    return data;
  };

  const generateMockAnalysis = () => {
    const trends = ['bullish', 'bearish', 'neutral'];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    
    return {
      symbol: selectedCommodity,
      trend,
      volatility: Math.random() * 5 + 1,
      support: Math.floor(Math.random() * 1000) + 5000,
      resistance: Math.floor(Math.random() * 1000) + 7000,
      prediction: `Market shows ${trend} sentiment with moderate volatility`,
      confidence: Math.floor(Math.random() * 30) + 70,
      lastUpdated: new Date()
    };
  };

  const formatPrice = (price, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatChange = (change, percent) => {
    const isPositive = change >= 0;
    return {
      value: `${isPositive ? '+' : ''}${formatPrice(Math.abs(change))}`,
      percent: `${isPositive ? '+' : ''}${percent.toFixed(2)}%`,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-50' : 'bg-red-50',
      icon: isPositive ? ArrowUp : ArrowDown
    };
  };

  const getCommodityIcon = (symbol) => {
    const icons = {
      'XAU': '🥇',
      'XAG': '🥈', 
      'XPT': '💎',
      'XPD': '⭐'
    };
    return icons[symbol] || '💎';
  };

  const getCommodityColor = (symbol) => {
    const colors = {
      'XAU': 'from-yellow-400 to-yellow-600',
      'XAG': 'from-gray-300 to-gray-500',
      'XPT': 'from-blue-400 to-blue-600',
      'XPD': 'from-purple-400 to-purple-600'
    };
    return colors[symbol] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 border-b ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/main-dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                <div>
                  <h1 className="text-xl font-bold">Indian Gold Market Dashboard</h1>
                  <p className="text-sm text-gray-500">Live precious metals tracking in INR</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'disconnected' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-500">
                  {connectionStatus === 'connected' ? 'Live' : 
                   connectionStatus === 'disconnected' ? 'Reconnecting...' : 'Offline'}
                </span>
              </div>
              
              {/* Last Update */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {/* Refresh Button */}
              <button
                onClick={fetchGoldPrices}
                disabled={isLoading}
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
              <p className="text-xs text-red-600 mt-1">
                To start the gold server, open a new terminal and run: 
                <code className="bg-red-100 px-1 rounded">cd backend && node simple-gold-server.js</code>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Market Feed */}
        <div className={`rounded-xl p-6 mb-8 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-600">LIVE</span>
              </div>
              <h2 className="text-xl font-bold">Live Market Feed</h2>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Activity className="w-4 h-4" />
              <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {goldPrices.map((metal, index) => {
              const change = formatChange(metal.change24h, metal.changePercent24h);
              const Icon = change.icon;
              
              return (
                <motion.div
                  key={metal.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  } hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getCommodityIcon(metal.symbol)}</span>
                      <div>
                        <h3 className="font-semibold">{metal.name}</h3>
                        <p className="text-sm text-gray-500">{metal.symbol} - {metal.indianUnit}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${change.bgColor} ${change.color}`}>
                      {change.percent}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{formatPrice(metal.price, metal.currency)}</span>
                      <div className={`flex items-center space-x-1 ${change.color}`}>
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{change.value}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>24h High: {formatPrice(metal.high24h, metal.currency)}</span>
                      <span>24h Low: {formatPrice(metal.low24h, metal.currency)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Detailed Price Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {goldPrices.map((metal, index) => {
            const change = formatChange(metal.change24h, metal.changePercent24h);
            const Icon = change.icon;
            
            return (
              <motion.div
                key={metal.symbol}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl p-6 shadow-lg border-2 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
                style={{
                  borderColor: metal.symbol === 'XAU' ? '#fbbf24' :
                              metal.symbol === 'XAG' ? '#9ca3af' :
                              metal.symbol === 'XPT' ? '#3b82f6' : '#8b5cf6'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getCommodityColor(metal.symbol)} flex items-center justify-center text-white font-bold text-lg`}>
                      {metal.symbol === 'XAU' ? '1' : metal.symbol === 'XAG' ? '2' : metal.symbol === 'XPT' ? '💎' : '⭐'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{metal.name}</h3>
                      <p className="text-gray-500">{metal.symbol} - {metal.indianUnit}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${change.bgColor} ${change.color}`}>
                    {change.percent}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{formatPrice(metal.price, metal.currency)}</span>
                    <div className={`flex items-center space-x-2 ${change.color}`}>
                      <Icon className="w-5 h-5" />
                      <span className="text-lg font-medium">{change.value}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-500">24h High</p>
                      <p className="font-semibold">{formatPrice(metal.high24h, metal.currency)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-500">24h Low</p>
                      <p className="font-semibold">{formatPrice(metal.low24h, metal.currency)}</p>
                    </div>
                  </div>
                  
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Buy {metal.name}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Chart Section */}
        <div className={`rounded-xl p-6 mb-8 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Gold Chart</h2>
            <div className="flex space-x-2">
              {['1D', '1W', '1M', '3M', '6M', '1Y'].map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedTimeRange(period);
                    fetchHistoricalData();
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTimeRange === period
                      ? 'bg-blue-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatPrice(value), 'Price']}
                  labelStyle={{ color: darkMode ? '#fff' : '#000' }}
                  contentStyle={{
                    backgroundColor: darkMode ? '#374151' : '#fff',
                    border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#fbbf24" 
                  strokeWidth={2}
                  dot={{ fill: '#fbbf24', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Analysis */}
        {marketAnalysis && (
          <div className={`rounded-xl p-6 mb-8 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h2 className="text-xl font-bold mb-6">Market Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Trend</h3>
                <p className="text-2xl font-bold text-blue-600 capitalize">{marketAnalysis.trend}</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900 dark:text-green-100">Volatility</h3>
                <p className="text-2xl font-bold text-green-600">{marketAnalysis.volatility.toFixed(2)}%</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Confidence</h3>
                <p className="text-2xl font-bold text-purple-600">{marketAnalysis.confidence}%</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-semibold mb-2">AI Prediction</h4>
              <p className="text-gray-600 dark:text-gray-300">{marketAnalysis.prediction}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className={`rounded-xl p-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <Bell className="w-6 h-6 text-blue-600" />
              <span className="font-medium">Set Price Alert</span>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <Download className="w-6 h-6 text-green-600" />
              <span className="font-medium">Export Data</span>
            </button>
            <button className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
              <Share2 className="w-6 h-6 text-purple-600" />
              <span className="font-medium">Share Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndianGoldDashboard;
