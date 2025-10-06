import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import axios from 'axios';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import winston from 'winston';
import cron from 'node-cron';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'gold-dashboard-secret-key';

// Initialize Redis for caching
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryDelayOnFailover: 100,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 3,
});

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'gold-dashboard' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ],
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gold-dashboard';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  logger.info('✅ Connected to MongoDB');
}).catch((err) => {
  logger.error('❌ MongoDB connection error:', err);
});

// Gold API Configuration
const GOLD_API_CONFIGS = {
  metalsApi: {
    baseUrl: 'https://metals-api.com/api',
    key: process.env.METALS_API_KEY || 'your-metals-api-key',
    symbols: ['XAU', 'XAG', 'XPT', 'XPD'], // Gold, Silver, Platinum, Palladium
  },
  goldApi: {
    baseUrl: 'https://www.goldapi.io/api',
    key: process.env.GOLD_API_KEY || 'your-gold-api-key',
  },
  metalPriceApi: {
    baseUrl: 'https://api.metalpriceapi.com/v1',
    key: process.env.METAL_PRICE_API_KEY || 'your-metal-price-api-key',
  },
  // Indian Gold APIs
  indianGold: {
    baseUrl: 'https://api.metals.live/v1/spot',
    // Alternative: https://api.goldapi.io/api/XAU/INR
  },
  forexApi: {
    baseUrl: 'https://api.exchangerate-api.com/v4/latest/USD'
  }
};

// Models
const GoldPriceSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  change24h: { type: Number, default: 0 },
  changePercent24h: { type: Number, default: 0 },
  high24h: { type: Number, default: 0 },
  low24h: { type: Number, default: 0 },
  volume: { type: Number, default: 0 },
  marketCap: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
  source: { type: String, required: true }
});

const HistoricalDataSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  date: { type: Date, required: true },
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
  volume: { type: Number, default: 0 },
  source: { type: String, required: true }
});

const UserAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['above', 'below'], required: true },
  targetPrice: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  triggeredAt: { type: Date }
});

const GoldPrice = mongoose.model('GoldPrice', GoldPriceSchema);
const HistoricalData = mongoose.model('HistoricalData', HistoricalDataSchema);
const UserAlert = mongoose.model('UserAlert', UserAlertSchema);

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Gold API Service Functions
class GoldAPIService {
  static async fetchFromMetalsAPI() {
    try {
      const response = await axios.get(`${GOLD_API_CONFIGS.metalsApi.baseUrl}/latest`, {
        params: {
          access_key: GOLD_API_CONFIGS.metalsApi.key,
          base: 'USD',
          symbols: GOLD_API_CONFIGS.metalsApi.symbols.join(',')
        },
        timeout: 10000
      });

      if (response.data.success) {
        return {
          success: true,
          data: response.data.rates,
          source: 'metals-api'
        };
      }
      throw new Error('API returned unsuccessful response');
    } catch (error) {
      logger.error('Metals API error:', error.message);
      return { success: false, error: error.message };
    }
  }

  static async fetchIndianGoldPrices() {
    try {
      // Fetch USD to INR exchange rate
      const forexResponse = await axios.get(GOLD_API_CONFIGS.forexApi.baseUrl, {
        timeout: 10000
      });
      const usdToInr = forexResponse.data.rates.INR || 83.25;

      // Fetch gold prices in USD
      const goldResponse = await axios.get(`${GOLD_API_CONFIGS.indianGold.baseUrl}/gold`, {
        timeout: 10000
      });
      const silverResponse = await axios.get(`${GOLD_API_CONFIGS.indianGold.baseUrl}/silver`, {
        timeout: 10000
      });
      const platinumResponse = await axios.get(`${GOLD_API_CONFIGS.indianGold.baseUrl}/platinum`, {
        timeout: 10000
      });
      const palladiumResponse = await axios.get(`${GOLD_API_CONFIGS.indianGold.baseUrl}/palladium`, {
        timeout: 10000
      });

      const [goldData, silverData, platinumData, palladiumData] = await Promise.all([
        goldResponse.json(),
        silverResponse.json(),
        platinumResponse.json(),
        palladiumResponse.json()
      ]);

      // Convert to Indian prices (per 10 grams for gold, per kg for silver)
      const goldPricePerOz = goldData[0]?.price || 2045.50;
      const silverPricePerOz = silverData[0]?.price || 24.85;
      const platinumPricePerOz = platinumData[0]?.price || 1015.75;
      const palladiumPricePerOz = palladiumData[0]?.price || 1485.20;

      // Convert to Indian standard
      const goldPricePer10g = (goldPricePerOz * usdToInr) / 31.1035 * 10; // 1 oz = 31.1035 grams
      const silverPricePerKg = (silverPricePerOz * usdToInr) / 31.1035 * 1000;
      const platinumPricePerOzInr = platinumPricePerOz * usdToInr;
      const palladiumPricePerOzInr = palladiumPricePerOz * usdToInr;

      return {
        success: true,
        data: {
          XAU: goldPricePer10g,
          XAG: silverPricePerKg,
          XPT: platinumPricePerOzInr,
          XPD: palladiumPricePerOzInr
        },
        source: 'indian-gold-api',
        currency: 'INR'
      };
    } catch (error) {
      logger.error('Indian Gold API error:', error.message);
      return { success: false, error: error.message };
    }
  }

