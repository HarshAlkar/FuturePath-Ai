import React, { useState, useEffect } from 'react';
import { BarChart3, Goal, DollarSign, FileText, Bell, User, Plus, Grid3X3, List, Eye, Edit3, X, TrendingUp, TrendingDown, Calendar, Target, Zap, Trash2, RefreshCw, TrendingUp as SIPIcon } from 'lucide-react';
import MainDashboardNavbar from './main_dashboard_navbar';
import goalService from '../services/goalService';
import transactionService from '../services/transactionService';
import sharedDataService from '../services/sharedDataService';
import StockAnalyzer from './StockAnalyzer';
import SipRecommendation from '../components/SipRecommendation';

const Goals = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('progress');
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalSpending: 0,
    savingsRate: 0,
    budgetUtilization: 0,
    investmentGrowth: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    amount: '',
    type: 'Short-Term',
    timeline: ''
  });
  const [editGoal, setEditGoal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [conversationInput, setConversationInput] = useState('');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedGoalForPlan, setSelectedGoalForPlan] = useState(null);
  const [aiPlan, setAiPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [expenseAnalysis, setExpenseAnalysis] = useState(null);
  const [showExpenseInsights, setShowExpenseInsights] = useState(false);
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [monthlySavings, setMonthlySavings] = useState({
    amount: 0,
    percentage: 0,
    trend: 'stable',
    lastMonth: 0,
    thisMonth: 0
  });
  const [savingsRecommendations, setSavingsRecommendations] = useState({
    currentIncome: 0,
    recommendedSavings: {
      emergency: 0,
      retirement: 0,
      shortTerm: 0,
      total: 0
    },
    savingsTargets: {
      minimum: 0,
      recommended: 0,
      aggressive: 0
    }
  });
  const [showSipModal, setShowSipModal] = useState(false);

  useEffect(() => {
    // Initialize shared data service
    initializeSharedData();
    
    // Cleanup on unmount
    return () => {
      sharedDataService.removeAllListeners();
    };
  }, []);

  const initializeSharedData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Set up event listeners
      sharedDataService.on('dataUpdated', handleDataUpdate);
      sharedDataService.on('loading', setLoading);
      sharedDataService.on('error', handleError);
      sharedDataService.on('goalAdded', handleGoalAdded);
      sharedDataService.on('goalUpdated', handleGoalUpdated);
      sharedDataService.on('goalDeleted', handleGoalDeleted);
      
      // Initialize the service
      await sharedDataService.initialize();
      
    } catch (error) {
      console.error('Error initializing shared data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = (data) => {
    console.log('Goals: Data updated from shared service:', data);
    setGoals(data.goals || []);
    setTransactions(data.transactions || []);
    setMetrics(data.metrics || {});
    setLastUpdate(data.lastUpdate);
    
    // Calculate monthly savings
    calculateMonthlySavings(data.transactions || []);
    
    // Calculate savings recommendations based on income
    calculateSavingsRecommendations(data.transactions || []);
  };

  const calculateMonthlySavings = (transactionsData) => {
    try {
      // Calculate current month income and expenses
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthStr = lastMonth.toISOString().slice(0, 7);

      const currentMonthData = transactionsData.filter(t => 
        t.date && t.date.startsWith(currentMonth)
      );
      
      const lastMonthData = transactionsData.filter(t => 
        t.date && t.date.startsWith(lastMonthStr)
      );

      // Calculate income and expenses for current month
      const currentMonthIncome = currentMonthData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const currentMonthExpenses = currentMonthData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const currentMonthSavings = currentMonthIncome - currentMonthExpenses;

      // Calculate income and expenses for last month
      const lastMonthIncome = lastMonthData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const lastMonthExpenses = lastMonthData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const lastMonthSavings = lastMonthIncome - lastMonthExpenses;

      // Calculate savings percentage
      const savingsPercentage = currentMonthIncome > 0 ? 
        (currentMonthSavings / currentMonthIncome) * 100 : 0;

      // Determine trend
      let trend = 'stable';
      if (currentMonthSavings > lastMonthSavings * 1.1) {
        trend = 'up';
      } else if (currentMonthSavings < lastMonthSavings * 0.9) {
        trend = 'down';
      }

      setMonthlySavings({
        amount: currentMonthSavings,
        percentage: Math.round(savingsPercentage),
        trend: trend,
        lastMonth: lastMonthSavings,
        thisMonth: currentMonthSavings
      });

      console.log('Monthly savings calculated:', {
        currentMonthSavings,
        lastMonthSavings,
        savingsPercentage,
        trend
      });

    } catch (error) {
      console.error('Error calculating monthly savings:', error);
    }
  };

  const calculateSavingsRecommendations = (transactionsData) => {
    try {
      // Calculate current monthly income
      const currentMonth = new Date().toISOString().slice(0, 7);
      const currentMonthIncome = transactionsData
        .filter(t => t.type === 'income' && t.date && t.date.startsWith(currentMonth))
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Calculate average monthly income (last 3 months)
      const last3Months = [];
      for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toISOString().slice(0, 7);
        const monthIncome = transactionsData
          .filter(t => t.type === 'income' && t.date && t.date.startsWith(monthStr))
          .reduce((sum, t) => sum + Number(t.amount), 0);
        last3Months.push(monthIncome);
      }
      
      const averageMonthlyIncome = last3Months.reduce((sum, income) => sum + income, 0) / 3;
      const monthlyIncome = currentMonthIncome > 0 ? currentMonthIncome : averageMonthlyIncome;

      // Calculate recommended savings based on income
      const emergencyFund = monthlyIncome * 6; // 6 months of expenses
      const retirementSavings = monthlyIncome * 0.15; // 15% for retirement
      const shortTermSavings = monthlyIncome * 0.05; // 5% for short-term goals
      const totalRecommended = emergencyFund + retirementSavings + shortTermSavings;

      // Calculate savings targets based on different strategies
      const minimumSavings = monthlyIncome * 0.1; // 10% minimum
      const recommendedSavings = monthlyIncome * 0.2; // 20% recommended
      const aggressiveSavings = monthlyIncome * 0.3; // 30% aggressive

      setSavingsRecommendations({
        currentIncome: monthlyIncome,
        recommendedSavings: {
          emergency: emergencyFund,
          retirement: retirementSavings,
          shortTerm: shortTermSavings,
          total: totalRecommended
        },
        savingsTargets: {
          minimum: minimumSavings,
          recommended: recommendedSavings,
          aggressive: aggressiveSavings
        }
      });

      console.log('Savings recommendations calculated:', {
        monthlyIncome,
        emergencyFund,
        retirementSavings,
        shortTermSavings,
        totalRecommended,
        minimumSavings,
        recommendedSavings,
        aggressiveSavings
      });

    } catch (error) {
      console.error('Error calculating savings recommendations:', error);
    }
  };

  const handleError = (error) => {
    console.error('Goals: Error from shared service:', error);
    setError('Failed to load data. Please try again.');
  };

  const handleGoalAdded = (goalData) => {
    console.log('Goals: Goal added:', goalData);
    setError(null);
  };

  const handleGoalUpdated = ({ id, goalData }) => {
    console.log('Goals: Goal updated:', { id, goalData });
    setError(null);
  };

  const handleGoalDeleted = (id) => {
    console.log('Goals: Goal deleted:', id);
    setError(null);
  };

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      await sharedDataService.refreshData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const addGoal = async () => {
    setLoading(true);
    setError(null);
    try {
      await sharedDataService.addGoal(newGoal);
      setNewGoal({ title: '', amount: '', type: 'Short-Term', timeline: '' });
      setShowAddGoalForm(false);
    } catch (error) {
      console.error("Error adding goal:", error);
      setError("Failed to add goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (id, updatedGoal) => {
    setLoading(true);
    setError(null);
    try {
      await sharedDataService.updateGoal(id, updatedGoal);
      setEditGoal(null);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating goal:", error);
      setError("Failed to update goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await sharedDataService.deleteGoal(id);
    } catch (error) {
      console.error("Error deleting goal:", error);
      setError("Failed to delete goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      const goal = getGoalById(id);
      if (!goal) {
        console.error('Goal not found:', id);
        setError('Goal not found. Please refresh the page.');
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to delete the goal "${goal.title}"? This action cannot be undone.`
      );

      if (confirmed) {
        setLoading(true);
        setError(null);
        await sharedDataService.deleteGoal(id);
        alert('Goal deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      setError("Failed to delete goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllGoals = async () => {
    try {
      if (goals.length === 0) {
        alert('No goals to delete');
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to delete ALL ${goals.length} goals? This action cannot be undone.`
      );

      if (confirmed) {
        setLoading(true);
        setError(null);
        console.log('Attempting to delete all goals');
        
        // Delete all goals one by one
        const deletePromises = goals.map(goal => 
          sharedDataService.deleteGoal(goal._id)
        );
        
        await Promise.all(deletePromises);
        
        alert('All goals have been deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting all goals:', error);
      setError(`Failed to delete all goals: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getGoalById = (id) => {
    return goals.find(goal => goal._id === id);
  };

  const getGoalProgress = (goal) => {
    if (!goal) return 0;
    return goal.progress || 0;
  };

  const getTimeLeft = (goal) => {
    if (!goal || !goal.timeline) return "No timeline set";
    const today = new Date();
    const targetDate = new Date(goal.timeline);
    const timeDiff = targetDate.getTime() - today.getTime();
    if (timeDiff <= 0) return "Completed";
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return `${daysLeft} days left`;
  };

  const getRecommendation = (goal) => {
    if (!goal) return "Goal information not available.";
    
    const progress = getGoalProgress(goal);
    const timeLeft = getTimeLeft(goal);

    if (progress >= 100) {
      return "You've achieved your goal! Keep up the good work!";
    }

    if (timeLeft === "Completed") {
      return "You've completed your goal! Great job!";
    }

    if (progress < 50) {
      return "Focus on increasing your monthly savings to stay on track.";
    }

    if (progress < 75) {
      return "You're making good progress! Keep up the momentum.";
    }

    return "You're very close to your goal! Stay consistent.";
  };

  const analyzeExpenses = async () => {
    try {
      const transactions = await transactionService.getTransactions();
      const last3Months = new Date();
      last3Months.setMonth(last3Months.getMonth() - 3);
      
      const recentTransactions = transactions.filter(tx => 
        new Date(tx.date) >= last3Months
      );

      const monthlyExpenses = recentTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.amount, 0) / 3;

      const monthlyIncome = recentTransactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.amount, 0) / 3;

      const monthlySavings = monthlyIncome - monthlyExpenses;

      const topExpenses = recentTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((acc, tx) => {
          acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
          return acc;
        }, {});

      const sortedExpenses = Object.entries(topExpenses)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);

      setExpenseAnalysis({
        monthlyExpenses,
        monthlyIncome,
        monthlySavings,
        topExpenses: sortedExpenses
      });
    } catch (error) {
      console.error('Error analyzing expenses:', error);
      setError("Failed to analyze expenses. Please try again.");
    }
  };

  const handleSuggestGoal = async () => {
    if (!expenseAnalysis) {
      await analyzeExpenses();
    }
    
    const { monthlySavings, topExpenses } = expenseAnalysis || {};
    
    if (monthlySavings > 0) {
      const suggestion = `Based on your monthly savings of ₹${monthlySavings.toLocaleString()}, consider setting a goal to save ₹${(monthlySavings * 6).toLocaleString()} for a 6-month emergency fund.`;
      setAiSuggestion(suggestion);
    } else {
      setAiSuggestion("Consider reducing expenses in high-spending categories to create room for savings goals.");
    }
  };

  const handleConversationGoal = async () => {
    if (!conversationInput.trim()) return;

    const amountMatch = conversationInput.match(/₹?(\d+(?:,\d+)*(?:\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

    if (amount) {
      const newGoalData = {
        title: conversationInput.replace(amountMatch[0], '').trim(),
        amount: amount,
        type: 'Short-Term',
        timeline: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      try {
        await sharedDataService.addGoal(newGoalData);
        alert('Goal created successfully!');
        setConversationInput('');
      } catch (error) {
        console.error('Error adding conversation goal:', error);
        setError('Failed to create goal. Please try again.');
      }
    }
  };


  const handleGeneratePlan = async (goalId) => {
    setPlanLoading(true);
    setSelectedGoalForPlan(getGoalById(goalId));
    setShowPlanModal(true);

    try {
      const response = await goalService.generatePlan(goalId);
      if (response.success && response.plan) {
        // Parse the AI plan response
        const planText = response.plan;
        
        // Extract monthly savings target
        const targetMatch = planText.match(/Target: ₹([\d,]+)/);
        const monthlySavingsTarget = targetMatch ? parseInt(targetMatch[1].replace(/,/g, '')) : 12500;
        
        // Extract recommended actions
        const actionsMatch = planText.match(/## Recommended Actions\n([\s\S]*?)(?=##|$)/);
        const recommendedActions = actionsMatch 
          ? actionsMatch[1].split('\n').filter(line => line.trim().startsWith('**')).map(line => 
              line.replace(/^\*\*[^:]+:\*\*/, '').trim()
            )
          : [
              "Set up automatic transfers to a dedicated savings account",
              "Track your progress monthly",
              "Adjust spending in high-expense categories",
              "Consider side income opportunities"
            ];
        
        // Extract milestone checkpoints
        const milestonesMatch = planText.match(/## Milestone Checkpoints\n([\s\S]*?)(?=##|$)/);
        const milestoneCheckpoints = milestonesMatch
          ? milestonesMatch[1].split('\n').filter(line => line.includes('%')).map(line => {
              const percentageMatch = line.match(/(\d+)%/);
              const amountMatch = line.match(/₹([\d,]+)/);
              return {
                percentage: percentageMatch ? parseInt(percentageMatch[1]) : 25,
                amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : 0
              };
            })
          : [
              { percentage: 25, amount: 37500 },
              { percentage: 50, amount: 75000 },
              { percentage: 75, amount: 112500 },
              { percentage: 100, amount: 150000 }
            ];
        
        // Extract tips for success
        const tipsMatch = planText.match(/## Tips for Success\n([\s\S]*?)(?=##|$)/);
        const tipsForSuccess = tipsMatch
          ? tipsMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => 
              line.replace(/^- /, '').trim()
            )
          : [
              "Visualize your goal regularly",
              "Celebrate small wins",
              "Stay consistent with savings",
              "Review and adjust monthly"
            ];
        
        setAiPlan({
          monthlySavingsTarget,
          recommendedActions,
          milestoneCheckpoints,
          tipsForSuccess,
          aiNote: response.goalContext ? "AI-generated plan based on your financial data" : "Basic plan generated"
        });
      } else {
        throw new Error('Failed to generate plan');
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      setAiPlan({
        monthlySavingsTarget: 12500,
        recommendedActions: [
          "Set up automatic transfers to a dedicated savings account",
          "Track your progress monthly",
          "Adjust spending in high-expense categories",
          "Consider side income opportunities"
        ],
        milestoneCheckpoints: [
          { percentage: 25, amount: 37500 },
          { percentage: 50, amount: 75000 },
          { percentage: 75, amount: 112500 },
          { percentage: 100, amount: 150000 }
        ],
        tipsForSuccess: [
          "Visualize your goal regularly",
          "Celebrate small wins",
          "Stay consistent with savings",
          "Review and adjust monthly"
        ],
        aiNote: "This is a basic plan. For personalized AI recommendations, please configure your OpenAI API key."
      });
    } finally {
      setPlanLoading(false);
    }
  };

  const insights = [
    {
      icon: "💰",
      title: "Reducing dining expenses by ₹1,200/month will help you reach your Vacation goal 1 month earlier",
      action: "Apply Now",
      color: "bg-blue-50"
    },
    {
      icon: "📈",
      title: "Consider investing in mutual funds for your Emergency Fund to earn better returns",
      action: "Apply Now",
      color: "bg-green-50"
    },
    {
      icon: "🎯",
      title: "Optimize your SIP investments to maximize your Retirement Fund growth",
      action: "Apply Now",
      color: "bg-yellow-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainDashboardNavbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="text-red-600">⚠️</div>
              <span className="text-red-800">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goals & Roadmap</h1>
            <p className="text-gray-600 mt-2">Track your financial goals and get AI-powered recommendations</p>
            {lastUpdate && (
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">
                  Last updated: {new Date(lastUpdate).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button 
              onClick={() => setShowAddGoalForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Goal</span>
            </button>
            {goals.length > 0 && (
              <button 
                onClick={handleDeleteAllGoals}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All Goals</span>
              </button>
            )}
            {lastUpdate && (
              <button
                onClick={refreshData}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                disabled={isRefreshing}
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
              </button>
            )}
            <button
              onClick={() => setShowSipModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <SIPIcon className="w-4 h-4" />
              <span>SIP Recommendations</span>
            </button>
          </div>
        </div>

        {/* Add Goal Form */}
        {showAddGoalForm && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Goal</h3>
              <button
                onClick={() => setShowAddGoalForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); addGoal(); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="e.g., Vacation Fund"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                  <input
                    type="number"
                    value={newGoal.amount}
                    onChange={(e) => setNewGoal({...newGoal, amount: e.target.value})}
                    placeholder="50000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Short-Term">Short-Term</option>
                    <option value="Long-Term">Long-Term</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.timeline}
                    onChange={(e) => setNewGoal({...newGoal, timeline: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGoalForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <div className="col-span-full text-center py-8">
              <div className="text-gray-500">Loading goals...</div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <div className="text-red-500">{error}</div>
            </div>
          ) : goals.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <div className="text-gray-500">No goals found. Create your first goal!</div>
            </div>
          ) : (
            goals.map((goal) => (
              <div key={goal._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{goal.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{goal.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{getGoalProgress(goal).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(getGoalProgress(goal), 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Timeline</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{getTimeLeft(goal)}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {getRecommendation(goal)}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleGeneratePlan(goal._id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Plan</span>
                  </button>
                  <button 
                    onClick={() => {
                      setEditGoal(goal);
                      setShowEditModal(true);
                    }}
                    className="text-gray-600 hover:bg-gray-100 py-2 px-3 rounded text-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteGoal(goal._id)}
                    className="text-red-600 hover:bg-red-50 py-2 px-3 rounded text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Goals Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Goals Progress Overview</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="80, 100"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-green-600"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="5, 100"
                  strokeDashoffset="-80"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-yellow-600"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-85"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            </div>
            <div className="ml-8 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-700">Completed</span>
                <span className="font-bold text-gray-900">1</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-700">In Progress</span>
                <span className="font-bold text-gray-900">4</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-700">Behind</span>
                <span className="font-bold text-gray-900">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Income-Based Savings Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">💰 Income-Based Savings Guide</h3>
            <div className="text-sm text-gray-500">
              Based on your current income
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Current Income Card */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900">Current Monthly Income</h4>
                  <p className="text-2xl font-bold text-blue-700">
                    ₹{savingsRecommendations.currentIncome.toLocaleString()}
                  </p>
                </div>
                <div className="text-blue-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Emergency Fund Card */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-red-900">Emergency Fund</h4>
                  <p className="text-lg font-bold text-red-700">
                    ₹{savingsRecommendations.recommendedSavings.emergency.toLocaleString()}
                  </p>
                  <p className="text-xs text-red-600">6 months of expenses</p>
                </div>
                <div className="text-red-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Retirement Savings Card */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-900">Retirement Savings</h4>
                  <p className="text-lg font-bold text-green-700">
                    ₹{savingsRecommendations.recommendedSavings.retirement.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600">15% of income</p>
                </div>
                <div className="text-green-600">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Targets Section */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-3">🎯 Monthly Savings Targets</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Minimum Savings */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-center">
                  <h5 className="font-medium text-gray-700">Minimum</h5>
                  <p className="text-xl font-bold text-orange-600">
                    ₹{savingsRecommendations.savingsTargets.minimum.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">10% of income</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '10%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Savings */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-center">
                  <h5 className="font-medium text-gray-700">Recommended</h5>
                  <p className="text-xl font-bold text-blue-600">
                    ₹{savingsRecommendations.savingsTargets.recommended.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">20% of income</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '20%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aggressive Savings */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-center">
                  <h5 className="font-medium text-gray-700">Aggressive</h5>
                  <p className="text-xl font-bold text-green-600">
                    ₹{savingsRecommendations.savingsTargets.aggressive.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">30% of income</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personalized Recommendations */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3">💡 Personalized Savings Advice</h4>
            <div className="space-y-2 text-sm text-blue-800">
              {monthlySavings.percentage < 10 && (
                <p>
                  <strong>Priority:</strong> Start with the minimum savings target of ₹{savingsRecommendations.savingsTargets.minimum.toLocaleString()} 
                  to build your emergency fund. Focus on reducing non-essential expenses.
                </p>
              )}
              {monthlySavings.percentage >= 10 && monthlySavings.percentage < 20 && (
                <p>
                  <strong>Next Step:</strong> Aim for the recommended savings target of ₹{savingsRecommendations.savingsTargets.recommended.toLocaleString()}. 
                  You're on the right track - consider automating your savings.
                </p>
              )}
              {monthlySavings.percentage >= 20 && (
                <p>
                  <strong>Excellent!</strong> You're saving {monthlySavings.percentage}% of your income. Consider the aggressive target 
                  of ₹{savingsRecommendations.savingsTargets.aggressive.toLocaleString()} for faster wealth building.
                </p>
              )}
              <p>
                <strong>Emergency Fund:</strong> Build up to ₹{savingsRecommendations.recommendedSavings.emergency.toLocaleString()} 
                for 6 months of expenses to handle unexpected situations.
              </p>
              <p>
                <strong>Retirement:</strong> Allocate ₹{savingsRecommendations.recommendedSavings.retirement.toLocaleString()} 
                monthly for long-term financial security.
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Savings Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Savings Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Month Savings */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
                <div className={`w-3 h-3 rounded-full ${
                  monthlySavings.trend === 'up' ? 'bg-green-500' :
                  monthlySavings.trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  monthlySavings.amount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{monthlySavings.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {monthlySavings.percentage}% of income
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {monthlySavings.trend === 'up' ? '↗️ Increasing' :
                   monthlySavings.trend === 'down' ? '↘️ Decreasing' : '→ Stable'}
                </div>
              </div>
            </div>

            {/* Last Month Comparison */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Last Month</h3>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  monthlySavings.lastMonth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{monthlySavings.lastMonth.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Comparison
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {monthlySavings.thisMonth > monthlySavings.lastMonth ? 
                    `+₹${(monthlySavings.thisMonth - monthlySavings.lastMonth).toLocaleString()}` :
                    `-₹${Math.abs(monthlySavings.thisMonth - monthlySavings.lastMonth).toLocaleString()}`
                  } vs last month
                </div>
              </div>
            </div>

            {/* Savings Rate */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Rate</h3>
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  monthlySavings.percentage >= 20 ? 'text-green-600' :
                  monthlySavings.percentage >= 10 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {monthlySavings.percentage}%
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  of monthly income
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {monthlySavings.percentage >= 20 ? '🎯 Excellent!' :
                   monthlySavings.percentage >= 10 ? '📈 Good' : '⚠️ Needs improvement'}
                </div>
              </div>
            </div>
          </div>

          {/* Savings Recommendations */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">💡 Savings Recommendations</h4>
            <div className="space-y-2">
              {monthlySavings.percentage < 10 && (
                <p className="text-sm text-gray-700">
                  <strong>Priority:</strong> Start with the minimum savings target of ₹{savingsRecommendations.savingsTargets.minimum.toLocaleString()} 
                  to build your emergency fund. Focus on reducing non-essential expenses.
                </p>
              )}
              {monthlySavings.percentage >= 10 && monthlySavings.percentage < 20 && (
                <p className="text-sm text-gray-700">
                  <strong>Next Step:</strong> Aim for the recommended savings target of ₹{savingsRecommendations.savingsTargets.recommended.toLocaleString()}. 
                  You're on the right track - consider automating your savings.
                </p>
              )}
              {monthlySavings.percentage >= 20 && (
                <p className="text-sm text-gray-700">
                  <strong>Excellent!</strong> You're saving {monthlySavings.percentage}% of your income. Consider the aggressive target 
                  of ₹{savingsRecommendations.savingsTargets.aggressive.toLocaleString()} for faster wealth building.
                </p>
              )}
              {monthlySavings.trend === 'down' && (
                <p className="text-sm text-gray-700">
                  <strong>Trend:</strong> Your savings decreased this month. Review your spending patterns 
                  and identify areas to cut back on expenses.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* AI Plan Modal */}
        {showPlanModal && selectedGoalForPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">AI Financial Plan</h3>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {planLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Generating your personalized plan...</div>
                </div>
              ) : aiPlan ? (
                <div className="space-y-6">
                  {/* Goal Info Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">🎯</div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{selectedGoalForPlan.title}</h4>
                        <p className="text-gray-600">Target: ₹{selectedGoalForPlan.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Savings Target */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Monthly Savings Target</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">₹{aiPlan.monthlySavingsTarget?.toLocaleString() || '12,500'}</div>
                        <div className="text-sm text-gray-600">Target per month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{(selectedGoalForPlan.progress || 0).toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">Current Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          ₹{((selectedGoalForPlan.amount - (selectedGoalForPlan.amount * (selectedGoalForPlan.progress || 0) / 100)) || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Remaining</div>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Actions */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h5>
                    <div className="space-y-3">
                      {aiPlan.recommendedActions?.map((action, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">
                            {index + 1}
                          </div>
                          <p className="text-gray-700">{action}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestone Checkpoints */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Milestone Checkpoints</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {aiPlan.milestoneCheckpoints?.map((milestone, index) => (
                        <div key={index} className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-blue-600 font-bold">{milestone.percentage}%</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">₹{milestone.amount.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips for Success */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-4">Tips for Success</h5>
                    <div className="space-y-2">
                      {aiPlan.tipsForSuccess?.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <p className="text-gray-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Note */}
                  {aiPlan.aiNote && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <p className="text-sm text-yellow-800">{aiPlan.aiNote}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">Failed to generate plan. Please try again.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI-Powered Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">AI-Powered Insights</h2>
          
          {/* AI Goal Suggestions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Goal Suggestions</h3>
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800 mb-3">
                {aiSuggestion || "Click 'Analyze Expenses' to get personalized goal suggestions based on your spending patterns."}
              </p>
              <button
                onClick={handleSuggestGoal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Analyze Expenses
              </button>
            </div>
          </div>

          {/* Conversational Goal Creation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversational Goal Creation</h3>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-800 mb-3">
                Simply describe your goal in natural language. For example: "Save ₹50000 for vacation in 6 months"
              </p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={conversationInput}
                  onChange={(e) => setConversationInput(e.target.value)}
                  placeholder="e.g., Save ₹50000 for vacation in 6 months"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-transparent text-0"
                />
                <button
                  onClick={handleConversationGoal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <div key={index} className={`${insight.color} p-4 rounded-lg border`}>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{insight.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-3">{insight.title}</p>
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                      {insight.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Analysis Banner */}
        {expenseAnalysis && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Expense Analysis</h3>
              <button
                onClick={() => setShowExpenseInsights(!showExpenseInsights)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showExpenseInsights ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Monthly Income</span>
                </div>
                <div className="text-xl font-bold text-gray-900">₹{expenseAnalysis.monthlyIncome.toLocaleString()}</div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-600">Monthly Expenses</span>
                </div>
                <div className="text-xl font-bold text-gray-900">₹{expenseAnalysis.monthlyExpenses.toLocaleString()}</div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Monthly Savings</span>
                </div>
                <div className={`text-xl font-bold ${expenseAnalysis.monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{expenseAnalysis.monthlySavings.toLocaleString()}
                </div>
              </div>
            </div>
            
            {showExpenseInsights && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Top Expense Categories (Last 3 Months)</h4>
                <div className="space-y-2">
                  {expenseAnalysis.topExpenses.map(([category, amount], index) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{category}</span>
                      <span className="text-sm font-medium text-gray-900">₹{amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Recommendation:</strong> Consider reducing expenses in high-spending categories to increase your monthly savings potential.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Goals</p>
                <p className="text-3xl font-bold text-gray-900">{goals.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Goal Amount</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{goals.reduce((sum, goal) => sum + goal.amount, 0).toLocaleString()}
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
                <p className="text-sm text-gray-600 mb-1">Goals On Track</p>
                <p className="text-3xl font-bold text-gray-900">
                  {goals.filter(goal => (goal.progress || 0) >= 50).length}/{goals.length}
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
                <p className="text-sm text-gray-600 mb-1">Monthly Savings</p>
                <p className={`text-3xl font-bold ${
                  monthlySavings.amount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{monthlySavings.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {monthlySavings.percentage}% of income
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-gray-600">Your goals define your path. Keep going — you're closer than you think!</p>
          <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700">Terms</a>
            <a href="#" className="hover:text-gray-700">Privacy</a>
            <a href="#" className="hover:text-gray-700">Help</a>
          </div>
        </div>
      </div>

      {/* SIP Recommendation Modal */}
      {showSipModal && (
        <SipRecommendation
          userProfile={{
            monthlyIncome: savingsRecommendations.currentIncome / 12,
            age: 30, // You can get this from user profile
            investmentExperience: 'moderate'
          }}
          onClose={() => setShowSipModal(false)}
        />
      )}
    </div>
  );
};

export default Goals;