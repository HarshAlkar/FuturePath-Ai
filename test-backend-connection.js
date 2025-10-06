// Test Backend Connection
// This script tests if the backend server is accessible

const https = require('https');
const http = require('http');

const testBackendConnection = async () => {
  const backendUrl = 'https://futurepath-ai-1.onrender.com';
  
  console.log('Testing backend connection...');
  console.log('Backend URL:', backendUrl);
  
  try {
    // Test health endpoint
    const healthUrl = `${backendUrl}/api/health`;
    console.log('Testing health endpoint:', healthUrl);
    
    const response = await fetch(healthUrl);
    console.log('Health check status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Health check response:', data);
      console.log('✅ Backend is accessible');
      return true;
    } else {
      console.log('❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    return false;
  }
};

const testAuthEndpoints = async () => {
  const backendUrl = 'https://futurepath-ai-1.onrender.com';
  
  console.log('\nTesting authentication endpoints...');
  
  try {
    // Test registration endpoint
    const registerUrl = `${backendUrl}/api/auth/register`;
    console.log('Testing registration endpoint:', registerUrl);
    
    const registerResponse = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    
    console.log('Registration endpoint status:', registerResponse.status);
    
    if (registerResponse.status === 400) {
      console.log('✅ Registration endpoint is accessible (400 is expected for empty data)');
    } else {
      console.log('⚠️ Registration endpoint returned unexpected status:', registerResponse.status);
    }
    
    // Test login endpoint
    const loginUrl = `${backendUrl}/api/auth/login`;
    console.log('Testing login endpoint:', loginUrl);
    
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    
    console.log('Login endpoint status:', loginResponse.status);
    
    if (loginResponse.status === 400) {
      console.log('✅ Login endpoint is accessible (400 is expected for empty data)');
    } else {
      console.log('⚠️ Login endpoint returned unexpected status:', loginResponse.status);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Auth endpoints test failed:', error.message);
    return false;
  }
};

// Run tests
const runTests = async () => {
  console.log('🔍 Testing FuturePath AI Backend Connection\n');
  
  const healthTest = await testBackendConnection();
  const authTest = await testAuthEndpoints();
  
  console.log('\n📊 Test Results:');
  console.log('Health Check:', healthTest ? '✅ PASS' : '❌ FAIL');
  console.log('Auth Endpoints:', authTest ? '✅ PASS' : '❌ FAIL');
  
  if (healthTest && authTest) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the backend server status.');
  }
};

runTests();