  static async fetchFromGoldAPI() {
    try {
      const response = await axios.get(`${GOLD_API_CONFIGS.goldApi.baseUrl}/XAU/USD`, {
        headers: {
          'x-access-token': GOLD_API_CONFIGS.goldApi.key
        },
        timeout: 10000
      });

      return {
        success: true,
        data: response.data,
        source: 'gold-api'
      };
    } catch (error) {
      logger.error('Gold API error:', error.message);
      return { success: false, error: error.message };
    }
  }

  static async fetchFromMetalPriceAPI() {
    try {
      const response = await axios.get(`${GOLD_API_CONFIGS.metalPriceApi.baseUrl}/latest`, {
        params: {
          api_key: GOLD_API_CONFIGS.metalPriceApi.key,
          base: 'USD',
          currencies: 'XAU,XAG,XPT,XPD'
        },
        timeout: 10000
      });

      return {
        success: true,
        data: response.data.rates,
        source: 'metal-price-api'
      };
    } catch (error) {
      logger.error('Metal Price API error:', error.message);
      return { success: false, error: error.message };
    }
  }

  static async fetchAllSources() {
    const results = await Promise.allSettled([
      this.fetchIndianGoldPrices(),
      this.fetchFromMetalsAPI(),
      this.fetchFromGoldAPI(),
      this.fetchFromMetalPriceAPI()
    ]);

    const successfulResults = results
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => result.value);

    return successfulResults;
  }

  static async getCachedPrices() {
    try {
      const cached = await redis.get('gold_prices');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      logger.error('Redis get error:', error);
      return null;
    }
  }

  static async setCachedPrices(data, ttl = 300) { // 5 minutes TTL
    try {
      await redis.setex('gold_prices', ttl, JSON.stringify(data));
    } catch (error) {
      logger.error('Redis set error:', error);
    }
  }
}

// Real-time price update service
class PriceUpdateService {
  static async updatePrices() {
    try {
      logger.info('Fetching latest gold prices...');
      
      // Try to get from cache first
      let cachedPrices = await GoldAPIService.getCachedPrices();
      if (cachedPrices) {
        logger.info('Using cached prices');
        io.emit('priceUpdate', cachedPrices);
        return cachedPrices;
      }

      // Fetch from all available APIs
      const apiResults = await GoldAPIService.fetchAllSources();
      
      if (apiResults.length === 0) {
        throw new Error('All APIs failed to respond');
      }

      // Process and normalize data
      const processedData = this.processAPIData(apiResults);
      
      // Save to database
      await this.savePricesToDB(processedData);
      
      // Cache the results
      await GoldAPIService.setCachedPrices(processedData);
      
      // Emit to connected clients
      io.emit('priceUpdate', processedData);
      
      // Check for price alerts
      await this.checkPriceAlerts(processedData);
      
      logger.info(`Updated prices for ${processedData.length} commodities`);
      return processedData;
      
    } catch (error) {
      logger.error('Price update error:', error);
      
      // Fallback to mock data if all APIs fail
      const mockData = this.generateMockData();
      io.emit('priceUpdate', mockData);
      return mockData;
    }
  }

