const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Auth API object
export const authAPI = {
  async login(credentials) {
    try {
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          token: data.token,
          user: data.user
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  async signup(userData) {
    try {
      // Transform frontend data to backend format
      const backendData = {
        email: userData.email,
        phone: userData.phone || '1234567890', // Default phone if not provided
        password: userData.password,
        firstName: userData.name?.split(' ')[0] || userData.firstName || 'User',
        lastName: userData.name?.split(' ')[1] || userData.lastName || 'User',
        dateOfBirth: userData.dateOfBirth || '1990-01-01', // Default date if not provided
        panNumber: userData.panNumber || 'ABCDE1234F' // Default PAN if not provided
      };

      console.log('Original data:', userData);
      console.log('Transformed data:', backendData);

      const response = await fetch(`${baseURL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          token: data.token,
          user: data.user
        };
      } else {
        return {
          success: false,
          message: data.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  async getCurrentUser() {
    try {
      const token = getAuthToken();
      if (!token) {
        return null;
      }

      const response = await fetch(`${baseURL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return data.user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
};

// Token management functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// User management functions
export const setUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Financial API object
export const financialAPI = {
  async getFinancialData() {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: 'No authentication token' };
      }

      const response = await fetch(`${baseURL}/api/transactions/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Transform the data to match the expected format
        const stats = data.stats;
        return {
          success: true,
          data: {
            currentBalance: stats.netSavings || 0,
            monthlyIncome: stats.totalIncome || 0,
            monthlyExpenses: stats.totalExpenses || 0,
            netSavings: stats.netSavings || 0,
            budget: 50000, // Default budget
            spent: stats.totalExpenses || 0,
            budgetProgress: ((stats.totalExpenses || 0) / 50000) * 100
          }
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch financial data'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  async getTransactions() {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: 'No authentication token' };
      }

      const response = await fetch(`${baseURL}/api/transactions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.transactions || []
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch transactions'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  async getAiTips() {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: 'No authentication token' };
      }

      const response = await fetch(`${baseURL}/api/ai-tips`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.tips || []
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch AI tips'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  async getNotifications() {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: 'No authentication token' };
      }

      const response = await fetch(`${baseURL}/api/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.notifications || []
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to fetch notifications'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  async updateBudget(budgetData) {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: 'No authentication token' };
      }

      const response = await fetch(`${baseURL}/api/budget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(budgetData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to update budget'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  async updateFinancialData(financialData) {
    try {
      const token = getAuthToken();
      if (!token) {
        return { success: false, message: 'No authentication token' };
      }

      const response = await fetch(`${baseURL}/api/financial-data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(financialData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data
        };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to update financial data'
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