import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

const PORT = 5001;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// Mock gold prices data - Realistic Indian market prices
const generateMockPrices = () => {
  // Current realistic Indian gold prices (as of 2024)
  const basePrices = {
    XAU: 68500,  // Gold per 10g in INR (₹68,500)
    XAG: 825000, // Silver per kg in INR (₹8,25,000)
    XPT: 7034625, // Platinum per oz in INR (₹70,34,625)
    XPD: 1236430  // Palladium per oz in INR (₹12,36,430)
  };

  return [
    {
      symbol: 'XAU',
      name: 'Gold',
      price: Math.round(basePrices.XAU + (Math.random() - 0.5) * 1000),
      currency: 'INR',
      unit: '10g',
      change24h: Math.round((Math.random() - 0.5) * 2000),
      changePercent24h: parseFloat(((Math.random() - 0.5) * 4).toFixed(2)),
      high24h: Math.round(basePrices.XAU * 1.02),
      low24h: Math.round(basePrices.XAU * 0.98),
      volume: Math.floor(Math.random() * 1000000) + 500000,
      marketCap: Math.round(basePrices.XAU * 1000000),
      timestamp: new Date(),
      source: 'indian_market'
    },
    {
      symbol: 'XAG',
      name: 'Silver',
      price: Math.round(basePrices.XAG + (Math.random() - 0.5) * 20000),
      currency: 'INR',
      unit: 'kg',
      change24h: Math.round((Math.random() - 0.5) * 50000),
      changePercent24h: parseFloat(((Math.random() - 0.5) * 6).toFixed(2)),
      high24h: Math.round(basePrices.XAG * 1.03),
      low24h: Math.round(basePrices.XAG * 0.97),
      volume: Math.floor(Math.random() * 500000) + 200000,
      marketCap: Math.round(basePrices.XAG * 100000),
      timestamp: new Date(),
      source: 'indian_market'
    },
    {
      symbol: 'XPT',
      name: 'Platinum',
      price: Math.round(basePrices.XPT + (Math.random() - 0.5) * 100000),
      currency: 'INR',
      unit: 'oz',
      change24h: Math.round((Math.random() - 0.5) * 200000),
      changePercent24h: parseFloat(((Math.random() - 0.5) * 3).toFixed(2)),
      high24h: Math.round(basePrices.XPT * 1.015),
      low24h: Math.round(basePrices.XPT * 0.985),
      volume: Math.floor(Math.random() * 100000) + 50000,
      marketCap: Math.round(basePrices.XPT * 50000),
      timestamp: new Date(),
      source: 'indian_market'
    },
    {
      symbol: 'XPD',
      name: 'Palladium',
      price: Math.round(basePrices.XPD + (Math.random() - 0.5) * 100000),
      currency: 'INR',
      unit: 'oz',
      change24h: Math.round((Math.random() - 0.5) * 200000),
      changePercent24h: parseFloat(((Math.random() - 0.5) * 5).toFixed(2)),
      high24h: Math.round(basePrices.XPD * 1.02),
      low24h: Math.round(basePrices.XPD * 0.98),
      volume: Math.floor(Math.random() * 50000) + 25000,
      marketCap: Math.round(basePrices.XPD * 40000),
      timestamp: new Date(),
      source: 'indian_market'
    }
  ];
};

// API Routes
app.get('/api/gold/prices', (req, res) => {
  try {
    const prices = generateMockPrices();
    res.json({
      success: true,
      data: prices,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prices',
      error: error.message
    });
  }
});

app.get('/api/gold/historical/:symbol', (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1D' } = req.query;
    
    // Generate mock historical data with realistic Indian prices
    const data = [];
    const basePrice = symbol === 'XAU' ? 68500 : 
                     symbol === 'XAG' ? 825000 :
                     symbol === 'XPT' ? 7034625 : 1236430;
    
    const days = period === '1D' ? 1 : 
                 period === '1W' ? 7 : 
                 period === '1M' ? 30 : 
                 period === '3M' ? 90 : 
                 period === '6M' ? 180 : 365;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * volatility * basePrice;
      
      const open = basePrice + change;
      const close = open + (Math.random() - 0.5) * basePrice * 0.01;
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);
      
      data.push({
        date,
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close),
        volume: Math.floor(Math.random() * 100000) + 10000
      });
    }
    
    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical data',
      error: error.message
    });
  }
});

app.get('/api/gold/analysis/:symbol', (req, res) => {
  try {
    const { symbol } = req.params;
    
    const trends = ['bullish', 'bearish', 'neutral'];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    
    const analysis = {
      symbol,
      trend,
      volatility: Math.random() * 5 + 1,
      support: Math.floor(Math.random() * 1000) + 5000,
      resistance: Math.floor(Math.random() * 1000) + 7000,
      prediction: `Market shows ${trend} sentiment with moderate volatility`,
      confidence: Math.floor(Math.random() * 30) + 70,
      lastUpdated: new Date()
    };
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market analysis',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Gold server is running',
    timestamp: new Date()
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data
  socket.emit('priceUpdate', { prices: generateMockPrices() });
  
  // Send periodic updates
  const interval = setInterval(() => {
    socket.emit('priceUpdate', { prices: generateMockPrices() });
  }, 30000); // Update every 30 seconds
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Simple Gold Server running on port ${PORT}`);
  console.log(`📊 WebSocket available at ws://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gold server...');
  server.close(() => {
    console.log('✅ Gold server shut down successfully');
    process.exit(0);
  });
});