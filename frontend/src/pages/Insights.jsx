import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Lightbulb, Target, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Sparkles, Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import MainDashboardNavbar from './main_dashboard_navbar';
import transactionService from '../services/transactionService';
import goalService from '../services/goalService';
import sharedDataService from '../services/sharedDataService';

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
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [showAiModal, setShowAiModal] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize shared data service
  useEffect(() => {
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
      sharedDataService.on('transactionAdded', handleTransactionAdded);
      
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
    console.log('Insights: Data updated from shared service:', data);
    setTransactions(data.transactions || []);
    setGoals(data.goals || []);
    setMetrics(data.metrics || {});
    setLastUpdate(data.lastUpdate);
    
    // Calculate insights and trends with new data
    // Use the metrics from shared service instead of recalculating
    const { transactions: transactionsData, goals: goalsData, metrics: sharedMetrics } = data;
    
    // Update local metrics state
    setMetrics(sharedMetrics);
    
    // Generate basic insights using shared metrics
    generateBasicInsightsFromSharedData(transactionsData, goalsData, sharedMetrics);
    
    // Calculate trends
    calculateTrends(transactionsData);
  };

  const handleError = (error) => {
    console.error('Insights: Error from shared service:', error);
    setError('Failed to load data. Please try again.');
  };

  const handleGoalAdded = (goalData) => {
    console.log('Insights: Goal added:', goalData);
    setError(null);
  };

  const handleGoalUpdated = ({ id, goalData }) => {
    console.log('Insights: Goal updated:', { id, goalData });
    setError(null);
  };

  const handleGoalDeleted = (id) => {
    console.log('Insights: Goal deleted:', id);
    setError(null);
  };

  const handleTransactionAdded = (transactionData) => {
    console.log('Insights: Transaction added:', transactionData);
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
    
    // Generate basic insights with calculated metrics
    generateBasicInsights(transactionsData, goalsData, totalSpending, totalIncome, savingsRate, budgetUtilization);
    
    // Calculate trends
    calculateTrends(transactionsData);
  };

  const generateBasicInsights = (transactionsData, goalsData, totalSpending, totalIncome, savingsRate, budgetUtilization) => {
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

  const generateBasicInsightsFromSharedData = (transactionsData, goalsData, sharedMetrics) => {
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
    if (sharedMetrics.savingsRate < 20) {
      const potentialSavings = sharedMetrics.totalSpending * 0.15;
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
    if (sharedMetrics.budgetUtilization > 80) {
      newInsights.push({
        id: 4,
        title: "Budget Alert",
        description: `You've spent ${Math.round(sharedMetrics.budgetUtilization)}% of your monthly budget`,
        type: "alert",
        icon: "⚠️",
        change: `${Math.round(sharedMetrics.budgetUtilization)}%`,
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

  const generateAIInsights = async () => {
    setAiGenerating(true);
    setShowAiModal(true);
    setError(null);
    
    try {
      console.log('Generating AI insights with real-time data...');
      
      // Get current data from shared service
      const insightsData = sharedDataService.getInsightsData();
      console.log('Current insights data:', insightsData);
      
      // Prepare data for AI analysis
      const analysisData = {
        transactions: insightsData.transactions,
        goals: insightsData.goals,
        metrics: insightsData.metrics,
        period: activePeriod,
        totalSpending: insightsData.metrics.totalSpending,
        savingsRate: insightsData.metrics.savingsRate,
        budgetUtilization: insightsData.metrics.budgetUtilization,
        lastUpdate: insightsData.lastUpdate
      };

      console.log('Analysis data prepared:', analysisData);

      // Simulate AI processing time with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Generate AI insights based on real-time data
      const generatedInsights = generateAdvancedInsights(analysisData);
      console.log('Generated AI insights:', generatedInsights);
      
      setAiInsights(generatedInsights);
      
    } catch (error) {
      console.error('Error generating AI insights:', error);
      setError('Failed to generate AI insights. Please try again.');
      // Fallback to basic insights
      const fallbackInsights = generateFallbackInsights();
      console.log('Using fallback insights:', fallbackInsights);
      setAiInsights(fallbackInsights);
    } finally {
      setAiGenerating(false);
    }
  };

  const generateAdvancedInsights = (data) => {
    const insights = [];
    
    console.log('Generating advanced AI insights with spending data:', data);
    
    // Calculate spending patterns and categories
    const spendingByCategory = data.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const category = t.category || 'Other';
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0, transactions: [] };
        }
        acc[category].total += Number(t.amount);
        acc[category].count += 1;
        acc[category].transactions.push(t);
        return acc;
      }, {});

    const totalSpending = data.metrics.totalSpending;
    const totalIncome = data.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    console.log('Spending analysis:', { spendingByCategory, totalSpending, totalIncome });

    // 1. Top Spending Category Analysis
    const sortedCategories = Object.entries(spendingByCategory)
      .sort(([,a], [,b]) => b.total - a.total);

    if (sortedCategories.length > 0) {
      const topCategory = sortedCategories[0];
      const topCategoryName = topCategory[0];
      const topCategoryAmount = topCategory[1].total;
      const topCategoryPercentage = (topCategoryAmount / totalSpending) * 100;

      insights.push({
        id: 1,
        title: "Spending Pattern Analysis",
        description: `Your highest spending category is ${topCategoryName} (₹${topCategoryAmount.toLocaleString()}), accounting for ${Math.round(topCategoryPercentage)}% of your total expenses.`,
        type: "analysis",
        icon: "📊",
        priority: "high",
        action: "View Details",
        impact: `₹${Math.round(topCategoryAmount * 0.15).toLocaleString()} potential savings`,
        onAction: () => handleViewDetails(topCategoryName)
      });
    }

    // 2. Spending vs Income Analysis
    if (totalIncome > 0) {
      const spendingRatio = (totalSpending / totalIncome) * 100;
      const savingsRate = data.metrics.savingsRate;

      if (spendingRatio > 80) {
        insights.push({
          id: 2,
          title: "High Spending Alert",
          description: `You're spending ${Math.round(spendingRatio)}% of your income. Your savings rate is ${savingsRate}%. Consider reducing expenses to increase savings.`,
          type: "alert",
          icon: "⚠️",
          priority: "high",
          action: "Create Budget Plan",
          impact: `Increase savings by ₹${Math.round(totalIncome * 0.2).toLocaleString()}/month`,
          onAction: () => handleCreateBudgetPlan()
        });
      } else if (spendingRatio < 60) {
        insights.push({
          id: 2,
          title: "Excellent Spending Control",
          description: `Great job! You're spending only ${Math.round(spendingRatio)}% of your income with a ${savingsRate}% savings rate. Keep up the good financial habits!`,
          type: "success",
          icon: "✅",
          priority: "medium",
          action: "View Progress",
          impact: "Maintain current rate",
          onAction: () => handleViewProgress()
        });
      }
    }

    // 3. Category-Specific Insights
    if (spendingByCategory['Food'] && spendingByCategory['Food'].total > totalSpending * 0.3) {
      insights.push({
        id: 3,
        title: "Food Spending Optimization",
        description: `You're spending ₹${spendingByCategory['Food'].total.toLocaleString()} on food (${Math.round((spendingByCategory['Food'].total / totalSpending) * 100)}% of total). Consider meal planning to reduce costs.`,
        type: "optimization",
        icon: "🍽️",
        priority: "medium",
        action: "Meal Planning Tips",
        impact: "Save ₹2,000-5,000/month",
        onAction: () => handleMealPlanningTips()
      });
    }

    if (spendingByCategory['Transport'] && spendingByCategory['Transport'].total > totalSpending * 0.25) {
      insights.push({
        id: 4,
        title: "Transport Cost Analysis",
        description: `Transport costs ₹${spendingByCategory['Transport'].total.toLocaleString()} (${Math.round((spendingByCategory['Transport'].total / totalSpending) * 100)}% of spending). Consider carpooling or public transport.`,
        type: "optimization",
        icon: "🚗",
        priority: "medium",
        action: "Transport Alternatives",
        impact: "Save ₹1,500-3,000/month",
        onAction: () => handleTransportAlternatives()
      });
    }

    // 4. Monthly Spending Trends
    const monthlySpending = data.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const month = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + Number(t.amount);
        return acc;
      }, {});

    const monthlySpendingArray = Object.entries(monthlySpending).sort();
    if (monthlySpendingArray.length >= 2) {
      const currentMonth = monthlySpendingArray[monthlySpendingArray.length - 1][1];
      const previousMonth = monthlySpendingArray[monthlySpendingArray.length - 2][1];
      const spendingChange = ((currentMonth - previousMonth) / previousMonth) * 100;

      if (spendingChange > 15) {
        insights.push({
          id: 5,
          title: "Spending Trend Alert",
          description: `Your spending increased by ${Math.abs(Math.round(spendingChange))}% this month (₹${currentMonth.toLocaleString()} vs ₹${previousMonth.toLocaleString()}). Review your recent expenses.`,
          type: "trend",
          icon: "📈",
          priority: "high",
          action: "Review Expenses",
          impact: "Identify overspending",
          onAction: () => handleReviewExpenses()
        });
      } else if (spendingChange < -10) {
        insights.push({
          id: 5,
          title: "Great Spending Control",
          description: `Excellent! Your spending decreased by ${Math.abs(Math.round(spendingChange))}% this month. You saved ₹${(previousMonth - currentMonth).toLocaleString()} compared to last month.`,
          type: "success",
          icon: "📉",
          priority: "medium",
          action: "View Savings",
          impact: "Maintain momentum",
          onAction: () => handleViewSavings()
        });
      }
    }

    // 5. Budget Utilization Analysis
    const budgetUtilization = data.metrics.budgetUtilization;
    if (budgetUtilization > 90) {
      insights.push({
        id: 6,
        title: "Budget Exceeded",
        description: `You've used ${budgetUtilization}% of your budget. You're ₹${Math.round(totalSpending * 0.1).toLocaleString()} over your recommended spending limit.`,
        type: "alert",
        icon: "🚨",
        priority: "high",
        action: "Emergency Budget",
        impact: "Reduce by ₹5,000-10,000",
        onAction: () => handleEmergencyBudget()
      });
    } else if (budgetUtilization < 70) {
      insights.push({
        id: 6,
        title: "Budget Management",
        description: `Great budget control! You've used only ${budgetUtilization}% of your budget. You have ₹${Math.round(totalSpending * 0.3).toLocaleString()} available for additional expenses.`,
        type: "info",
        icon: "📋",
        priority: "medium",
        action: "Optimize Budget",
        impact: "Increase savings",
        onAction: () => handleOptimizeBudget()
      });
    }

    // 6. Savings Opportunity Analysis
    const potentialSavings = totalSpending * 0.15; // 15% potential savings
    if (potentialSavings > 5000) {
      insights.push({
        id: 7,
        title: "Savings Opportunity",
        description: `You can potentially save ₹${Math.round(potentialSavings).toLocaleString()} monthly by optimizing your spending patterns. Focus on your top 3 spending categories.`,
        type: "opportunity",
        icon: "💰",
        priority: "high",
        action: "Create Savings Goal",
        impact: `+₹${Math.round(potentialSavings).toLocaleString()}/month`,
        onAction: () => handleCreateSavingsGoal()
      });
    }

    // 7. Investment Recommendations based on spending
    const investmentGoals = data.goals.filter(g => g.category === 'investment');
    const totalInvestmentProgress = investmentGoals.reduce((sum, g) => sum + Number(g.progress || 0), 0);
    
    if (investmentGoals.length === 0 && totalSpending > 50000) {
      insights.push({
        id: 8,
        title: "Investment Opportunity",
        description: `With your current spending of ₹${totalSpending.toLocaleString()}, consider investing ₹${Math.round(totalSpending * 0.1).toLocaleString()} monthly for long-term wealth building.`,
        type: "investment",
        icon: "📈",
        priority: "medium",
        action: "Start Investing",
        impact: "12-15% annual returns",
        onAction: () => handleStartInvesting()
      });
    }

    // 8. Emergency Fund Analysis
    const emergencyFundGoals = data.goals.filter(g => g.title.toLowerCase().includes('emergency'));
    const monthlyExpenses = totalSpending;
    const recommendedEmergencyFund = monthlyExpenses * 6; // 6 months of expenses

    if (emergencyFundGoals.length === 0) {
      insights.push({
        id: 9,
        title: "Emergency Fund Missing",
        description: `Based on your monthly spending of ₹${monthlyExpenses.toLocaleString()}, you need ₹${recommendedEmergencyFund.toLocaleString()} emergency fund. Start with ₹${Math.round(monthlyExpenses * 0.2).toLocaleString()}/month.`,
        type: "security",
        icon: "🛡️",
        priority: "high",
        action: "Create Emergency Fund",
        impact: "6 months expenses",
        onAction: () => handleCreateEmergencyFund()
      });
    }

    // If no insights were generated, provide basic guidance
    if (insights.length === 0) {
      insights.push({
        id: 1,
        title: "Start Tracking Expenses",
        description: "Add your first transaction to get personalized spending insights and AI recommendations based on your financial behavior.",
        type: "welcome",
        icon: "👋",
        priority: "medium",
        action: "Add Transaction",
        impact: "Better insights",
        onAction: () => handleAddTransactions()
      });
    }

    console.log('Generated AI insights based on spending data:', insights);
    return insights;
  };

  const generateFallbackInsights = () => {
    return [
      {
        id: 1,
        title: "Basic Financial Health",
        description: "Your financial data shows a healthy spending pattern. Continue monitoring your expenses.",
        type: "health",
        icon: "✅",
        priority: "medium",
        action: "Continue Monitoring",
        impact: "Maintain current",
        onAction: () => handleContinueMonitoring()
      },
      {
        id: 2,
        title: "Savings Enhancement",
        description: "Consider increasing your savings rate to 20% for better financial security.",
        type: "savings",
        icon: "💰",
        priority: "medium",
        action: "Set Savings Goal",
        impact: "+5% savings rate",
        onAction: () => handleSetSavingsGoal()
      }
    ];
  };

  // Action handlers for insights
  const handleViewDetails = (category) => {
    alert(`Opening detailed analysis for ${category} spending. This would show a detailed breakdown of your expenses in this category.`);
  };

  const handleAddTransactions = () => {
    alert('Redirecting to Expense Tracker to add transactions. This will help generate better insights.');
  };

  const handleContinueMonitoring = () => {
    alert('Great! Keep monitoring your expenses regularly for better financial health.');
  };

  const handleSetSavingsGoal = () => {
    alert('Redirecting to Goals page to set up a savings goal. This will help you track your savings progress.');
  };

  const handleCreateSavingsGoal = () => {
    alert('Creating a savings goal for you. This will help you track your monthly savings target.');
  };

  const handleCreateInvestmentGoal = () => {
    alert('Setting up an investment goal. This will help you plan for long-term financial growth.');
  };

  const handleReviewBudget = () => {
    alert('Opening budget review. This will help you identify areas to reduce expenses.');
  };

  const handleCreateEmergencyFund = () => {
    alert('Creating an emergency fund goal. This will help you build financial security.');
  };

  const handleCreateDebtPlan = () => {
    alert('Creating a debt repayment plan. This will help you manage and reduce your debt effectively.');
  };

  const handleViewProgress = () => {
    alert('Opening your progress dashboard to view your savings achievements.');
  };

  const handleIncreaseContributions = () => {
    alert('Opening investment settings to increase your monthly contributions.');
  };

  const handleMonitorSpending = () => {
    alert('Opening spending tracker to monitor your expenses more closely.');
  };

  const handleExploreOpportunities = () => {
    alert('Opening career development resources to explore income enhancement opportunities.');
  };

  const handleCreateBudgetPlan = () => {
    alert('Creating a budget plan to help you manage your spending and save more.');
  };

  const handleMealPlanningTips = () => {
    alert('Opening meal planning resources to help you reduce food expenses.');
  };

  const handleTransportAlternatives = () => {
    alert('Opening transport alternatives resources to help you save on transportation costs.');
  };

  const handleReviewExpenses = () => {
    alert('Opening your expense tracker to review recent spending patterns.');
  };

  const handleViewSavings = () => {
    alert('Opening your progress dashboard to view your savings achievements.');
  };

  const handleEmergencyBudget = () => {
    alert('Creating an emergency budget plan to help you manage unexpected expenses.');
  };

  const handleOptimizeBudget = () => {
    alert('Creating a budget optimization plan to help you increase savings.');
  };

  const handleStartInvesting = () => {
    alert('Redirecting to Investment Tracker to start investing.');
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
            {lastUpdate && (
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">
                  Last updated: {new Date(lastUpdate).toLocaleTimeString()}
                </span>
              </div>
            )}
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
            <button 
              onClick={generateAIInsights}
              disabled={aiGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
            >
              {aiGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Insights</span>
                </>
              )}
            </button>
            <button 
              onClick={() => {
                console.log('Starting demo mode with real data...');
                setError(null);
                // Use current real data for demo
                const currentData = sharedDataService.getInsightsData();
                console.log('Demo mode using current data:', currentData);
                
                // Show success message
                setError('Demo mode activated! Using real-time data for AI insights.');
                setTimeout(() => setError(null), 3000);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Demo Mode
            </button>
            {lastUpdate && (
              <button
                onClick={refreshData}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

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
              <button 
                onClick={() => alert('Applying budget optimization recommendations. This will help you stay within your budget limits.')}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
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
              <button 
                onClick={() => alert('Applying investment boost recommendations. This will help you increase your investment portfolio for better returns.')}
                className="text-green-600 text-sm font-medium hover:underline"
              >
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
              <button 
                onClick={() => alert('Setting up automatic transfers for smart savings. This will help you save consistently without thinking about it.')}
                className="text-purple-600 text-sm font-medium hover:underline"
              >
                Apply Recommendation
              </button>
            </div>
          </div>
        </div>

        {/* AI Insights Modal */}
        {showAiModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>AI-Powered Financial Insights</span>
                </h3>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {aiGenerating ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">AI is analyzing your financial data...</h4>
                  <p className="text-gray-600">This may take a few moments to generate personalized insights.</p>
                </div>
              ) : aiInsights.length > 0 ? (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Analysis Summary</h4>
                    <p className="text-gray-700">
                      Based on your {activePeriod} data, AI has identified {aiInsights.length} key insights to help improve your financial health.
                    </p>
                  </div>

                  {/* Insights List */}
                  <div className="space-y-4">
                    {aiInsights.map((insight) => (
                      <div key={insight.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{insight.icon}</div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-900">{insight.title}</h5>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                                insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {insight.priority} priority
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{insight.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-blue-600">{insight.impact}</span>
                              <button 
                                onClick={insight.onAction}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                              >
                                {insight.action}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => setShowAiModal(false)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button 
                      onClick={generateAIInsights}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Generate New Insights
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">No insights generated. Please try again.</div>
                  <button 
                    onClick={generateAIInsights}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights; 