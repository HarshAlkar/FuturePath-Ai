// API Test Script
// This script tests the API connection and endpoints

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const testAPI = async () => {
  console.log('Testing API connection...');
  console.log('Base URL:', baseURL);
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${baseURL}/api/health`);
    console.log('Health check status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('Health check response:', healthData);
    }
    
    // Test API root endpoint
    const apiResponse = await fetch(`${baseURL}/api`);
    console.log('API root status:', apiResponse.status);
    
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      console.log('API root response:', apiData);
    }
    
    return true;
  } catch (error) {
    console.error('API test failed:', error);
    return false;
  }
};

// Test authentication endpoints
export const testAuthEndpoints = async () => {
  console.log('Testing authentication endpoints...');
  
  try {
    // Test registration endpoint (should return 400 for missing data)
    const registerResponse = await fetch(`${baseURL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    console.log('Register endpoint status:', registerResponse.status);
    
    // Test login endpoint (should return 400 for missing data)
    const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    console.log('Login endpoint status:', loginResponse.status);
    
    return true;
  } catch (error) {
    console.error('Auth endpoints test failed:', error);
    return false;
  }
};
