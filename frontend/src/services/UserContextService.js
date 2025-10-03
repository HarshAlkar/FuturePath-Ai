// UserContextService.js - Manages user survey answers and personalization data
class UserContextService {
  constructor() {
    this.storageKey = 'userSurveyAnswers';
    this.userKey = 'user';
  }

  // Store survey answers after completion
  storeSurveyAnswers(answers) {
    try {
      const enrichedAnswers = {
        ...answers,
        completedAt: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem(this.storageKey, JSON.stringify(enrichedAnswers));
      
      // Also update user object
      const user = this.getUser();
      if (user) {
        user.surveyAnswers = enrichedAnswers;
        user.onboardingCompleted = true;
        localStorage.setItem(this.userKey, JSON.stringify(user));
      }
      
      return true;
    } catch (error) {
      console.error('Error storing survey answers:', error);
      return false;
    }
  }

  // Retrieve survey answers
  getSurveyAnswers() {
    try {
      const answers = localStorage.getItem(this.storageKey);
      return answers ? JSON.parse(answers) : null;
    } catch (error) {
      console.error('Error retrieving survey answers:', error);
      return null;
    }
  }

  // Get user data
  getUser() {
    try {
      const user = localStorage.getItem(this.userKey);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  }

  // Check if user has completed onboarding
  hasCompletedOnboarding() {
    const user = this.getUser();
    return user && user.onboardingCompleted === true;
  }

  // Get personalized financial goals based on survey answers
  getPersonalizedGoals() {
    const answers = this.getSurveyAnswers();
    if (!answers) return [];

    const goals = [];
    
    // Emergency Fund Goal
    if (answers.monthlyIncome) {
      const emergencyAmount = answers.monthlyIncome * 6;
      goals.push({
        id: 'emergency-fund',
        title: 'Emergency Fund',
        description: 'Build 6 months of expenses for financial security',
        targetAmount: emergencyAmount,
        currentAmount: answers.currentSavings || 0,
        category: 'Security',
        priority: 'High',
        deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        isPersonalized: true
      });
    }

    // Investment Goal
    if (answers.investmentExperience && answers.riskTolerance) {
      const investmentAmount = (answers.monthlyIncome || 50000) * 12 * 0.2; // 20% of annual income
      goals.push({
        id: 'investment-growth',
        title: 'Investment Portfolio',
        description: `Build wealth through ${answers.riskTolerance} risk investments`,
        targetAmount: investmentAmount,
        currentAmount: answers.currentInvestments || 0,
        category: 'Growth',
        priority: answers.riskTolerance === 'high' ? 'High' : 'Medium',
        deadline: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000), // 5 years
        isPersonalized: true
      });
    }

    // Retirement Goal
    if (answers.age && answers.retirementAge) {
      const yearsToRetirement = answers.retirementAge - answers.age;
      const retirementAmount = (answers.monthlyIncome || 50000) * 12 * 25; // 25x annual income
      goals.push({
        id: 'retirement-fund',
        title: 'Retirement Planning',
        description: `Secure your retirement in ${yearsToRetirement} years`,
        targetAmount: retirementAmount,
        currentAmount: answers.retirementSavings || 0,
        category: 'Retirement',
        priority: yearsToRetirement < 20 ? 'High' : 'Medium',
        deadline: new Date(Date.now() + yearsToRetirement * 365 * 24 * 60 * 60 * 1000),
        isPersonalized: true
      });
    }

    return goals;
  }

  // Get personalized expense categories based on survey answers
  getPersonalizedExpenseCategories() {
    const answers = this.getSurveyAnswers();
    if (!answers) return this.getDefaultExpenseCategories();

    const categories = [];
    
    // Essential categories based on answers
    if (answers.housingType) {
      categories.push({
        name: 'Housing',
        icon: '🏠',
        budget: answers.monthlyIncome * 0.3, // 30% rule
        color: '#3B82F6',
        isPersonalized: true
      });
    }

    if (answers.transportationMode) {
      const transportBudget = answers.transportationMode === 'own-vehicle' 
        ? answers.monthlyIncome * 0.15 
        : answers.monthlyIncome * 0.05;
      categories.push({
        name: 'Transportation',
        icon: '🚗',
        budget: transportBudget,
        color: '#10B981',
        isPersonalized: true
      });
    }

    if (answers.diningHabits) {
      const foodBudget = answers.diningHabits === 'frequent-dining-out' 
        ? answers.monthlyIncome * 0.15 
        : answers.monthlyIncome * 0.10;
      categories.push({
        name: 'Food & Dining',
        icon: '🍽️',
        budget: foodBudget,
        color: '#F59E0B',
        isPersonalized: true
      });
    }

    // Add other personalized categories
    categories.push(
      {
        name: 'Entertainment',
        icon: '🎬',
        budget: answers.monthlyIncome * 0.05,
        color: '#8B5CF6',
        isPersonalized: true
      },
      {
        name: 'Healthcare',
        icon: '⚕️',
        budget: answers.monthlyIncome * 0.05,
        color: '#EF4444',
        isPersonalized: true
      },
      {
        name: 'Savings',
        icon: '💰',
        budget: answers.monthlyIncome * 0.20,
        color: '#059669',
        isPersonalized: true
      }
    );

    return categories;
  }

  // Get default expense categories
  getDefaultExpenseCategories() {
    return [
      { name: 'Housing', icon: '🏠', budget: 15000, color: '#3B82F6' },
      { name: 'Food', icon: '🍽️', budget: 8000, color: '#F59E0B' },
      { name: 'Transportation', icon: '🚗', budget: 5000, color: '#10B981' },
      { name: 'Entertainment', icon: '🎬', budget: 3000, color: '#8B5CF6' },
      { name: 'Healthcare', icon: '⚕️', budget: 2000, color: '#EF4444' },
      { name: 'Savings', icon: '💰', budget: 10000, color: '#059669' }
    ];
  }

  // Get personalized investment recommendations
  getPersonalizedInvestments() {
    const answers = this.getSurveyAnswers();
    if (!answers) return [];

    const investments = [];
    
    if (answers.riskTolerance === 'low') {
      investments.push(
        {
          name: 'Fixed Deposits',
          type: 'Safe',
          expectedReturn: '6-8%',
          risk: 'Low',
          recommended: true,
          description: 'Secure returns with guaranteed capital protection'
        },
        {
          name: 'Government Bonds',
          type: 'Safe',
          expectedReturn: '7-9%',
          risk: 'Low',
          recommended: true,
          description: 'Government-backed securities with stable returns'
        }
      );
    } else if (answers.riskTolerance === 'medium') {
      investments.push(
        {
          name: 'Mutual Funds',
          type: 'Balanced',
          expectedReturn: '10-12%',
          risk: 'Medium',
          recommended: true,
          description: 'Diversified portfolio managed by professionals'
        },
        {
          name: 'Index Funds',
          type: 'Balanced',
          expectedReturn: '11-13%',
          risk: 'Medium',
          recommended: true,
          description: 'Track market indices with low fees'
        }
      );
    } else if (answers.riskTolerance === 'high') {
      investments.push(
        {
          name: 'Equity Stocks',
          type: 'Growth',
          expectedReturn: '15-20%',
          risk: 'High',
          recommended: true,
          description: 'Direct stock investments for maximum growth potential'
        },
        {
          name: 'Cryptocurrency',
          type: 'Speculative',
          expectedReturn: '20-50%',
          risk: 'Very High',
          recommended: answers.age < 35,
          description: 'Digital assets with high volatility and growth potential'
        }
      );
    }

    return investments;
  }

  // Get personalized insights based on user data
  getPersonalizedInsights() {
    const answers = this.getSurveyAnswers();
    if (!answers) return [];

    const insights = [];
    
    // Income vs Expenses insight
    if (answers.monthlyIncome && answers.monthlyExpenses) {
      const savingsRate = ((answers.monthlyIncome - answers.monthlyExpenses) / answers.monthlyIncome) * 100;
      insights.push({
        title: 'Savings Rate Analysis',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. ${savingsRate >= 20 ? 'Excellent!' : 'Consider increasing to 20%+'}`,
        type: savingsRate >= 20 ? 'positive' : 'warning',
        action: savingsRate < 20 ? 'Reduce expenses or increase income' : 'Keep up the great work!',
        isPersonalized: true
      });
    }

    // Emergency fund insight
    if (answers.currentSavings && answers.monthlyExpenses) {
      const monthsCovered = answers.currentSavings / answers.monthlyExpenses;
      insights.push({
        title: 'Emergency Fund Status',
        description: `Your savings cover ${monthsCovered.toFixed(1)} months of expenses. Target: 6 months.`,
        type: monthsCovered >= 6 ? 'positive' : 'warning',
        action: monthsCovered < 6 ? 'Build emergency fund to 6 months of expenses' : 'Emergency fund is well-funded',
        isPersonalized: true
      });
    }

    // Investment insight based on age and risk tolerance
    if (answers.age && answers.riskTolerance) {
      const equityAllocation = 100 - answers.age; // Age-based equity allocation rule
      insights.push({
        title: 'Investment Allocation',
        description: `Based on your age (${answers.age}), consider ${equityAllocation}% equity allocation.`,
        type: 'info',
        action: `Adjust portfolio to match your ${answers.riskTolerance} risk tolerance`,
        isPersonalized: true
      });
    }

    return insights;
  }

  // Get user's financial profile summary
  getFinancialProfile() {
    const answers = this.getSurveyAnswers();
    const user = this.getUser();
    
    if (!answers || !user) return null;

    return {
      name: user.name || 'User',
      age: answers.age,
      occupation: answers.occupation || user.occupation,
      monthlyIncome: answers.monthlyIncome,
      monthlyExpenses: answers.monthlyExpenses,
      currentSavings: answers.currentSavings,
      riskTolerance: answers.riskTolerance,
      financialGoals: answers.financialGoals,
      investmentExperience: answers.investmentExperience,
      onboardingCompleted: user.onboardingCompleted,
      completedAt: answers.completedAt
    };
  }

  // Clear all user data (for logout)
  clearUserData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('token');
  }
}

// Export singleton instance
export default new UserContextService();
