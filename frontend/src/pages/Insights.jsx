import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Lightbulb, Target, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import MainDashboardNavbar from './main_dashboard_navbar';
import transactionService from '../services/transactionService';
import goalService from '../services/goalService';

const Insights = () => {
  const [activePeriod, setActivePeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState([]);
  const [trends, setTrends] = useState([]);
  const [metrics, setMetrics] = useState({
    totalSpending: 0,
    savingsRate: 0,
    budgetUtilization: 0,
    investmentGrowth: 0
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [transactionsData, goalsData] = await Promise.all([
          transactionService.getTransactions(),
          goalService.getGoals()
        ]);
        
        setTransactions(transactionsData);
        setGoals(goalsData);
        
        // Calculate insights and metrics
        calculateInsights(transactionsData, goalsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activePeriod]);

  const calculateInsights = (transactionsData, goalsData) => {
    // Calculate total spending
    const totalSpending = transactionsData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    // Calculate total income
    const totalIncome = transactionsData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    // Calculate savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome) * 100 : 0;
    
    // Calculate budget utilization (assuming 80% of income as budget)
    const monthlyBudget = totalIncome * 0.8;
    const budgetUtilization = monthlyBudget > 0 ? (totalSpending / monthlyBudget) * 100 : 0;
    
    // Calculate investment growth (from goals progress)
    const investmentGrowth = goalsData
      .filter(g => g.category === 'investment')
      .reduce((sum, g) => sum + Number(g.progress || 0), 0);
    
    setMetrics({
      totalSpending,
      savingsRate: Math.round(savingsRate),
      budgetUtilization: Math.round(budgetUtilization),
      investmentGrowth
    });
    
    // Generate insights
    generateInsights(transactionsData, goalsData, totalSpending, totalIncome, savingsRate);
    
    // Calculate trends
    calculateTrends(transactionsData);
  };

  const generateInsights = (transactionsData, goalsData, totalSpending, totalIncome, savingsRate) => {
    const newInsights = [];
    
    // Spending pattern analysis
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const currentMonthExpenses = transactionsData
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const lastMonthExpenses = transactionsData
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getMonth() === lastMonth && 
               date.getFullYear() === lastYear;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const spendingChange = lastMonthExpenses > 0 ? 
      ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;
    
    if (spendingChange > 10) {
      newInsights.push({
        id: 1,
        title: "Spending Pattern Analysis",
        description: `Your expenses increased by ${Math.abs(Math.round(spendingChange))}% this month compared to last month`,
        type: "warning",
        icon: "🍽️",
        change: `+${Math.round(spendingChange)}%`,
        trend: "up"
      });
    }
    
    // Savings opportunity
    if (savingsRate < 20) {
      const potentialSavings = totalIncome * 0.2 - (totalIncome - totalSpending);
      if (potentialSavings > 0) {
        newInsights.push({
          id: 2,
          title: "Savings Opportunity",
          description: `You can save ₹${Math.round(potentialSavings).toLocaleString()} more by reducing expenses`,
          type: "opportunity",
          icon: "💰",
          change: `₹${Math.round(potentialSavings).toLocaleString()}`,
          trend: "up"
        });
      }
    }
    
    // Investment recommendation
    const investmentGoals = goalsData.filter(g => g.category === 'investment');
    if (investmentGoals.length > 0) {
      const avgProgress = investmentGoals.reduce((sum, g) => sum + Number(g.progress || 0), 0) / investmentGoals.length;
      if (avgProgress < 50) {
        newInsights.push({
          id: 3,
          title: "Investment Recommendation",
          description: "Consider increasing your SIP investment for better returns",
          type: "recommendation",
          icon: "📈",
          change: "₹5,000",
          trend: "up"
        });
      }
    }
    
    // Budget alert
    if (budgetUtilization > 80) {
      newInsights.push({
        id: 4,
        title: "Budget Alert",
        description: `You've spent ${Math.round(budgetUtilization)}% of your monthly budget`,
        type: "alert",
        icon: "⚠️",
        change: `${Math.round(budgetUtilization)}%`,
        trend: "down"
      });
    }
    
    setInsights(newInsights);
  };

  const calculateTrends = (transactionsData) => {
    const categoryMap = new Map();
    
    transactionsData
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const category = t.category || 'Other';
        const amount = Number(t.amount);
        categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
      });
    
    const trendsData = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      change: "+12%", // This would need historical data for accurate calculation
      trend: "up"
    }));
    
    setTrends(trendsData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading insights...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">AI-Powered Insights</h1>
            <p className="text-gray-600 mt-2">Discover patterns and opportunities in your financial data</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <select 
              value={activePeriod}
              onChange={(e) => setActivePeriod(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm">
              Export Report
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
              Generate Insights
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Spending</p>
                <p className="text-2xl font-bold text-gray-900">₹{metrics.totalSpending.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +8.5% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.savingsRate}%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +2.1% from last month
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Budget Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.budgetUtilization}%</p>
                <p className="text-sm text-yellow-600 flex items-center">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  -5% from last month
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Investment Growth</p>
                <p className="text-2xl font-bold text-gray-900">₹{metrics.investmentGrowth.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.3% from last month
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">AI Insights</h2>
            {insights.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No insights available yet. Add more transactions to get personalized insights!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{insight.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                          <span className={`text-sm font-medium ${
                            insight.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {insight.change}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Spending Trends</h2>
            {trends.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No spending trends available yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="font-medium text-gray-900">{trend.category}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-gray-900">₹{trend.amount.toLocaleString()}</span>
                      <span className={`text-sm font-medium flex items-center ${
                        trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trend.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                        {trend.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Smart Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Budget Optimization</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {metrics.budgetUtilization > 80 
                  ? `Reduce expenses by ${Math.round((metrics.budgetUtilization - 80) / 2)}% to stay within budget`
                  : 'Your budget utilization is healthy. Keep up the good work!'
                }
              </p>
              <button className="text-blue-600 text-sm font-medium hover:underline">
                Apply Recommendation
              </button>
            </div>

            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Investment Boost</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {metrics.savingsRate < 20 
                  ? 'Increase your savings rate to 20% for better financial security'
                  : 'Great savings rate! Consider investing more for better returns'
                }
              </p>
              <button className="text-green-600 text-sm font-medium hover:underline">
                Apply Recommendation
              </button>
            </div>

            <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Smart Savings</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Set up automatic transfers to save ₹{Math.round(metrics.totalSpending * 0.1).toLocaleString()} monthly
              </p>
              <button className="text-purple-600 text-sm font-medium hover:underline">
                Apply Recommendation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights; 