import authService from './authService';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class GoalService {
  async getGoals() {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('No authentication token');
      const response = await fetch(`${baseURL}/api/goals`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.goals || [];
      } else {
        throw new Error('Failed to fetch goals');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  }

  async createGoal(goalData) {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('No authentication token');
      const response = await fetch(`${baseURL}/api/goals`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
      if (response.ok) {
        const data = await response.json();
        return data.goal;
      } else {
        throw new Error('Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  async updateGoal(id, goalData) {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('No authentication token');
      const response = await fetch(`${baseURL}/api/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
      if (response.ok) {
        const data = await response.json();
        return data.goal;
      } else {
        throw new Error('Failed to update goal');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  async deleteGoal(id) {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('No authentication token');
      const response = await fetch(`${baseURL}/api/goals/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        return true;
      } else {
        throw new Error('Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  }

  async generatePlan(goalId) {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('No authentication token');
      const response = await fetch(`${baseURL}/api/goals/${goalId}/plan`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to generate plan');
      }
    } catch (error) {
      console.error('Error generating plan:', error);
      throw error;
    }
  }
}

export default new GoalService(); 