import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const StockChart = ({ symbol = 'AAPL', timeRange = '1D' }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangePercent, setPriceChangePercent] = useState(0);

  // Generate mock real-time stock data
  const generateStockData = (symbol, timeRange) => {
    const data = [];
    const now = new Date();
    let basePrice = 150 + Math.random() * 100; // Random base price between 150-250
    
    // Generate data points based on time range
    let points = 24; // Default for 1 day
    let interval = 60; // minutes
    
    switch (timeRange) {
      case '1D':
        points = 24;
        interval = 60;
        break;
      case '1W':
        points = 7;
        interval = 24 * 60;
        break;
      case '1M':
        points = 30;
        interval = 24 * 60;
        break;
      case '3M':
        points = 90;
        interval = 24 * 60;
        break;
      default:
        points = 24;
        interval = 60;
    }

    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval * 60 * 1000);
      
      // Add some volatility to the price
      const volatility = 0.02; // 2% volatility
      const change = (Math.random() - 0.5) * volatility * basePrice;
      basePrice += change;
      
      data.push({
        time: time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        price: basePrice,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        timestamp: time.getTime()
      });
    }

    // Set current price and calculate change
    const latestPrice = data[data.length - 1].price;
    const previousPrice = data[0].price;
    const change = latestPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;

    setCurrentPrice(latestPrice);
    setPriceChange(change);
    setPriceChangePercent(changePercent);

    return data;
  };

  // Fetch stock data
  const fetchStockData = async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = generateStockData(symbol, timeRange);
      setStockData(data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStockData();
  }, [symbol, timeRange]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStockData();
    }, 30000);

    return () => clearInterval(interval);
  }, [symbol, timeRange]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-lg font-bold text-gray-900">
            ₹{payload[0].value.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            Volume: {payload[0].payload.volume.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-gray-600">Loading stock data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{symbol} Stock</h3>
          <div className="flex items-center space-x-4 mt-2">
            <div className="text-2xl font-bold text-gray-900">
              ₹{currentPrice.toFixed(2)}
            </div>
            <div className={`flex items-center space-x-1 ${
              priceChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {priceChange >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}
              </span>
              <span className="text-sm">
                ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex space-x-2">
          {['1D', '1W', '1M', '3M'].map((range) => (
            <button
              key={range}
              onClick={() => fetchStockData()}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stockData}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={priceChange >= 0 ? "#10b981" : "#ef4444"} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={priceChange >= 0 ? "#10b981" : "#ef4444"} 
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `₹${value.toFixed(0)}`}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={priceChange >= 0 ? "#10b981" : "#ef4444"}
              fill="url(#stockGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Info */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Open</p>
          <p className="font-semibold text-gray-900">
            ₹{(currentPrice - priceChange * 0.1).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">High</p>
          <p className="font-semibold text-gray-900">
            ₹{(currentPrice + Math.abs(priceChange) * 0.5).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Low</p>
          <p className="font-semibold text-gray-900">
            ₹{(currentPrice - Math.abs(priceChange) * 0.5).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockChart; 