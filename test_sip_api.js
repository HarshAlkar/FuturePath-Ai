// Test script for SIP API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test data
const testData = {
  annualIncome: 900000,
  horizonYears: 10,
  riskLevel: 'moderate',
  monthlySip: 11250,
  expectedReturn: 12
};

async function testSipRecommendations() {
  try {
    console.log('🧪 Testing SIP Recommendations API...');
    
    // Note: This test requires authentication token
    // In a real scenario, you'd need to login first to get the token
    const response = await axios.post(`${BASE_URL}/api/sip/recommendations`, testData, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SIP Recommendations Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ SIP Recommendations Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testSipCalculation() {
  try {
    console.log('🧪 Testing SIP Calculation API...');
    
    const response = await axios.post(`${BASE_URL}/api/sip/calculate`, {
      monthlySip: testData.monthlySip,
      horizonYears: testData.horizonYears,
      expectedReturn: testData.expectedReturn
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ SIP Calculation Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ SIP Calculation Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function testHealthCheck() {
  try {
    console.log('🧪 Testing Health Check...');
    
    const response = await axios.get(`${BASE_URL}/api/health`);
    
    console.log('✅ Health Check Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Health Check Error:');
    console.error(error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting SIP API Tests...\n');
  
  await testHealthCheck();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testSipCalculation();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await testSipRecommendations();
  
  console.log('\n🏁 Tests completed!');
}

runTests();
