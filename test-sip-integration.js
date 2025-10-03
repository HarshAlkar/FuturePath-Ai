// Test script for SIP integration
const axios = require('axios');

async function testSipIntegration() {
  console.log('🧪 Testing SIP Integration...\n');

  // Test 1: Python SIP Server Health Check
  console.log('1. Testing Python SIP Server...');
  try {
    const sipHealth = await axios.get('http://localhost:8001/health');
    console.log('✅ Python SIP Server is running');
    console.log('   Status:', sipHealth.data.status);
    console.log('   Gemini configured:', sipHealth.data.gemini_configured);
  } catch (error) {
    console.log('❌ Python SIP Server is not running');
    console.log('   Error:', error.message);
    console.log('   Please start it with: start-sip-server.bat\n');
    return;
  }

  // Test 2: Python SIP Recommendation
  console.log('\n2. Testing Python SIP Recommendation...');
  try {
    const sipRecommendation = await axios.post('http://localhost:8001/recommend', {
      annual_income: 900000,
      horizon_years: 10,
      risk_level: 'moderate'
    });
    
    console.log('✅ Python SIP Recommendation working');
    console.log('   Monthly SIP:', sipRecommendation.data.monthly_sip);
    console.log('   AI Recommendation length:', sipRecommendation.data.recommendation.length, 'characters');
  } catch (error) {
    console.log('❌ Python SIP Recommendation failed');
    console.log('   Error:', error.message);
  }

  // Test 3: Node.js Backend Health Check
  console.log('\n3. Testing Node.js Backend...');
  try {
    const backendHealth = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Node.js Backend is running');
    console.log('   SIP recommendations available:', backendHealth.data.features.sip_recommendations);
  } catch (error) {
    console.log('❌ Node.js Backend is not running');
    console.log('   Error:', error.message);
    console.log('   Please start it with: start-all-servers.bat\n');
    return;
  }

  // Test 4: Full Integration Test
  console.log('\n4. Testing Full Integration...');
  try {
    const integrationTest = await axios.post('http://localhost:5000/api/sip/recommendations', {
      annualIncome: 900000,
      horizonYears: 10,
      riskLevel: 'moderate'
    }, {
      headers: {
        'Authorization': 'Bearer test-token', // You might need a real token
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Full Integration working');
    console.log('   Monthly SIP:', integrationTest.data.recommendation.monthlySip);
    console.log('   Has AI recommendation:', !!integrationTest.data.recommendation.aiRecommendation);
  } catch (error) {
    console.log('❌ Full Integration failed');
    console.log('   Error:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Response:', error.response.data);
    }
  }

  console.log('\n🎉 SIP Integration Test Complete!');
  console.log('\nTo use SIP recommendations:');
  console.log('1. Start all servers: start-all-servers-with-sip.bat');
  console.log('2. Open frontend: http://localhost:3002');
  console.log('3. Go to Goals page and click "Get SIP Recommendations"');
}

// Run the test
testSipIntegration().catch(console.error);
