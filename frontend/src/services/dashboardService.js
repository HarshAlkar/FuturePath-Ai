const baseURL = 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Dashboard API object
export const dashboardAPI = {
  // Get real-time dashboard statistics
  async getDashboardStats() {
    try {
      const response = await fetch(`${baseURL}/api/transactions/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          stats: data.stats
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch dashboard stats'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  // Get expense trend data for charts
  async getExpenseTrend(timeRange = 'week', category = 'all') {
    try {
      const response = await fetch(`${baseURL}/api/transactions/trend?timeRange=${timeRange}&category=${category}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          trendData: data.trendData
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch expense trend'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  // Get upcoming transactions
  async getUpcomingTransactions() {
    try {
      const response = await fetch(`${baseURL}/api/transactions/upcoming`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          transactions: data.transactions
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch upcoming transactions'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  // Get AI insights and recommendations
  async getAIInsights() {
    try {
      const response = await fetch(`${baseURL}/api/dashboard/insights`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          insights: data.insights
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch AI insights'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  // Get budget overview
  async getBudgetOverview() {
    try {
      const response = await fetch(`${baseURL}/api/dashboard/budget`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          budget: data.budget
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch budget overview'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  // Get real-time stock data (mock for now, can be replaced with real stock API)
  async getStockData(symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA']) {
    try {
      // Mock stock data - in production, this would call a real stock API
      const mockStockData = symbols.map(symbol => ({
        symbol,
        price: (Math.random() * 1000 + 100).toFixed(2),
        change: (Math.random() * 20 - 10).toFixed(2),
        changePercent: (Math.random() * 10 - 5).toFixed(2),
        volume: Math.floor(Math.random() * 1000000),
        marketCap: (Math.random() * 1000000000).toFixed(0),
        timestamp: new Date().toISOString()
      }));

      return {
        success: true,
        stocks: mockStockData
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch stock data'
      };
    }
  },

  // Get real-time market indices
  async getMarketIndices() {
    try {
      // Mock market indices data
      const mockIndices = [
        {
          name: 'S&P 500',
          value: (Math.random() * 5000 + 4000).toFixed(2),
          change: (Math.random() * 50 - 25).toFixed(2),
          changePercent: (Math.random() * 2 - 1).toFixed(2)
        },
        {
          name: 'NASDAQ',
          value: (Math.random() * 15000 + 12000).toFixed(2),
          change: (Math.random() * 100 - 50).toFixed(2),
          changePercent: (Math.random() * 2 - 1).toFixed(2)
        },
        {
          name: 'DOW',
          value: (Math.random() * 40000 + 30000).toFixed(2),
          change: (Math.random() * 200 - 100).toFixed(2),
          changePercent: (Math.random() * 2 - 1).toFixed(2)
        }
      ];

      return {
        success: true,
        indices: mockIndices
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch market indices'
      };
    }
  },

  // Get user's investment portfolio
  async getPortfolio() {
    try {
      const response = await fetch(`${baseURL}/api/dashboard/portfolio`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          portfolio: data.portfolio
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch portfolio'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  // Get recent activity
  async getRecentActivity() {
    try {
      const response = await fetch(`${baseURL}/api/transactions?limit=10`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          activities: data.transactions
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch recent activity'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }
};

export default dashboardAPI; 