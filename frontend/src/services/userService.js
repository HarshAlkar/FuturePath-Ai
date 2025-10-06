import authService from './authService';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class UserService {
  async getCurrentUser() {
    try {
      const token = authService.getToken();
      if (!token) {
        return this.getDefaultUser();
      }

      const response = await fetch(`${baseURL}/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.user || this.getDefaultUser();
      } else {
        console.error('Failed to fetch user data:', response.status);
        return this.getDefaultUser();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return this.getDefaultUser();
    }
  }

  async updateUser(userData) {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${baseURL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        return updatedUser;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      // Fallback to local update
      const currentUser = this.getDefaultUser();
      const updatedUser = { ...currentUser, ...userData };
      return updatedUser;
    }
  }

  getAuthToken() {
    return authService.getToken();
  }

  getUserGreeting() {
    const user = authService.getStoredUser();
    if (user && user.name) {
      const hour = new Date().getHours();
      if (hour < 12) return `Good morning, ${user.name}`;
      if (hour < 17) return `Good afternoon, ${user.name}`;
      return `Good evening, ${user.name}`;
    }
    return 'Welcome back!';
  }

  getUserStats() {
    return {
      goalsCreated: 8,
      goalsAchieved: 3,
      totalSavings: 250000,
      daysActive: 45
    };
  }

  getRecentActivities() {
    return [
      { action: 'Created new goal', details: 'House Down Payment', time: '2 hours ago', icon: '🏠' },
      { action: 'Updated expense', details: 'Food & Dining - ₹2,500', time: '1 day ago', icon: '🍽️' },
      { action: 'Achieved milestone', details: 'Emergency Fund - 90%', time: '3 days ago', icon: '🛡️' },
      { action: 'Added investment', details: 'SIP - ₹15,000', time: '1 week ago', icon: '📈' }
    ];
  }

  getDefaultUser() {
    return {
      name: 'Riddhi',
      email: 'riddhi@example.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, India',
      joinDate: 'January 2024',
      membership: 'Premium Member',
      avatar: '👤',
      bio: 'Passionate about financial planning and achieving financial goals.',
      preferences: {
        currency: 'INR',
        language: 'English',
        timezone: 'IST',
        notifications: true
      },
      stats: {
        goalsCreated: 8,
        goalsAchieved: 3,
        totalSavings: 250000,
        daysActive: 45
      }
    };
  }
}

export default new UserService(); 