import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import Redis from 'ioredis';

// Initialize Express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "https://futurepath-ai.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'futurepath_ai',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryDelayOnFailover: 100,
  enableOfflineQueue: false,
});

// Middleware
app.set('trust proxy', 1); // Trust proxy for Render
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "https://futurepath-ai.netlify.app"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'futurepath-ai-secret-key';

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// ===============================
// AUTHENTICATION ROUTES
// ===============================

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName, dateOfBirth, panNumber } = req.body;
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR phone = $2',
      [email, phone]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, phone, password_hash, first_name, last_name, date_of_birth, pan_number)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, email, first_name, last_name`,
      [email, phone, passwordHash, firstName, lastName, dateOfBirth, panNumber]
    );
    
    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        kycStatus: user.kyc_status
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===============================
// USER PROFILE ROUTES
// ===============================

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.*, up.* FROM users u 
       LEFT JOIN user_profiles up ON u.id = up.user_id 
       WHERE u.id = $1`,
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        dateOfBirth: user.date_of_birth,
        kycStatus: user.kyc_status,
        riskProfile: user.risk_profile,
        investmentExperience: user.investment_experience,
        annualIncome: user.annual_income,
        profilePicture: user.profile_picture,
        bio: user.bio,
        investmentGoals: user.investment_goals,
        riskTolerance: user.risk_tolerance
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, bio, investmentGoals, riskTolerance } = req.body;
    
    // Update user table
    await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3`,
      [firstName, lastName, req.user.id]
    );
    
    // Update or insert user profile
    await pool.query(
      `INSERT INTO user_profiles (user_id, bio, investment_goals, risk_tolerance, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) DO UPDATE SET
       bio = EXCLUDED.bio,
       investment_goals = EXCLUDED.investment_goals,
       risk_tolerance = EXCLUDED.risk_tolerance,
       updated_at = CURRENT_TIMESTAMP`,
      [req.user.id, bio, investmentGoals, riskTolerance]
    );
    
    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===============================
// MARKET DATA ROUTES
// ===============================

// Get stock data
app.get('/api/market/stocks', async (req, res) => {
  try {
    const { symbol, limit = 50 } = req.query;
    
    let query = 'SELECT * FROM stocks WHERE is_active = true';
    let params = [];
    
    if (symbol) {
      query += ' AND symbol ILIKE $1';
      params.push(`%${symbol}%`);
    }
    
    query += ' ORDER BY market_cap DESC LIMIT $' + (params.length + 1);
    params.push(parseInt(limit));
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Stocks fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stock prices
app.get('/api/market/stocks/:symbol/prices', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1D', limit = 100 } = req.query;
    
    // Get stock ID
    const stockResult = await pool.query(
      'SELECT id FROM stocks WHERE symbol = $1',
      [symbol.toUpperCase()]
    );
    
    if (stockResult.rows.length === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    const stockId = stockResult.rows[0].id;
    
    // Calculate time range based on timeframe
    let timeRange = '1 day';
    switch (timeframe) {
      case '1W': timeRange = '1 week'; break;
      case '1M': timeRange = '1 month'; break;
      case '3M': timeRange = '3 months'; break;
      case '1Y': timeRange = '1 year'; break;
    }
    
    const result = await pool.query(
      `SELECT timestamp, open_price, high_price, low_price, close_price, volume
       FROM stock_prices 
       WHERE stock_id = $1 AND timestamp >= NOW() - INTERVAL '${timeRange}'
       ORDER BY timestamp DESC 
       LIMIT $2`,
      [stockId, parseInt(limit)]
    );
    
    res.json({
      success: true,
      symbol: symbol.toUpperCase(),
      timeframe,
      data: result.rows.reverse()
    });
  } catch (error) {
    console.error('Stock prices fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get gold prices
app.get('/api/market/gold/prices', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT metal_type, purity, unit, price, currency, timestamp
       FROM gold_prices 
       WHERE timestamp >= NOW() - INTERVAL '1 day'
       ORDER BY timestamp DESC`
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Gold prices fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===============================
// TRADING ROUTES
// ===============================

// Place order
app.post('/api/trading/orders', authenticateToken, async (req, res) => {
  try {
    const {
      instrumentType,
      instrumentId,
      symbol,
      transactionType,
      quantity,
      price,
      orderType = 'market',
      validity = 'day'
    } = req.body;
    
    // Get user's trading account
    const accountResult = await pool.query(
      'SELECT id FROM trading_accounts WHERE user_id = $1 AND status = $2',
      [req.user.id, 'active']
    );
    
    if (accountResult.rows.length === 0) {
      return res.status(400).json({ error: 'No active trading account found' });
    }
    
    const tradingAccountId = accountResult.rows[0].id;
    
    // Calculate total amount
    const totalAmount = quantity * price;
    
    // Create order
    const result = await pool.query(
      `INSERT INTO orders (
        user_id, trading_account_id, order_type, instrument_type, instrument_id,
        symbol, transaction_type, quantity, price, order_status, order_side,
        order_category, validity, total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, order_status, total_amount`,
      [
        req.user.id, tradingAccountId, instrumentType, instrumentType, instrumentId,
        symbol, transactionType, quantity, price, 'pending', transactionType,
        'regular', validity, totalAmount
      ]
    );
    
    const order = result.rows[0];
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: order.id,
        status: order.order_status,
        totalAmount: order.total_amount
      }
    });
  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user orders
