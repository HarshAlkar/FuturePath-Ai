import authService from './authService';

const baseURL = 'http://localhost:5000';

class TransactionService {
  async getTransactions() {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${baseURL}/api/transactions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.transactions || [];
      } else {
        throw new Error('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  async addTransaction(transactionData) {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${baseURL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        const data = await response.json();
        return data.transaction;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async updateTransaction(id, transactionData) {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${baseURL}/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        const data = await response.json();
        return data.transaction;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  async deleteTransaction(id) {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${baseURL}/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  async getStats() {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${baseURL}/api/transactions/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.stats;
      } else {
        throw new Error('Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        categoryBreakdown: []
      };
    }
  }

  // Voice input processing
  processVoiceInput(text) {
    const commands = {
      add: /add\s+₹?(\d+)\s+for\s+(.+)/i,
      log: /log\s+₹?(\d+)\s+(.+)\s+expense/i,
      record: /record\s+₹?(\d+)\s+(.+)\s+expense/i,
    };

    for (const [action, regex] of Object.entries(commands)) {
      const match = text.match(regex);
      if (match) {
        const amount = parseFloat(match[1]);
        const description = match[2].trim();
        
        // Map common words to categories
        const categoryMap = {
          'groceries': 'Groceries',
          'food': 'Food & Dining',
          'restaurant': 'Food & Dining',
          'transport': 'Transport',
          'uber': 'Transport',
          'ola': 'Transport',
          'fuel': 'Transport',
          'entertainment': 'Entertainment',
          'movie': 'Entertainment',
          'bills': 'Bills',
          'electricity': 'Bills',
          'water': 'Bills',
          'healthcare': 'Healthcare',
          'medical': 'Healthcare',
          'shopping': 'Shopping',
          'clothes': 'Shopping',
        };

        let category = 'Others';
        const lowerDesc = description.toLowerCase();
        for (const [keyword, cat] of Object.entries(categoryMap)) {
          if (lowerDesc.includes(keyword)) {
            category = cat;
            break;
          }
        }

        return {
          type: 'expense',
          amount,
          category,
          description,
          method: 'voice',
          date: new Date(),
        };
      }
    }

    return null;
  }
}

export default new TransactionService(); 