  static processAPIData(apiResults) {
    const commodities = [
      { symbol: 'XAU', name: 'Gold', unit: '10g', indianUnit: 'per 10 grams' },
      { symbol: 'XAG', name: 'Silver', unit: 'kg', indianUnit: 'per kg' },
      { symbol: 'XPT', name: 'Platinum', unit: 'oz', indianUnit: 'per oz' },
      { symbol: 'XPD', name: 'Palladium', unit: 'oz', indianUnit: 'per oz' }
    ];

    return commodities.map(commodity => {
      let price = 0;
      let source = 'fallback';
      let currency = 'INR';
      
      // Try to get price from available API results (prioritize Indian prices)
      for (const result of apiResults) {
        if (result.data[commodity.symbol]) {
          if (result.currency === 'INR') {
            price = result.data[commodity.symbol];
            currency = 'INR';
            source = result.source;
            break;
          } else if (price === 0) {
            // Fallback to USD prices if no INR prices available
            price = 1 / result.data[commodity.symbol]; // Convert to price per ounce
            currency = 'USD';
            source = result.source;
          }
        }
      }

      // Generate realistic Indian market data if no API data available
      if (price === 0) {
        const basePricesINR = { XAU: 6850, XAG: 82500, XPT: 7034625, XPD: 123643 };
        price = basePricesINR[commodity.symbol] * (0.98 + Math.random() * 0.04);
        currency = 'INR';
      }

      const change24h = (Math.random() - 0.5) * price * 0.05; // ±2.5% change
      const changePercent24h = (change24h / price) * 100;

      return {
        symbol: commodity.symbol,
        name: commodity.name,
        price: Math.round(price * 100) / 100,
        currency: currency,
        unit: commodity.unit,
        indianUnit: commodity.indianUnit,
        change24h: Math.round(change24h * 100) / 100,
        changePercent24h: Math.round(changePercent24h * 100) / 100,
        high24h: Math.round((price + Math.abs(change24h) * 0.5) * 100) / 100,
        low24h: Math.round((price - Math.abs(change24h) * 0.5) * 100) / 100,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        marketCap: Math.floor(price * (Math.random() * 1000000 + 500000)),
        timestamp: new Date(),
        source,
        isIndianMarket: currency === 'INR'
      };
    });
  }

  static generateMockData() {
    const commodities = [
      { symbol: 'XAU', name: 'Gold', basePrice: 2000 },
      { symbol: 'XAG', name: 'Silver', basePrice: 25 },
      { symbol: 'XPT', name: 'Platinum', basePrice: 1000 },
      { symbol: 'XPD', name: 'Palladium', basePrice: 1500 }
    ];

    return commodities.map(commodity => {
      const price = commodity.basePrice * (0.95 + Math.random() * 0.1);
      const change24h = (Math.random() - 0.5) * price * 0.05;
      const changePercent24h = (change24h / price) * 100;

      return {
        symbol: commodity.symbol,
        name: commodity.name,
        price: Math.round(price * 100) / 100,
        currency: 'USD',
        unit: 'oz',
        change24h: Math.round(change24h * 100) / 100,
        changePercent24h: Math.round(changePercent24h * 100) / 100,
        high24h: Math.round((price + Math.abs(change24h) * 0.5) * 100) / 100,
        low24h: Math.round((price - Math.abs(change24h) * 0.5) * 100) / 100,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        marketCap: Math.floor(price * (Math.random() * 1000000 + 500000)),
        timestamp: new Date(),
        source: 'mock'
      };
    });
  }

  static async savePricesToDB(pricesData) {
    try {
      for (const priceData of pricesData) {
        await GoldPrice.findOneAndUpdate(
          { symbol: priceData.symbol },
          priceData,
          { upsert: true, new: true }
        );
      }
    } catch (error) {
      logger.error('Database save error:', error);
    }
  }

  static async checkPriceAlerts(pricesData) {
    try {
      const activeAlerts = await UserAlert.find({ isActive: true });
      
      for (const alert of activeAlerts) {
        const priceData = pricesData.find(p => p.symbol === alert.symbol);
        if (!priceData) continue;

        const shouldTrigger = (
          (alert.type === 'above' && priceData.price >= alert.targetPrice) ||
          (alert.type === 'below' && priceData.price <= alert.targetPrice)
        );

        if (shouldTrigger) {
          // Trigger alert
          alert.isActive = false;
          alert.triggeredAt = new Date();
          await alert.save();

          // Emit alert to user
          io.to(`user_${alert.userId}`).emit('priceAlert', {
            symbol: alert.symbol,
            currentPrice: priceData.price,
            targetPrice: alert.targetPrice,
            type: alert.type
          });

          logger.info(`Price alert triggered for user ${alert.userId}: ${alert.symbol} ${alert.type} ${alert.targetPrice}`);
        }
      }
    } catch (error) {
      logger.error('Price alert check error:', error);
    }
  }
}

// API Routes

// Get current gold prices
app.get('/api/gold/prices', async (req, res) => {
  try {
    const prices = await PriceUpdateService.updatePrices();
    res.json({
      success: true,
      data: prices,
      timestamp: new Date()
    });
  } catch (error) {
    logger.error('Get prices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prices',
      error: error.message
    });
  }
});

