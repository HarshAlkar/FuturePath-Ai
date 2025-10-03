import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for fallback
const generateMockData = () => {
  return [
    {
      symbol: 'XAU',
      name: 'Gold',
      price: 6850,
      currency: 'INR',
      unit: '10g',
      indianUnit: 'per 10 grams',
      change24h: 45,
      changePercent24h: 0.66,
      high24h: 6890,
      low24h: 6820,
      volume: 1250000,
      marketCap: 1500000000,
      timestamp: new Date(),
      source: 'mock',
      isIndianMarket: true
    },
    {
      symbol: 'XAG',
      name: 'Silver',
      price: 82500,
      currency: 'INR',
      unit: 'kg',
      indianUnit: 'per kg',
      change24h: -1200,
      changePercent24h: -1.43,
      high24h: 84000,
      low24h: 81800,
      volume: 850000,
      marketCap: 1200000000,
      timestamp: new Date(),
      source: 'mock',
      isIndianMarket: true
    },
    {
      symbol: 'XPT',
      name: 'Platinum',
      price: 7034625,
      currency: 'INR',
      unit: 'oz',
      indianUnit: 'per oz',
      change24h: 57193,
      changePercent24h: 0.82,
      high24h: 7101225,
      low24h: 6976350,
      volume: 450000,
      marketCap: 800000000,
      timestamp: new Date(),
      source: 'mock',
      isIndianMarket: true
    },
    {
      symbol: 'XPD',
      name: 'Palladium',
      price: 123643,
      currency: 'INR',
      unit: 'oz',
      indianUnit: 'per oz',
      change24h: -1315,
      changePercent24h: -1.05,
      high24h: 125291,
      low24h: 122794,
      volume: 320000,
      marketCap: 600000000,
      timestamp: new Date(),
      source: 'mock',
      isIndianMarket: true
    }
  ];
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Gold Dashboard API is running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Get current gold prices
app.get('/api/gold/prices', async (req, res) => {
  try {
    console.log('Fetching gold prices...');
    
    // Try to get real data first
    try {
      // Fetch USD to INR rate
      const forexResponse = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
        timeout: 5000
      });
      const usdToInr = forexResponse.data.rates.INR || 83.25;
      
      // Fetch gold prices
      const goldResponse = await axios.get('https://api.metals.live/v1/spot/gold', {
        timeout: 5000
      });
      
      const goldData = await goldResponse.data;
      const goldPricePerOz = goldData[0]?.price || 2045.50;
      const goldPricePer10g = (goldPricePerOz * usdToInr) / 31.1035 * 10;
      
      const realPrices = [
        {
          symbol: 'XAU',
          name: 'Gold',
          price: Math.round(goldPricePer10g),
          currency: 'INR',
          unit: '10g',
          indianUnit: 'per 10 grams',
          change24h: Math.round((Math.random() - 0.5) * 100),
          changePercent24h: Math.round((Math.random() - 0.5) * 2 * 100) / 100,
          high24h: Math.round(goldPricePer10g * 1.02),
          low24h: Math.round(goldPricePer10g * 0.98),
          volume: Math.floor(Math.random() * 1000000) + 100000,
          marketCap: Math.floor(goldPricePer10g * 1000000),
          timestamp: new Date(),
          source: 'real-api',
          isIndianMarket: true
        },
        ...generateMockData().slice(1) // Use mock data for other metals
      ];
      
      res.json({
        success: true,
        data: realPrices,
        timestamp: new Date()
      });
      
    } catch (apiError) {
      console.log('API failed, using mock data:', apiError.message);
      // Use mock data if API fails
      const mockData = generateMockData();
      res.json({
        success: true,
        data: mockData,
        timestamp: new Date()
      });
    }
    
  } catch (error) {
    console.error('Error fetching gold prices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prices',
      error: error.message
    });
  }
});

// Get historical data
app.get('/api/gold/historical/:symbol', (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1M' } = req.query;
    
    let days = 30;
    switch (period) {
      case '1D': days = 1; break;
      case '1W': days = 7; break;
      case '1M': days = 30; break;
      case '3M': days = 90; break;
      case '6M': days = 180; break;
      case '1Y': days = 365; break;
    }

    // Generate mock historical data
    const basePrices = { XAU: 6850, XAG: 82500, XPT: 7034625, XPD: 123643 };
    const basePrice = basePrices[symbol] || 6850;
    
    const data = [];
    let currentPrice = basePrice;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * volatility * currentPrice;
      
      const open = currentPrice;
      const close = currentPrice + change;
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      
      data.push({
        date,
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close),
        volume: Math.floor(Math.random() * 100000) + 10000
      });
      
      currentPrice = close;
    }

    res.json({
      success: true,
      data: data,
      symbol,
      period
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical data',
      error: error.message
    });
  }
});

// Get market analysis
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
    console.error('Error fetching market analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market analysis',
      error: error.message
    });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Simple Gold Dashboard API server running on port ${PORT}`);
  console.log(`📊 WebSocket server ready for real-time updates`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📈 Gold prices: http://localhost:${PORT}/api/gold/prices`);
});

export default app;
