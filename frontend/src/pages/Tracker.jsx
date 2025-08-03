import React, { useState, useEffect } from 'react';
import { BarChart3, DollarSign, TrendingUp, Calendar, Plus, Filter } from 'lucide-react';
import MainDashboardNavbar from './main_dashboard_navbar';
import transactionService from '../services/transactionService';

const Tracker = () => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    thisMonthExpenses: 0
  });
  const [categories, setCategories] = useState([]);

  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await transactionService.getTransactions();
        setTransactions(data);
        
        // Calculate stats
        const totalIncome = data
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const totalExpenses = data
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const netSavings = totalIncome - totalExpenses;
        
        // Calculate this month's expenses
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthExpenses = data
          .filter(t => {
            const transactionDate = new Date(t.date);
            return t.type === 'expense' &&
                   transactionDate.getMonth() === currentMonth &&
                   transactionDate.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        setStats({
          totalIncome,
          totalExpenses,
          netSavings,
          thisMonthExpenses
        });
        
        // Calculate category spending
        const categoryMap = new Map();
        data
          .filter(t => t.type === 'expense')
          .forEach(t => {
            const category = t.category || 'Other';
            const amount = Number(t.amount);
            categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
          });
        
        const categoryData = Array.from(categoryMap.entries()).map(([name, amount]) => ({
          name,
          amount,
          color: getCategoryColor(name),
          icon: getCategoryIcon(name)
        }));
        
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'bg-red-500',
      'Transportation': 'bg-blue-500',
      'Shopping': 'bg-purple-500',
      'Entertainment': 'bg-green-500',
      'Healthcare': 'bg-yellow-500',
      'Education': 'bg-indigo-500',
      'Utilities': 'bg-pink-500',
      'Other': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎬',
      'Healthcare': '🏥',
      'Education': '📚',
      'Utilities': '⚡',
      'Other': '📦'
    };
    return icons[category] || '📦';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainDashboardNavbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
            <p className="text-gray-600 mt-2">Track your income and expenses with AI-powered insights</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-green-600">₹{stats.totalIncome.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">₹{stats.totalExpenses.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Net Savings</p>
                <p className={`text-2xl font-bold ${stats.netSavings >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  ₹{stats.netSavings.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Month</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.thisMonthExpenses.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('expenses')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'expenses'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recent Transactions
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'categories'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'expenses' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No transactions found. Add your first transaction to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions.slice(0, 10).map((transaction) => (
                    <div key={transaction._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <span className="text-lg">{transaction.type === 'income' ? '💰' : '💸'}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.category || 'Other'}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}₹{Number(transaction.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
              {categories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No expense categories found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{category.icon}</div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-sm text-gray-500">₹{category.amount.toLocaleString()}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Analytics</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <p>Analytics charts will be displayed here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracker;