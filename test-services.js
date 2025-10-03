// Test script to check if all services are working
import axios from 'axios';

const services = [
  { name: 'Main API', url: 'http://localhost:5000/api/health' },
  { name: 'Real-time Stock', url: 'http://localhost:5001/health' },
  { name: 'SIP Advisor', url: 'http://localhost:5002/health' },
  { name: 'Gold Service', url: 'http://localhost:5003/health' }
];

async function testServices() {
  console.log('🔍 Testing FuturePath AI Services...\n');
  
  for (const service of services) {
    try {
      const response = await axios.get(service.url, { timeout: 5000 });
      console.log(`✅ ${service.name}: ${response.status} - ${response.data?.message || 'OK'}`);
    } catch (error) {
      console.log(`❌ ${service.name}: ${error.message}`);
    }
  }
  
  console.log('\n📊 Service Status Summary:');
  console.log('- Main API: Core backend service');
  console.log('- Real-time Stock: WebSocket for live data');
  console.log('- SIP Advisor: Python AI recommendations');
  console.log('- Gold Service: Gold price tracking');
}

testServices().catch(console.error);
