import { getAuthToken } from './api';

const baseURL = 'http://localhost:5000';

class SipService {
  // Get SIP recommendations based on user profile
  async getRecommendations(annualIncome, horizonYears, riskLevel) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${baseURL}/api/sip/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          annualIncome,
          horizonYears,
          riskLevel
        })
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to fetch SIP recommendations');
      }
    } catch (error) {
      console.error('Error fetching SIP recommendations:', error);
      throw error;
    }
  }

  // Calculate SIP returns
  async calculateSip(monthlySip, horizonYears, expectedReturn = 12) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${baseURL}/api/sip/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          monthlySip,
          horizonYears,
          expectedReturn
        })
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to calculate SIP returns');
      }
    } catch (error) {
      console.error('Error calculating SIP:', error);
      throw error;
    }
  }

  // Get risk level based on user profile
  getRiskLevel(age, income, investmentExperience) {
    if (age < 30 && investmentExperience === 'beginner') return 'moderate';
    if (age < 30 && investmentExperience === 'experienced') return 'aggressive';
    if (age >= 30 && age < 50 && income > 1000000) return 'aggressive';
    if (age >= 30 && age < 50) return 'moderate';
    if (age >= 50) return 'low';
    return 'moderate';
  }

  // Calculate suggested SIP amount based on income and risk
  calculateSuggestedSip(annualIncome, riskLevel) {
    const riskMap = { "low": 0.10, "moderate": 0.15, "aggressive": 0.20 };
    const investmentPercentage = riskMap[riskLevel.toLowerCase()] || 0.15;
    return Math.max(500, Math.round((annualIncome * investmentPercentage) / 12));
  }

  // Format currency for display
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Get risk level description
  getRiskDescription(riskLevel) {
    const descriptions = {
      'low': {
        title: 'Conservative',
        description: 'Capital preservation with moderate returns',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      'moderate': {
        title: 'Balanced',
        description: 'Balanced growth with moderate risk',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      },
      'aggressive': {
        title: 'Growth-Oriented',
        description: 'Higher returns with higher risk',
        color: 'text-red-600',
        bgColor: 'bg-red-50'
      }
    };
    return descriptions[riskLevel] || descriptions['moderate'];
  }
}

export default new SipService();
