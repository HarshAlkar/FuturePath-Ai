const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Real-time stock server is running', status: 'healthy' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: 5001
  });
});

// WebSocket server
const wss = new WebSocket.Server({ server });

// Store clients and subscriptions
const clients = new Map();
const subscriptions = new Map();

// Mock price data
const basePrices = {
  'AAPL': 150.00,
  'GOOGL': 2800.00,
  'MSFT': 350.00,
  'AMZN': 3200.00,
  'TSLA': 250.00,
  'NVDA': 450.00,
  'META': 300.00,
  'NFLX': 400.00,
  'AMD': 120.00,
  'INTC': 50.00
};

function generatePriceData(symbol) {
  const basePrice = basePrices[symbol] || 100.00;
  const priceChange = (Math.random() - 0.5) * 0.04; // ±2% change
  const newPrice = Math.max(basePrice * (1 + priceChange), 1);
  const change = newPrice - basePrice;
  const changePercent = (change / basePrice) * 100;
  
  return {
    symbol,
    price: Math.round(newPrice * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    volume: Math.floor(Math.random() * 10000000) + 1000000,
    timestamp: new Date().toISOString()
  };
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  const clientId = Math.random().toString(36).substr(2, 9);
  clients.set(clientId, { ws, subscriptions: new Set() });
  
  console.log(`Client connected: ${clientId}`);
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'subscribe') {
        const symbol = data.symbol;
        const client = clients.get(clientId);
        if (client) {
          client.subscriptions.add(symbol);
          
          if (!subscriptions.has(symbol)) {
            subscriptions.set(symbol, new Set());
          }
          subscriptions.get(symbol).add(clientId);
          
          console.log(`Client ${clientId} subscribed to ${symbol}`);
          
          // Send current price immediately
          const priceData = generatePriceData(symbol);
          ws.send(JSON.stringify({
            type: 'price_update',
            ...priceData
          }));
        }
      } else if (data.type === 'unsubscribe') {
        const symbol = data.symbol;
        const client = clients.get(clientId);
        if (client) {
          client.subscriptions.delete(symbol);
          
          if (subscriptions.has(symbol)) {
            subscriptions.get(symbol).delete(clientId);
            if (subscriptions.get(symbol).size === 0) {
              subscriptions.delete(symbol);
            }
          }
          
          console.log(`Client ${clientId} unsubscribed from ${symbol}`);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log(`Client disconnected: ${clientId}`);
    const client = clients.get(clientId);
    if (client) {
      // Clean up subscriptions
      client.subscriptions.forEach(symbol => {
        if (subscriptions.has(symbol)) {
          subscriptions.get(symbol).delete(clientId);
          if (subscriptions.get(symbol).size === 0) {
            subscriptions.delete(symbol);
          }
        }
      });
    }
    clients.delete(clientId);
  });
  
  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error);
  });
});

// Broadcast price updates every 5 seconds
setInterval(() => {
  if (subscriptions.size > 0) {
    subscriptions.forEach((subscribers, symbol) => {
      const priceData = generatePriceData(symbol);
      
      subscribers.forEach(clientId => {
        const client = clients.get(clientId);
        if (client && client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(JSON.stringify({
            type: 'price_update',
            ...priceData
          }));
        }
      });
    });
  }
}, 5000);

// Start server
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Real-time stock server running on port ${PORT}`);
  console.log(`WebSocket server available at ws://localhost:${PORT}/ws`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down real-time stock server...');
  server.close(() => {
    console.log('Server shut down successfully');
    process.exit(0);
  });
});










