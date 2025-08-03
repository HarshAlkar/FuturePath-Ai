import React, { useState, useEffect } from 'react';
import { BarChart3, Goal, DollarSign, FileText, Bell, User, Plus, Grid3X3, List, Eye, Edit3, Trash2, Sparkles, TrendingUp, Target, Calendar, Zap, Lightbulb, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import MainDashboardNavbar from './main_dashboard_navbar';
import goalService from '../services/goalService';
import transactionService from '../services/transactionService';

const Goals = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('progress');
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expenseAnalysis, setExpenseAnalysis] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    amount: '',
    type: 'Short-Term',
    timeline: '',
  });
  const [editGoal, setEditGoal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [conversationInput, setConversationInput] = useState('');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedGoalForPlan, setSelectedGoalForPlan] = useState(null);
  const [aiPlan, setAiPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [showExpenseInsights, setShowExpenseInsights] = useState(false);
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
      try {
        const data = await goalService.getGoals();
        setGoals(data);
        await analyzeExpenses();
      } catch (err) {
        setGoals([]);
      }
      setLoading(false);
    };
    fetchGoals();
  }, []);

  const analyzeExpenses = async () => {
    try {
      const transactions = await transactionService.getTransactions();
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Calculate monthly averages based on transaction dates
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      
      const recentTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= threeMonthsAgo;
      });

      const recentExpenses = recentTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const recentIncome = recentTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Calculate monthly averages (3 months of data)
      const monthlyExpenses = recentExpenses / 3;
      const monthlyIncome = recentIncome / 3;
      const monthlySavings = monthlyIncome - monthlyExpenses;

      const categoryBreakdown = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
          return acc;
        }, {});

      const topExpenses = Object.entries(categoryBreakdown)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3);

      setExpenseAnalysis({
        totalExpenses,
        totalIncome,
        monthlyExpenses,
        monthlyIncome,
        monthlySavings: Math.max(0, monthlySavings), // Ensure positive value
        topExpenses,
        transactionCount: transactions.length,
        recentTransactionCount: recentTransactions.length
      });
    } catch (error) {
      console.error('Error analyzing expenses:', error);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.amount || !newGoal.timeline) {
      alert('Please fill all fields');
      return;
    }

    // Show expense insights before adding goal
    setShowExpenseInsights(true);
    
    try {
      await goalService.createGoal({
        ...newGoal,
        amount: Number(newGoal.amount),
        progress: 0,
        icon: '',
        color: '',
        progressColor: '',
        recommendation: '',
      });
      setNewGoal({ title: '', amount: '', type: 'Short-Term', timeline: '' });
      // Hide the form after successful addition
      setShowAddGoalForm(false);
      // Refresh goals
      const data = await goalService.getGoals();
      setGoals(data);
      await analyzeExpenses();
    } catch (err) {
      alert('Failed to add goal');
    }
  };

  // Add, update, delete handlers can be implemented here using goalService
  const handleEditGoal = (goal) => {
    setEditGoal(goal);
    setShowEditModal(true);
  };
  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    try {
      await goalService.updateGoal(editGoal._id, editGoal);
      setShowEditModal(false);
      setEditGoal(null);
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (err) {
      alert('Failed to update goal');
    }
  };
  const handleDeleteGoal = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await goalService.deleteGoal(id);
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (err) {
      alert('Failed to delete goal');
    }
  };

  // AI Suggestion: Recommend a goal based on transaction data
  const handleSuggestGoal = async () => {
    const txs = await transactionService.getTransactions();
    // Simple rule: if food/restaurant spending > 10% of total, suggest 'Reduce food delivery'
    const total = txs.reduce((sum, t) => sum + Number(t.amount), 0);
    const food = txs.filter(t => ['Groceries', 'Food', 'Restaurant'].includes(t.category)).reduce((sum, t) => sum + Number(t.amount), 0);
    if (food > 0.1 * total) {
      setAiSuggestion('Your food-related expenses are high. Consider a goal to reduce food delivery by 10% and save more!');
    } else {
      setAiSuggestion('You are on track! Consider setting a new goal for vacation or emergency fund.');
    }
  };

  // Conversational input for goal creation (simple parse)
  const handleConversationGoal = async (e) => {
    e.preventDefault();
    // Example: "Save 100000 for new car by 2026"
    const match = conversationInput.match(/save (\d+) for (.+) by (.+)/i);
    if (match) {
      const amount = match[1];
      const title = match[2];
      const timeline = match[3];
      await goalService.createGoal({ title, amount: Number(amount), type: 'Long-Term', timeline, progress: 0 });
      setConversationInput('');
      const data = await goalService.getGoals();
      setGoals(data);
    } else {
      alert('Try: Save 100000 for new car by 2026');
    }
  };

  // Refactored: Generate a dynamic, data-driven plan for the selected goal
  const handleGeneratePlan = async (goal) => {
    setSelectedGoalForPlan(goal);
    setShowPlanModal(true);
    setPlanLoading(true);
    setAiPlan(null);

    // Wait a moment for UI feedback
    setTimeout(() => {
      if (!expenseAnalysis) {
        setAiPlan({
          error: 'No financial data available to generate a plan.'
        });
        setPlanLoading(false);
        return;
      }

      // Parse goal timeline (try to extract year or months)
      let months = 12; // default 1 year
      const timeline = goal.timeline || '';
      const yearMatch = timeline.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        const now = new Date();
        const targetYear = parseInt(yearMatch[1], 10);
        months = Math.max(1, (targetYear - now.getFullYear()) * 12 + (11 - now.getMonth()));
      } else {
        // Try to extract months from text (e.g., '18 months')
        const monthMatch = timeline.match(/(\d+)\s*months?/i);
        if (monthMatch) months = parseInt(monthMatch[1], 10);
      }

      const targetAmount = Number(goal.amount);
      const progress = Number(goal.progress) || 0;
      const alreadySaved = (progress / 100) * targetAmount;
      const remainingAmount = targetAmount - alreadySaved;
      const requiredMonthly = Math.ceil(remainingAmount / months);
      const actualMonthly = Math.floor(expenseAnalysis.monthlySavings);
      const gap = requiredMonthly - actualMonthly;
      const topExpenses = expenseAnalysis.topExpenses || [];
      const monthlyIncome = expenseAnalysis.monthlyIncome || 0;
      const monthlyExpenses = expenseAnalysis.monthlyExpenses || 0;

      // Build plan steps
      let steps = [];
      let summary = '';
      let suggestions = [];
      let feasible = true;

      if (gap <= 0) {
        summary = `You are on track! You need to save ₹${requiredMonthly.toLocaleString()} per month, and your current monthly savings is ₹${actualMonthly.toLocaleString()}.`;
        suggestions.push('Consider investing your savings in a recurring deposit or mutual fund for better returns.');
        suggestions.push('Maintain your current savings rate, and review your progress monthly.');
      } else {
        summary = `To reach your goal, you need to save ₹${requiredMonthly.toLocaleString()} per month, but your current monthly savings is ₹${actualMonthly.toLocaleString()}. You have a gap of ₹${gap.toLocaleString()} per month.`;
        // Suggest reductions in top expense categories
        let reduced = 0;
        for (let [cat, amt] of topExpenses) {
          if (reduced >= gap) break;
          const suggestionAmt = Math.min(gap - reduced, Math.ceil(amt * 0.2)); // suggest up to 20% cut
          if (suggestionAmt > 0) {
            suggestions.push(`Reduce your spending on ${cat} by ₹${suggestionAmt.toLocaleString()} per month.`);
            reduced += suggestionAmt;
          }
        }
        if (reduced < gap) {
          suggestions.push('Consider increasing your income (side gig, freelancing, etc.) or extending your goal timeline.');
          feasible = false;
        } else {
          suggestions.push('Set up an automatic transfer of the required amount to a dedicated savings account.');
        }
      }

      // Milestones
      const milestones = [25, 50, 75, 100].map(percent => ({
        percent,
        amount: Math.round(targetAmount * percent / 100)
      }));

      setAiPlan({
        summary,
        requiredMonthly,
        actualMonthly,
        gap,
        suggestions,
        milestones,
        alreadySaved,
        remainingAmount,
        months,
        feasible
      });
      setPlanLoading(false);
    }, 800);
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
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="relative">
            <h1 className="text-4xl font-bold text-gray-900">
              Goals & Roadmap
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Track your financial goals and get AI-powered recommendations</p>
            <div className="absolute -top-2 -right-2">
              <div className="animate-pulse">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowAddGoalForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 mt-4 sm:mt-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Create New Goal</span>
          </button>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Goals</p>
                <p className="text-3xl font-bold text-gray-900">{goals.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Goal Amount</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{goals.reduce((sum, goal) => sum + Number(goal.amount), 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monthly Savings</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{expenseAnalysis?.monthlySavings?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Goals On Track</p>
                <p className="text-3xl font-bold text-gray-900">
                  {goals.filter(g => (g.progress || 0) > 25).length}/{goals.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Expense Analysis Banner */}
        {expenseAnalysis && (
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Financial Insights</h3>
                  <p className="text-gray-600">Based on your transaction history</p>
                </div>
              </div>
              <button 
                onClick={() => setShowExpenseInsights(!showExpenseInsights)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
              >
                {showExpenseInsights ? 'Hide' : 'View'} Details
              </button>
            </div>
            
            {showExpenseInsights && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold mb-2 text-gray-900">Top Expenses</h4>
                  {expenseAnalysis.topExpenses.map(([category, amount], index) => (
                    <div key={category} className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">{category}</span>
                      <span className="font-semibold text-gray-900">₹{amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold mb-2 text-gray-900">Savings Potential</h4>
                  <div className="text-3xl font-bold mb-2 text-blue-600">₹{(expenseAnalysis.monthlyIncome * 0.2).toLocaleString()}</div>
                  <p className="text-gray-600 text-sm">20% of income for goals</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold mb-2 text-gray-900">Recommendation</h4>
                  <p className="text-gray-700 text-sm">
                    {expenseAnalysis.monthlySavings > 0 
                      ? `Great! You can save ₹${expenseAnalysis.monthlySavings.toLocaleString()}/month`
                      : 'Consider reducing expenses to increase savings'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300">All Goals</button>
                <button className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm transition-all duration-300">Short-Term</button>
                <button className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm transition-all duration-300">Long-Term</button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="progress">Progress</option>
                <option value="amount">Amount</option>
                <option value="timeline">Timeline</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Add New Goal Form */}
        {showAddGoalForm && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 mb-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Create New Goal</h3>
            </div>
            <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Goal Title (e.g., New Car)"
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={newGoal.title}
                onChange={e => setNewGoal(g => ({ ...g, title: e.target.value }))}
                required
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={newGoal.amount}
                onChange={e => setNewGoal(g => ({ ...g, amount: e.target.value }))}
                required
              />
              <select
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={newGoal.type}
                onChange={e => setNewGoal(g => ({ ...g, type: e.target.value }))}
                required
              >
                <option value="Short-Term">Short-Term</option>
                <option value="Long-Term">Long-Term</option>
              </select>
              <input
                type="text"
                placeholder="Timeline (e.g., 2025 Target)"
                className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={newGoal.timeline}
                onChange={e => setNewGoal(g => ({ ...g, timeline: e.target.value }))}
                required
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Add Goal
              </button>
            </form>
            <button 
              onClick={() => setShowAddGoalForm(false)}
              className="mt-4 text-gray-600 hover:text-gray-800 text-sm"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Enhanced Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {goals.map((goal) => (
            <div key={goal._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{goal.title}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{goal.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-xl">₹{Number(goal.amount).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">{goal.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Timeline</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{goal.timeLeft || goal.timeline}</p>
              </div>
              
              {goal.recommendation && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Recommendation</span>
                  </div>
                  <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    {goal.recommendation}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleGeneratePlan(goal)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>View Plan by AI</span>
                </button>
                <button onClick={() => handleEditGoal(goal)} className="text-gray-600 hover:bg-gray-100 py-3 px-4 rounded-xl text-sm transition-all duration-300">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteGoal(goal._id)} className="text-red-600 hover:text-red-800 hover:bg-red-50 py-3 px-4 rounded-xl text-sm transition-all duration-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Goals Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Goals Progress Overview</h2>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
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
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{goals.length}</div>
                  <div className="text-sm text-gray-600">Total Goals</div>
                </div>
              </div>
            </div>
            <div className="ml-12 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-gray-700 font-medium">Completed</span>
                <span className="font-bold text-gray-900 text-lg">{goals.filter(g => (g.progress || 0) >= 100).length}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-gray-700 font-medium">In Progress</span>
                <span className="font-bold text-gray-900 text-lg">{goals.filter(g => (g.progress || 0) > 0 && (g.progress || 0) < 100).length}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-gray-700 font-medium">Not Started</span>
                <span className="font-bold text-gray-900 text-lg">{goals.filter(g => (g.progress || 0) === 0).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced AI-Powered Insights */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">AI-Powered Insights</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{insight.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">{insight.title}</p>
                    <button className="text-blue-600 text-sm font-medium hover:underline flex items-center space-x-1">
                      <span>{insight.action}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced AI Features */}
        <div className="space-y-6 mb-8">
          <button onClick={handleSuggestGoal} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3">
            <Sparkles className="w-6 h-6" />
            <span>Get AI Goal Suggestions</span>
          </button>
          {aiSuggestion && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-2xl">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">AI Suggestion</h4>
                  <p className="text-blue-700">{aiSuggestion}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Conversational Goal Creation</h3>
            </div>
            <form onSubmit={handleConversationGoal} className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="e.g. Save 100000 for new car by 2026"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                value={conversationInput}
                onChange={e => setConversationInput(e.target.value)}
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Add by Conversation
              </button>
            </form>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">Your Journey to Financial Success</h3>
            </div>
            <p className="text-gray-600 text-lg mb-6">Your goals define your path. Keep going — you're closer than you think!</p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700 transition-colors duration-300">Terms</a>
              <a href="#" className="hover:text-gray-700 transition-colors duration-300">Privacy</a>
              <a href="#" className="hover:text-gray-700 transition-colors duration-300">Help</a>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Edit Modal */}
      {showEditModal && editGoal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Edit3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Edit Goal</h2>
            </div>
            <form onSubmit={handleUpdateGoal} className="space-y-4">
              <input type="text" className="border w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" value={editGoal.title} onChange={e => setEditGoal(g => ({ ...g, title: e.target.value }))} />
              <input type="number" className="border w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" value={editGoal.amount} onChange={e => setEditGoal(g => ({ ...g, amount: e.target.value }))} />
              <select className="border w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" value={editGoal.type} onChange={e => setEditGoal(g => ({ ...g, type: e.target.value }))}>
                <option value="Short-Term">Short-Term</option>
                <option value="Long-Term">Long-Term</option>
              </select>
              <input type="text" className="border w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" value={editGoal.timeline} onChange={e => setEditGoal(g => ({ ...g, timeline: e.target.value }))} />
              <input type="number" className="border w-full rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" value={editGoal.progress} onChange={e => setEditGoal(g => ({ ...g, progress: e.target.value }))} />
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">Save</button>
                <button type="button" className="flex-1 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-300" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced AI Plan Modal */}
      {showPlanModal && selectedGoalForPlan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI-Powered Financial Plan</h2>
                  <p className="text-gray-600">Personalized strategy for: {selectedGoalForPlan.title}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPlanModal(false);
                  setSelectedGoalForPlan(null);
                  setAiPlan(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none transition-colors duration-300"
              >
                ×
              </button>
            </div>

            {planLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-lg text-gray-600">Generating your personalized plan...</span>
                </div>
              </div>
            ) : aiPlan && !aiPlan.error ? (
              <div className="space-y-6">
                {/* Enhanced Goal Summary */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Target Amount</p>
                      <p className="text-lg font-bold text-gray-900">₹{selectedGoalForPlan.amount.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Current Progress</p>
                      <p className="text-lg font-bold text-green-600">{selectedGoalForPlan.progress || 0}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Timeline</p>
                      <p className="text-lg font-bold text-gray-900">{selectedGoalForPlan.timeline}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Type</p>
                      <p className="text-lg font-bold text-gray-900">{selectedGoalForPlan.type}</p>
                    </div>
                  </div>
                </div>

                {/* Dynamic AI Generated Plan */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Personalized Plan</h3>
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200">
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                            <Target className="w-8 h-8 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Goal Plan</h2>
                          <p className="text-lg text-blue-600 font-semibold">{selectedGoalForPlan.title}</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Monthly Savings Target</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">Required</p>
                              <p className="text-xl font-bold text-green-600">₹{aiPlan.requiredMonthly.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">per month</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">Current</p>
                              <p className="text-xl font-bold text-blue-600">₹{aiPlan.actualMonthly.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">per month</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600 mb-1">Gap</p>
                              <p className={`text-xl font-bold ${aiPlan.gap > 0 ? 'text-orange-600' : 'text-green-600'}`}>₹{aiPlan.gap > 0 ? aiPlan.gap.toLocaleString() : '0'}</p>
                              <p className="text-xs text-gray-500">per month</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Lightbulb className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Recommended Actions</h3>
                          </div>
                          <div className="space-y-3">
                            {aiPlan.suggestions.map((action, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                  <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed">{action}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <BarChart3 className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Milestone Checkpoints</h3>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {aiPlan.milestones.map((milestone, index) => (
                              <div key={milestone.percent} className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 bg-blue-50">
                                  <span className="text-sm font-bold">{milestone.percent}%</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">complete</p>
                                <p className="text-lg font-bold text-gray-900">₹{milestone.amount.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-start space-x-3">
                            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-blue-800 font-medium">AI-Powered Recommendation</p>
                              <p className="text-xs text-blue-600 mt-1">
                                {aiPlan.feasible
                                  ? 'This plan is achievable based on your current finances. Stay consistent and review monthly.'
                                  : 'This plan may not be feasible without changes. Consider reducing expenses, increasing income, or extending your timeline.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowPlanModal(false);
                      setSelectedGoalForPlan(null);
                      setAiPlan(null);
                    }}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all duration-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Goal: ${selectedGoalForPlan.title}\nTarget: ₹${selectedGoalForPlan.amount.toLocaleString()}\nTimeline: ${selectedGoalForPlan.timeline}\nRequired Monthly: ₹${aiPlan.requiredMonthly.toLocaleString()}\nCurrent Monthly: ₹${aiPlan.actualMonthly.toLocaleString()}\nGap: ₹${aiPlan.gap > 0 ? aiPlan.gap.toLocaleString() : '0'}\n\nPlan Steps:\n${aiPlan.suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
                      );
                      alert('Plan copied to clipboard!');
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Copy Plan
                  </button>
                </div>
              </div>
            ) : aiPlan && aiPlan.error ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">{aiPlan.error}</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">Failed to generate plan. Please try again.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;