// Get historical data
app.get('/api/gold/historical/:symbol', async (req, res) => {
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

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Try to get from database first
    let historicalData = await HistoricalData.find({
      symbol,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // If no data in DB, generate mock historical data
    if (historicalData.length === 0) {
      historicalData = this.generateMockHistoricalData(symbol, days);
    }

    res.json({
      success: true,
      data: historicalData,
      symbol,
      period
    });
  } catch (error) {
    logger.error('Get historical data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical data',
      error: error.message
    });
  }
});

// Generate mock historical data
function generateMockHistoricalData(symbol, days) {
  const basePrices = { XAU: 2000, XAG: 25, XPT: 1000, XPD: 1500 };
  const basePrice = basePrices[symbol] || 1000;
  
  const data = [];
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = 0.02; // 2% daily volatility
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    
    data.push({
      symbol,
      date,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.floor(Math.random() * 100000) + 10000,
      source: 'mock'
    });
    
    currentPrice = close;
  }
  
  return data;
}

// User alert management
app.post('/api/gold/alerts', authMiddleware, async (req, res) => {
  try {
    const { symbol, type, targetPrice } = req.body;
    
    const alert = new UserAlert({
      userId: req.user.userId,
      symbol,
      type,
      targetPrice
    });
    
    await alert.save();
    
    res.json({
      success: true,
      message: 'Alert created successfully',
      alert
    });
  } catch (error) {
    logger.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create alert',
      error: error.message
    });
  }
});

app.get('/api/gold/alerts', authMiddleware, async (req, res) => {
  try {
    const alerts = await UserAlert.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    logger.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alerts',
      error: error.message
    });
  }
});

app.delete('/api/gold/alerts/:id', authMiddleware, async (req, res) => {
  try {
    await UserAlert.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    logger.error('Delete alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete alert',
      error: error.message
    });
  }
});

// Market analysis and AI predictions
app.get('/api/gold/analysis/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Get recent price data
    const recentPrices = await GoldPrice.find({ symbol }).sort({ timestamp: -1 }).limit(30);
    
    if (recentPrices.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No price data available for analysis'
      });
    }

    // Simple trend analysis
    const prices = recentPrices.map(p => p.price).reverse();
    const trend = this.calculateTrend(prices);
    const volatility = this.calculateVolatility(prices);
    const support = Math.min(...prices);
    const resistance = Math.max(...prices);
    
    // Generate prediction (mock AI analysis)
    const prediction = this.generatePrediction(symbol, trend, volatility);
    
    res.json({
      success: true,
      data: {
        symbol,
        trend,
        volatility,
        support,
        resistance,
        prediction,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    logger.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate analysis',
      error: error.message
    });
  }
});

// Helper functions for analysis
function calculateTrend(prices) {
  if (prices.length < 2) return 'neutral';
  
  const recent = prices.slice(-5);
  const older = prices.slice(-10, -5);
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  if (change > 2) return 'bullish';
  if (change < -2) return 'bearish';
  return 'neutral';
}

function calculateVolatility(prices) {
  if (prices.length < 2) return 0;
  
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i-1]) / prices[i-1]);
  }
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance) * 100; // Convert to percentage
}

function generatePrediction(symbol, trend, volatility) {
  const predictions = {
    bullish: [
      'Strong upward momentum expected to continue',
      'Technical indicators suggest further gains',
      'Market sentiment remains positive'
    ],
    bearish: [
      'Downward pressure likely to persist',
      'Technical indicators suggest further decline',
      'Market sentiment turning negative'
    ],
    neutral: [
      'Sideways movement expected in near term',
      'Market consolidation phase',
      'Mixed signals from technical indicators'
    ]
  };
  
  const trendPredictions = predictions[trend] || predictions.neutral;
  return trendPredictions[Math.floor(Math.random() * trendPredictions.length)];
}

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('subscribe', (data) => {
    if (data.userId) {
      socket.join(`user_${data.userId}`);
      logger.info(`User ${data.userId} subscribed to updates`);
    }
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Scheduled tasks
// Update prices every 30 seconds
cron.schedule('*/30 * * * * *', async () => {
  await PriceUpdateService.updatePrices();
});

// Clean up old data every hour
cron.schedule('0 * * * *', async () => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    await GoldPrice.deleteMany({ timestamp: { $lt: oneWeekAgo } });
    logger.info('Cleaned up old price data');
  } catch (error) {
    logger.error('Cleanup error:', error);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Gold Dashboard API is running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    redis.disconnect();
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 Gold Dashboard API server running on port ${PORT}`);
  logger.info(`📊 WebSocket server ready for real-time updates`);
  
  // Initial price update
  setTimeout(() => {
    PriceUpdateService.updatePrices();
  }, 2000);
});

export default app;
