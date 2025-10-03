import { getAuthToken } from './api';

const baseURL = 'http://localhost:5001/api';

class GoldService {
  // Get current gold prices
  async getGoldPrices() {
    try {
      const response = await fetch(`${baseURL}/gold/prices`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to fetch gold prices');
      }
    } catch (error) {
      console.error('Error fetching gold prices:', error);
      throw error;
    }
  }

  // Get historical data for a specific commodity
  async getHistoricalData(symbol, period = '1M') {
    try {
      const response = await fetch(`${baseURL}/gold/historical/${symbol}?period=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to fetch historical data');
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }

  // Get market analysis for a specific commodity
  async getMarketAnalysis(symbol) {
    try {
      const response = await fetch(`${baseURL}/gold/analysis/${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to fetch market analysis');
      }
    } catch (error) {
      console.error('Error fetching market analysis:', error);
      throw error;
    }
  }

  // Create price alert
  async createPriceAlert(alertData) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${baseURL}/gold/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(alertData)
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to create price alert');
      }
    } catch (error) {
      console.error('Error creating price alert:', error);
      throw error;
    }
  }

  // Get user alerts
  async getUserAlerts() {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${baseURL}/gold/alerts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to fetch alerts');
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  }

  // Delete price alert
  async deletePriceAlert(alertId) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${baseURL}/gold/alerts/${alertId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to delete alert');
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }

  // Format price for display
  formatPrice(price, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Format change for display
  formatChange(change, percent) {
    const isPositive = change >= 0;
    return {
      value: `${isPositive ? '+' : ''}${this.formatPrice(Math.abs(change))}`,
      percent: `${isPositive ? '+' : ''}${percent.toFixed(2)}%`,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-50' : 'bg-red-50',
      isPositive
    };
  }

  // Get commodity information
  getCommodityInfo(symbol) {
    const commodities = {
      'XAU': {
        name: 'Gold',
        icon: '🥇',
        color: 'from-yellow-400 to-yellow-600',
        unit: '10g',
        indianUnit: 'per 10 grams',
        description: 'Gold is a precious metal used as a store of value and hedge against inflation.'
      },
      'XAG': {
        name: 'Silver',
        icon: '🥈',
        color: 'from-gray-300 to-gray-500',
        unit: 'kg',
        indianUnit: 'per kg',
        description: 'Silver is a precious metal with industrial applications and investment value.'
      },
      'XPT': {
        name: 'Platinum',
        icon: '💎',
        color: 'from-blue-400 to-blue-600',
        unit: 'oz',
        indianUnit: 'per oz',
        description: 'Platinum is a rare precious metal with industrial and investment applications.'
      },
      'XPD': {
        name: 'Palladium',
        icon: '⭐',
        color: 'from-purple-400 to-purple-600',
        unit: 'oz',
        indianUnit: 'per oz',
        description: 'Palladium is a precious metal used in automotive catalysts and electronics.'
      }
    };
    
    return commodities[symbol] || commodities['XAU'];
  }

  // Generate mock data for fallback
  generateMockData() {
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
        source: 'mock',
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
        source: 'mock',
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
        source: 'mock',
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
        source: 'mock',
        isIndianMarket: true
      }
    ];
  }

  // Generate mock historical data
  generateMockHistoricalData(symbol, days = 30) {
    const basePrices = { XAU: 6850, XAG: 82500, XPT: 7034625, XPD: 123643 };
    const basePrice = basePrices[symbol] || 6850;
    
    const data = [];
    let currentPrice = basePrice;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const volatility = 0.02; // 2% daily volatility
      const change = (Math.random() - 0.5) * volatility * currentPrice;
      
      const open = currentPrice;
      const close = currentPrice + change;
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      data.push({
        date,
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close),
        volume: Math.floor(Math.random() * 100000) + 10000
      });
      
      currentPrice = close;
    }
    
    return data;
  }

  // Generate mock market analysis
  generateMockAnalysis(symbol) {
    const trends = ['bullish', 'bearish', 'neutral'];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    
    return {
      symbol,
      trend,
      volatility: Math.random() * 5 + 1,
      support: Math.floor(Math.random() * 1000) + 5000,
      resistance: Math.floor(Math.random() * 1000) + 7000,
      prediction: `Market shows ${trend} sentiment with moderate volatility`,
      confidence: Math.floor(Math.random() * 30) + 70,
      lastUpdated: new Date()
    };
  }
}

export default new GoldService();
