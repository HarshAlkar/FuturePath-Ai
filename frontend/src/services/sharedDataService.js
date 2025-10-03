import goalService from './goalService';
import transactionService from './transactionService';

// Custom EventEmitter for browser compatibility
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }

  removeAllListeners() {
    this.events = {};
  }
}

class SharedDataService extends EventEmitter {
  constructor() {
    super();
    this.goals = [];
    this.transactions = [];
    this.metrics = {
      totalSpending: 0,
      savingsRate: 0,
      budgetUtilization: 0,
      investmentGrowth: 0
    };
    this.isLoading = false;
    this.lastUpdate = null;
  }

  // Initialize data and start real-time updates
  async initialize() {
    try {
      this.isLoading = true;
      this.emit('loading', true);
      
      console.log('Initializing shared data service...');
      
      // Fetch initial data
      await this.refreshData();
      
      // Set up periodic refresh (every 30 seconds)
      this.startPeriodicRefresh();
      
      console.log('Shared data service initialized successfully');
    } catch (error) {
      console.error('Error initializing shared data service:', error);
      this.emit('error', error);
    } finally {
      this.isLoading = false;
      this.emit('loading', false);
    }
  }

  // Refresh all data
  async refreshData() {
    try {
      console.log('Refreshing shared data...');
      
      // Fetch data in parallel
      const [goalsData, transactionsData] = await Promise.all([
        goalService.getGoals(),
        transactionService.getTransactions()
      ]);

      // Update local state
      this.goals = goalsData || [];
      this.transactions = transactionsData || [];
      
      // Calculate metrics
      this.calculateMetrics();
      
      // Update timestamp
      this.lastUpdate = new Date();
      
      // Emit update event
      this.emit('dataUpdated', {
        goals: this.goals,
        transactions: this.transactions,
        metrics: this.metrics,
        lastUpdate: this.lastUpdate
      });
      
      console.log('Data refreshed successfully:', {
        goalsCount: this.goals.length,
        transactionsCount: this.transactions.length,
        metrics: this.metrics
      });
      
    } catch (error) {
      console.error('Error refreshing data:', error);
      this.emit('error', error);
    }
  }

  // Calculate metrics based on current data
  calculateMetrics() {
    try {
      // Calculate total spending
      const totalSpending = this.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      // Calculate total income
      const totalIncome = this.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      // Calculate savings rate
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpending) / totalIncome) * 100 : 0;
      
      // Calculate budget utilization (assuming 80% of income as budget)
      const monthlyBudget = totalIncome * 0.8;
      const budgetUtilization = monthlyBudget > 0 ? (totalSpending / monthlyBudget) * 100 : 0;
      
      // Calculate investment growth (from goals progress)
      const investmentGrowth = this.goals
        .filter(g => g.category === 'investment')
        .reduce((sum, g) => sum + Number(g.progress || 0), 0);
      
      this.metrics = {
        totalSpending,
        savingsRate: Math.round(savingsRate),
        budgetUtilization: Math.round(budgetUtilization),
        investmentGrowth
      };
      
      console.log('Metrics calculated:', this.metrics);
      
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  }

  // Start periodic refresh
  startPeriodicRefresh() {
    // Clear any existing interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    // Set up new interval (30 seconds)
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, 30000);
    
    console.log('Periodic refresh started (30s interval)');
  }

  // Stop periodic refresh
  stopPeriodicRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('Periodic refresh stopped');
    }
  }

  // Get current goals
  getGoals() {
    return this.goals;
  }

  // Get current transactions
  getTransactions() {
    return this.transactions;
  }

  // Get current metrics
  getMetrics() {
    return this.metrics;
  }

  // Get last update time
  getLastUpdate() {
    return this.lastUpdate;
  }

  // Check if data is loading
  isLoading() {
    return this.isLoading;
  }

  // Add a new goal and refresh data
  async addGoal(goalData) {
    try {
      await goalService.createGoal(goalData);
      await this.refreshData();
      this.emit('goalAdded', goalData);
    } catch (error) {
      console.error('Error adding goal:', error);
      this.emit('error', error);
      throw error;
    }
  }

  // Update a goal and refresh data
  async updateGoal(id, goalData) {
    try {
      await goalService.updateGoal(id, goalData);
      await this.refreshData();
      this.emit('goalUpdated', { id, goalData });
    } catch (error) {
      console.error('Error updating goal:', error);
      this.emit('error', error);
      throw error;
    }
  }

  // Delete a goal and refresh data
  async deleteGoal(id) {
    try {
      await goalService.deleteGoal(id);
      await this.refreshData();
      this.emit('goalDeleted', id);
    } catch (error) {
      console.error('Error deleting goal:', error);
      this.emit('error', error);
      throw error;
    }
  }

  // Add a new transaction and refresh data
  async addTransaction(transactionData) {
    try {
      await transactionService.addTransaction(transactionData);
      await this.refreshData();
      this.emit('transactionAdded', transactionData);
    } catch (error) {
      console.error('Error adding transaction:', error);
      this.emit('error', error);
      throw error;
    }
  }

  // Get insights data for AI analysis
  getInsightsData() {
    return {
      transactions: this.transactions,
      goals: this.goals,
      metrics: this.metrics,
      lastUpdate: this.lastUpdate
    };
  }

  // Cleanup
  destroy() {
    this.stopPeriodicRefresh();
    this.removeAllListeners();
    console.log('Shared data service destroyed');
  }
}

// Create singleton instance
const sharedDataService = new SharedDataService();

export default sharedDataService; 