import React, { useState } from 'react';

const fetchMockStockData = async (symbol) => {
  // Mock data: last 5 closing prices
  // In real use, replace with API call (e.g., Alpha Vantage, Yahoo Finance)
  const mockPrices = {
    AAPL: [170, 172, 174, 173, 175],
    MSFT: [320, 322, 321, 323, 325],
    TSLA: [700, 710, 705, 715, 720],
    INFY: [1400, 1410, 1405, 1420, 1430],
  };
  return mockPrices[symbol.toUpperCase()] || [100, 101, 102, 103, 104];
};

const getRecommendation = (prices) => {
  if (prices.length < 2) return 'Not enough data';
  const last = prices[prices.length - 1];
  const avg = prices.slice(0, -1).reduce((a, b) => a + b, 0) / (prices.length - 1);
  if (last > avg * 1.01) return 'Sell';
  if (last < avg * 0.99) return 'Buy';
  return 'Hold';
};

const StockAnalyzer = () => {
  const [symbol, setSymbol] = useState('');
  const [prices, setPrices] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setRecommendation('');
    setPrices([]);
    try {
      const data = await fetchMockStockData(symbol);
      setPrices(data);
      setRecommendation(getRecommendation(data));
    } catch (e) {
      setError('Failed to fetch stock data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-8 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Stock Analyzer</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          placeholder="Enter Stock Symbol (e.g., AAPL, MSFT, TSLA, INFY)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleAnalyze}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          disabled={loading || !symbol.trim()}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {prices.length > 0 && (
        <div className="mb-2 text-sm text-gray-700">
          Last 5 closing prices: {prices.join(', ')}
        </div>
      )}
      {recommendation && (
        <div className="mt-4 text-lg font-semibold">
          Recommendation: {' '}
          <span className={
            recommendation === 'Buy' ? 'text-green-600' :
            recommendation === 'Sell' ? 'text-red-600' :
            'text-yellow-600'
          }>
            {recommendation}
          </span>
        </div>
      )}
    </div>
  );
};

export default StockAnalyzer;
