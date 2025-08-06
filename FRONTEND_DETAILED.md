# FuturePath AI - Frontend Detailed Documentation

## 📋 Table of Contents
1. [Component Architecture](#component-architecture)
2. [State Management](#state-management)
3. [Routing System](#routing-system)
4. [API Integration](#api-integration)
5. [UI/UX Implementation](#uiux-implementation)
6. [Performance Optimization](#performance-optimization)
7. [Testing Strategy](#testing-strategy)
8. [Build & Deployment](#build--deployment)

---

## 🏗️ Component Architecture

### Core Application Structure
```javascript
// App.jsx - Main application component
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage/LandingPage'
import MainDashboard from './pages/main_dashboard'
import ExpenseTracker from './pages/Expense_tracker'
import Goals from './pages/Goals'
import Insights from './pages/Insights'
import Investment from './pages/Investment'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import LoginSignupComponent from './SignUp/LoginSignupComponent'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginSignupComponent />} />
        <Route path="/signup" element={<LoginSignupComponent />} />
        <Route path="/get-started" element={<LoginSignupComponent />} />
        <Route path="/dashboard" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />
        <Route path="/main-dashboard" element={<ProtectedRoute><MainDashboard /></ProtectedRoute>} />
        <Route path="/expense-tracker" element={<ProtectedRoute><ExpenseTracker /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/my-goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/ai-advisor" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
        <Route path="/investment" element={<ProtectedRoute><Investment /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
```

### Protected Route Component
```javascript
// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
```

### Main Dashboard Component
```javascript
// pages/main_dashboard.jsx - Core dashboard implementation
import React, { useEffect, useState, useCallback } from 'react';
import { 
  Bell, User, TrendingUp, TrendingDown, Calendar, FileText, BarChart3, 
  Download, ArrowRight, Plus, Settings, Eye, Edit, Trash2, 
  DollarSign, CreditCard, PiggyBank, Target, AlertCircle, CheckCircle,
  Clock, RefreshCw, Zap, Lightbulb, X
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import MainDashboardNavbar from './main_dashboard_navbar';
import { authAPI, financialAPI } from '../services/api';

const MainDashboard = () => {
  const navigate = useNavigate();
  
  // State management for real-time data
  const [stockData, setStockData] = useState([]);
  const [symbol, setSymbol] = useState('AAPL');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Financial data state
  const [financialData, setFinancialData] = useState({
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    netSavings: 0,
    budget: 50000,
    spent: 0,
    budgetProgress: 0
  });
  
  // Real-time data fetching
  const fetchStockData = useCallback(async () => {
    setLoading(true);
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1min&apikey=${API_KEY}&outputsize=30`;
    try {
      const response = await axios.get(url);
      if (response.data && response.data.values) {
        setStockData(
          response.data.values
            .reverse()
            .map(item => ({
              time: item.datetime.slice(11, 16),
              price: parseFloat(item.close)
            }))
        );
      }
    } catch (error) {
      console.error('Stock data fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setDataLoading(true);
        
        // Fetch financial data
        const financialResponse = await financialAPI.getFinancialData();
        if (financialResponse.success) {
          setFinancialData(financialResponse.data);
        }
        
        // Fetch recent transactions
        const transactionsResponse = await financialAPI.getTransactions();
        if (transactionsResponse.success) {
          setRecentTransactions(transactionsResponse.data.slice(0, 5));
        }
        
        // Fetch AI tips
        const tipsResponse = await financialAPI.getAiTips();
        if (tipsResponse.success) {
          setAiTips(tipsResponse.data);
        }
        
        // Fetch notifications
        const notificationsResponse = await financialAPI.getNotifications();
        if (notificationsResponse.success) {
          setNotifications(notificationsResponse.data);
        }
        
      } catch (error) {
        console.error('Data initialization error:', error);
      } finally {
        setDataLoading(false);
      }
    };

    initializeData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchStockData();
      setLastUpdated(new Date());
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [fetchStockData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <MainDashboardNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinancialCard
            title="Current Balance"
            amount={financialData.currentBalance}
            icon={<DollarSign className="w-6 h-6" />}
            trend="up"
            percentage={12.5}
          />
          <FinancialCard
            title="Monthly Income"
            amount={financialData.monthlyIncome}
            icon={<TrendingUp className="w-6 h-6" />}
            trend="up"
            percentage={8.2}
          />
          <FinancialCard
            title="Monthly Expenses"
            amount={financialData.monthlyExpenses}
            icon={<TrendingDown className="w-6 h-6" />}
            trend="down"
            percentage={-5.1}
          />
          <FinancialCard
            title="Net Savings"
            amount={financialData.netSavings}
            icon={<PiggyBank className="w-6 h-6" />}
            trend="up"
            percentage={15.3}
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard title="Expense Trends" />
          <ChartCard title="Income vs Expenses" />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <RecentTransactions />
          <AITips />
          <Notifications />
        </div>
      </div>
    </div>
  );
};
```

---

## 🔄 State Management

### Authentication State
```javascript
// services/authService.js
import { authAPI, setAuthToken, setUser, getUser, logout } from './api';

export const useAuth = () => {
  const [user, setUserState] = useState(getUser());
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authAPI.login(credentials);
      if (response.success) {
        setAuthToken(response.token);
        setUser(response.user);
        setUserState(response.user);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.signup(userData);
      if (response.success) {
        setAuthToken(response.token);
        setUser(response.user);
        setUserState(response.user);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    logout();
    setUserState(null);
  };

  return {
    user,
    loading,
    login,
    signup,
    logout: logoutUser,
    isAuthenticated: !!user
  };
};
```

### Financial Data State
```javascript
// services/dashboardService.js
import { financialAPI } from './api';

export const useFinancialData = () => {
  const [financialData, setFinancialData] = useState({
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    netSavings: 0,
    budget: 50000,
    spent: 0,
    budgetProgress: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await financialAPI.getFinancialData();
      if (response.success) {
        setFinancialData(response.data);
      }
    } catch (error) {
      console.error('Financial data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await financialAPI.getTransactions();
      if (response.success) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error('Transactions fetch error:', error);
    }
  };

  useEffect(() => {
    fetchFinancialData();
    fetchTransactions();
  }, []);

  return {
    financialData,
    transactions,
    loading,
    refetch: fetchFinancialData
  };
};
```

---

## 🛣️ Routing System

### Route Configuration
```javascript
// App.jsx - Route definitions
const routes = [
  {
    path: '/',
    element: <LandingPage />,
    public: true
  },
  {
    path: '/login',
    element: <LoginSignupComponent />,
    public: true
  },
  {
    path: '/signup',
    element: <LoginSignupComponent />,
    public: true
  },
  {
    path: '/dashboard',
    element: <MainDashboard />,
    protected: true
  },
  {
    path: '/expense-tracker',
    element: <ExpenseTracker />,
    protected: true
  },
  {
    path: '/goals',
    element: <Goals />,
    protected: true
  },
  {
    path: '/insights',
    element: <Insights />,
    protected: true
  },
  {
    path: '/investment',
    element: <Investment />,
    protected: true
  },
  {
    path: '/profile',
    element: <Profile />,
    protected: true
  },
  {
    path: '/settings',
    element: <Settings />,
    protected: true
  }
];
```

### Navigation Component
```javascript
// components/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, TrendingUp, Target, Brain, BarChart3, 
  User, Settings, LogOut 
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home /> },
    { path: '/expense-tracker', label: 'Expenses', icon: <TrendingUp /> },
    { path: '/goals', label: 'Goals', icon: <Target /> },
    { path: '/insights', label: 'AI Insights', icon: <Brain /> },
    { path: '/investment', label: 'Investment', icon: <BarChart3 /> },
    { path: '/profile', label: 'Profile', icon: <User /> },
    { path: '/settings', label: 'Settings', icon: <Settings /> }
  ];

  return (
    <nav className="bg-white shadow-lg rounded-lg p-4">
      <div className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 w-full"
        >
          <LogOut />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};
```

---

## 🔌 API Integration

### API Service Layer
```javascript
// services/api.js - Core API communication
const baseURL = 'http://localhost:5000';

// Auth API object
export const authAPI = {
  async login(credentials) {
    try {
      const response = await fetch(`${baseURL}/api/login`, {
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
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  },

  async signup(userData) {
    try {
      const response = await fetch(`${baseURL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
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
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }
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
        const stats = data.stats;
        return {
          success: true,
          data: {
            currentBalance: stats.netSavings || 0,
            monthlyIncome: stats.totalIncome || 0,
            monthlyExpenses: stats.totalExpenses || 0,
            netSavings: stats.netSavings || 0,
            budget: 50000,
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
  }
};
```

---

## 🎨 UI/UX Implementation

### Component Styling with Tailwind
```javascript
// components/FinancialCard.jsx
const FinancialCard = ({ title, amount, icon, trend, percentage }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          {icon}
        </div>
        <div className={`flex items-center space-x-1 ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {percentage > 0 ? '+' : ''}{percentage}%
          </span>
        </div>
      </div>
      
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">
        ₹{amount.toLocaleString()}
      </p>
    </div>
  );
};
```

### Chart Components
```javascript
// components/ChartCard.jsx
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const ChartCard = ({ title, data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={2} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
```

### Responsive Design
```javascript
// Tailwind responsive classes
const responsiveClasses = {
  container: "container mx-auto px-4 sm:px-6 lg:px-8",
  grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6",
  card: "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6",
  text: "text-sm sm:text-base lg:text-lg",
  button: "px-4 py-2 text-sm sm:text-base font-medium rounded-lg"
};
```

---

## ⚡ Performance Optimization

### Code Splitting
```javascript
// Lazy loading for route components
import { lazy, Suspense } from 'react';

const MainDashboard = lazy(() => import('./pages/main_dashboard'));
const ExpenseTracker = lazy(() => import('./pages/Expense_tracker'));
const Goals = lazy(() => import('./pages/Goals'));
const Insights = lazy(() => import('./pages/Insights'));

// Suspense wrapper
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Route with lazy loading
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<LoadingSpinner />}>
        <MainDashboard />
      </Suspense>
    </ProtectedRoute>
  } 
/>
```

### Memoization
```javascript
// Memoized components for performance
import React, { memo, useMemo, useCallback } from 'react';

const FinancialCard = memo(({ title, amount, icon, trend, percentage }) => {
  const formattedAmount = useMemo(() => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR'
    });
  }, [amount]);

  const handleClick = useCallback(() => {
    // Handle card click
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" onClick={handleClick}>
      {/* Card content */}
    </div>
  );
});
```

### Image Optimization
```javascript
// Optimized image loading
const OptimizedImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
};
```

---

## 🧪 Testing Strategy

### Component Testing
```javascript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FinancialCard from '../components/FinancialCard';

describe('FinancialCard', () => {
  const mockProps = {
    title: 'Current Balance',
    amount: 50000,
    icon: <div>Icon</div>,
    trend: 'up',
    percentage: 12.5
  };

  test('renders financial card with correct data', () => {
    render(
      <BrowserRouter>
        <FinancialCard {...mockProps} />
      </BrowserRouter>
    );

    expect(screen.getByText('Current Balance')).toBeInTheDocument();
    expect(screen.getByText('₹50,000')).toBeInTheDocument();
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(
      <BrowserRouter>
        <FinancialCard {...mockProps} onClick={handleClick} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Current Balance'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Testing
```javascript
// API service test
import { authAPI } from '../services/api';

describe('Auth API', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test('login success', async () => {
    const mockResponse = {
      success: true,
      token: 'mock-token',
      user: { id: '1', name: 'Test User', email: 'test@example.com' }
    };

    fetch.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await authAPI.login({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(result.success).toBe(true);
    expect(result.token).toBe('mock-token');
  });

  test('login failure', async () => {
    const mockResponse = {
      success: false,
      message: 'Invalid credentials'
    };

    fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 401 });

    const result = await authAPI.login({
      email: 'test@example.com',
      password: 'wrong-password'
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid credentials');
  });
});
```

---

## 🚀 Build & Deployment

### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          icons: ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

### Environment Configuration
```javascript
// Environment variables
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
    STOCK_API_KEY: 'your-stock-api-key',
    OPENAI_API_KEY: 'your-openai-api-key'
  },
  production: {
    API_BASE_URL: 'https://your-backend-domain.com',
    STOCK_API_KEY: process.env.STOCK_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
  }
};

export const getConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return config[env];
};
```

### Build Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

*This detailed frontend documentation covers the complete React application architecture, state management, routing, and UI/UX implementation for the FuturePath AI application.* 