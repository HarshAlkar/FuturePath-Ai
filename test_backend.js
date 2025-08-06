// Test script to verify backend transaction endpoint
const fetch = require('node-fetch');

const baseURL = 'http://localhost:5000';

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    // Test 1: Check if server is running
    const healthResponse = await fetch(`${baseURL}/api/health`);
    console.log('Health check status:', healthResponse.status);
    
    if (!healthResponse.ok) {
      console.error('Backend server is not responding');
      return;
    }
    
    // Test 2: Try to create a transaction (this will fail without auth, but we can see the error)
    const testTransaction = {
      type: 'expense',
      amount: 100,
      category: 'Test',
      description: 'Test transaction',
      date: new Date().toISOString().split('T')[0]
    };
    
    console.log('Testing transaction endpoint with data:', testTransaction);
    
    const transactionResponse = await fetch(`${baseURL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testTransaction),
    });
    
    console.log('Transaction endpoint status:', transactionResponse.status);
    
    if (transactionResponse.status === 401) {
      console.log('✅ Backend is working - authentication required (expected)');
    } else if (transactionResponse.status === 400) {
      const errorData = await transactionResponse.json();
      console.log('✅ Backend is working - validation error:', errorData);
    } else {
      console.log('❌ Unexpected response from backend');
    }
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('Make sure the backend server is running on port 5000');
  }
}

testBackend(); 