app.get('/api/trading/orders', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let query = `
      SELECT id, order_type, symbol, transaction_type, quantity, price,
             order_status, total_amount, created_at
      FROM orders 
      WHERE user_id = $1
    `;
    let params = [req.user.id];
    
    if (status) {
      query += ' AND order_status = $2';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1);
    params.push(parseInt(limit));
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Orders fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user holdings
app.get('/api/trading/holdings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT instrument_type, symbol, quantity, average_price, current_price,
              market_value, unrealized_pnl, realized_pnl
       FROM holdings 
       WHERE user_id = $1 AND quantity > 0
       ORDER BY market_value DESC`,
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Holdings fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===============================
// AI PREDICTION ROUTES
// ===============================

// Get AI stock prediction
app.post('/api/ai/predictions/stock', authenticateToken, async (req, res) => {
  try {
    const { symbol, timeframe = '1M' } = req.body;
    
    // Get stock data
    const stockResult = await pool.query(
      'SELECT id FROM stocks WHERE symbol = $1',
      [symbol.toUpperCase()]
    );
    
    if (stockResult.rows.length === 0) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    const stockId = stockResult.rows[0].id;
    
    // Get historical prices
    const priceResult = await pool.query(
      `SELECT close_price, volume, timestamp
       FROM stock_prices 
       WHERE stock_id = $1 
       ORDER BY timestamp DESC 
       LIMIT 30`,
      [stockId]
    );
    
    if (priceResult.rows.length === 0) {
      return res.status(404).json({ error: 'No price data available' });
    }
    
    const prices = priceResult.rows.map(row => row.close_price);
    const currentPrice = prices[0];
    
    // Simple technical analysis (replace with actual AI model)
    const sma20 = prices.slice(0, 20).reduce((sum, price) => sum + price, 0) / 20;
    const sma5 = prices.slice(0, 5).reduce((sum, price) => sum + price, 0) / 5;
    const volatility = calculateVolatility(prices);
    
    const trend = sma5 > sma20 ? 1 : -1;
    const predictedPrice = currentPrice * (1 + trend * volatility * 0.1);
    const confidence = Math.min(95, 70 + (volatility * 100));
    
    const prediction = {
      symbol: symbol.toUpperCase(),
      currentPrice,
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      confidence: Math.round(confidence),
      timeframe,
      trend: trend > 0 ? 'Bullish' : 'Bearish',
      riskLevel: volatility > 0.3 ? 'High' : volatility > 0.15 ? 'Medium' : 'Low',
      recommendation: trend > 0 ? 'BUY' : 'SELL',
      analysis: [
        `Technical indicators show ${trend > 0 ? 'positive' : 'negative'} momentum`,
        `Moving averages suggest ${trend > 0 ? 'upward' : 'downward'} trend`,
        `Volatility analysis indicates ${volatility > 0.2 ? 'high' : 'moderate'} risk`,
        `Price action shows ${trend > 0 ? 'strength' : 'weakness'}`
      ],
      timestamp: new Date()
    };
    
    // Save prediction to database
    await pool.query(
      `INSERT INTO ai_predictions (
        user_id, instrument_type, instrument_id, symbol, prediction_type,
        predicted_value, confidence_score, prediction_horizon, model_version
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        req.user.id, 'stock', stockId, symbol.toUpperCase(), 'price',
        predictedPrice, confidence, timeframe, 'v1.0'
      ]
    );
    
    res.json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('AI prediction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===============================
// GOALS & PLANNING ROUTES
// ===============================

// Create financial goal
app.post('/api/goals', authenticateToken, async (req, res) => {
  try {
    const {
      goalName,
      goalType,
      targetAmount,
      targetDate,
      priority = 1,
      riskProfile
    } = req.body;
    
    const result = await pool.query(
      `INSERT INTO financial_goals (
        user_id, goal_name, goal_type, target_amount, target_date, priority, risk_profile
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`,
      [req.user.id, goalName, goalType, targetAmount, targetDate, priority, riskProfile]
    );
    
    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      goalId: result.rows[0].id
    });
  } catch (error) {
    console.error('Goal creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user goals
app.get('/api/goals', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, goal_name, goal_type, target_amount, current_amount,
              target_date, priority, risk_profile, status, created_at
       FROM financial_goals 
       WHERE user_id = $1 
       ORDER BY priority, target_date`,
      [req.user.id]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Goals fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===============================
// WEBSOCKET FOR REAL-TIME DATA
// ===============================

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('subscribe-stock', (symbol) => {
    socket.join(`stock-${symbol}`);
    console.log(`Client ${socket.id} subscribed to ${symbol}`);
  });
  
  socket.on('unsubscribe-stock', (symbol) => {
    socket.leave(`stock-${symbol}`);
    console.log(`Client ${socket.id} unsubscribed from ${symbol}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Broadcast real-time price updates
const broadcastPriceUpdate = (symbol, priceData) => {
  io.to(`stock-${symbol}`).emit('price-update', {
    symbol,
    ...priceData,
    timestamp: new Date()
  });
};

// ===============================
// UTILITY FUNCTIONS
// ===============================

const calculateVolatility = (prices) => {
  if (prices.length < 2) return 0;
  
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i-1]) / prices[i-1]);
  }
  
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance);
};

// ===============================
// ERROR HANDLING
// ===============================

app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'FuturePath AI Server is running',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'FuturePath AI API is running',
    timestamp: new Date(),
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/user/profile',
      '/api/market/stocks',
      '/api/trading/orders'
    ]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FuturePath AI Server is running',
    timestamp: new Date(),
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// ===============================
// SERVER START
// ===============================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 FuturePath AI Server running on port ${PORT}`);
  console.log(`📊 WebSocket available at ws://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`📈 Health Check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server shut down successfully');
    process.exit(0);
  });
});

export default app;
