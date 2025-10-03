// Simple test script to verify real-time server functionality
const WebSocket = require('ws');

console.log('Testing real-time server connection...');

// Test WebSocket connection
const ws = new WebSocket('ws://localhost:5001/ws');

ws.on('open', () => {
  console.log('✅ WebSocket connected successfully!');
  
  // Subscribe to a test symbol
  ws.send(JSON.stringify({
    type: 'subscribe',
    symbol: 'AAPL'
  }));
  
  console.log('📡 Subscribed to AAPL');
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('📨 Received message:', message);
  
  if (message.type === 'price_update') {
    console.log(`💰 ${message.symbol}: $${message.price} (${message.changePercent > 0 ? '+' : ''}${message.changePercent}%)`);
  }
});

ws.on('close', () => {
  console.log('❌ WebSocket connection closed');
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
});

// Keep the script running for 10 seconds to test
setTimeout(() => {
  console.log('🔄 Test completed, closing connection...');
  ws.close();
  process.exit(0);
}, 10000);








