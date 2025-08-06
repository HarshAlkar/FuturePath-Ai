import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, Plus, X } from 'lucide-react';

const MultiStockChart = () => {
  const [stocks, setStocks] = useState([
    { symbol: 'AAPL', color: '#3b82f6', data: [], price: 0, change: 0, changePercent: 0 },
    { symbol: 'GOOGL', color: '#10b981', data: [], price: 0, change: 0, changePercent: 0 },
    { symbol: 'MSFT', color: '#f59e0b', data: [], price: 0, change: 0, changePercent: 0 }
  ]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1D');
  const [showAddStock, setShowAddStock] = useState(false);
  const [newStockSymbol, setNewStockSymbol] = useState('');

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];

  // Generate mock stock data
  const generateStockData = (symbol, timeRange) => {
    const data = [];
    const now = new Date();
    let basePrice = 100 + Math.random() * 200; // Random base price
    
    let points = 24;
    let interval = 60;
    
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
    }

    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * interval * 60 * 1000);
      
      const volatility = 0.015;
      const change = (Math.random() - 0.5) * volatility * basePrice;
      basePrice += change;
      
      data.push({
        time: time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        price: basePrice,
        timestamp: time.getTime()
      });
    }

    const latestPrice = data[data.length - 1].price;
    const previousPrice = data[0].price;
    const change = latestPrice - previousPrice;
    const changePercent = (change / previousPrice) * 100;

    return {
      data,
      price: latestPrice,
      change,
      changePercent
    };
  };

  // Fetch all stock data
  const fetchStockData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedStocks = stocks.map((stock, index) => {
        const stockData = generateStockData(stock.symbol, timeRange);
        return {
          ...stock,
          data: stockData.data,
          price: stockData.price,
          change: stockData.change,
          changePercent: stockData.changePercent,
          color: colors[index % colors.length]
        };
      });
      
      setStocks(updatedStocks);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new stock
  const addStock = () => {
    if (newStockSymbol.trim() && !stocks.find(s => s.symbol === newStockSymbol.toUpperCase())) {
      const newStock = {
        symbol: newStockSymbol.toUpperCase(),
        color: colors[stocks.length % colors.length],
        data: [],
        price: 0,
        change: 0,
        changePercent: 0
      };
      setStocks([...stocks, newStock]);
      setNewStockSymbol('');
      setShowAddStock(false);
    }
  };

  // Remove stock
  const removeStock = (symbol) => {
    setStocks(stocks.filter(s => s.symbol !== symbol));
  };

  // Initial fetch
  useEffect(() => {
    fetchStockData();
  }, [timeRange]);

  // Auto-refresh every 45 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStockData();
    }, 45000);

    return () => clearInterval(interval);
  }, [timeRange]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm font-medium">{entry.dataKey}</span>
              <span className="text-sm font-bold text-gray-900">
                ₹{entry.value.toFixed(2)}
              </span>
            </div>
          ))}
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
          <h3 className="text-lg font-semibold text-gray-900">Stock Comparison</h3>
          <p className="text-sm text-gray-600">Real-time stock performance comparison</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <div className="flex space-x-2">
            {['1D', '1W', '1M', '3M'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
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
          
          {/* Add Stock Button */}
          <button
            onClick={() => setShowAddStock(true)}
            className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Stock</span>
          </button>
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h4 className="text-lg font-semibold mb-4">Add Stock</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newStockSymbol}
                onChange={(e) => setNewStockSymbol(e.target.value)}
                placeholder="Enter stock symbol (e.g., TSLA)"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addStock()}
              />
              <button
                onClick={addStock}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddStock(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: stock.color }}
              ></div>
              <div>
                <div className="font-medium text-gray-900">{stock.symbol}</div>
                <div className="text-sm text-gray-600">
                  ₹{stock.price.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 ${
                stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stock.changePercent >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-medium">
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>
              {stocks.length > 1 && (
                <button
                  onClick={() => removeStock(stock.symbol)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stocks[0]?.data || []}>
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
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {stocks.map((stock) => (
              <Line
                key={stock.symbol}
                type="monotone"
                dataKey={stock.symbol}
                stroke={stock.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: stock.color, strokeWidth: 2, fill: stock.color }}
                data={stock.data}
                name={stock.symbol}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-900">{stock.symbol}</div>
              <div className={`text-lg font-bold ${
                stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">
                ₹{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiStockChart; 