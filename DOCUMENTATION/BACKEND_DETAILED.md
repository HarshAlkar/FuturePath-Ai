# FuturePath AI - Backend Detailed Documentation

## 📋 Table of Contents
1. [Server Architecture](#server-architecture)
2. [Database Models](#database-models)
3. [API Endpoints](#api-endpoints)
4. [Authentication System](#authentication-system)
5. [AI Integration](#ai-integration)
6. [Error Handling](#error-handling)
7. [Security Implementation](#security-implementation)
8. [Performance Optimization](#performance-optimization)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Guide](#deployment-guide)

---

## 🏗️ Server Architecture

### Core Server Setup
```javascript
// server.js - Main server configuration
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
});

// Middleware
app.use(cors());
app.use(express.json());
```

### MongoDB Connection
```javascript
// MongoDB connection with error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finpilot';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
```

### Middleware Configuration
```javascript
// Validation middleware for user registration
const validateSignup = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

// Validation middleware for user login
const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// JWT Authentication middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
}
```

---

## 🗄️ Database Models

### User Model (User.js)
```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  membership: {
    type: String,
    default: 'Free Member',
  },
  avatar: {
    type: String,
    default: '👤',
  },
  bio: {
    type: String,
    default: '',
  },
  preferences: {
    currency: {
      type: String,
      default: 'INR',
    },
    language: {
      type: String,
      default: 'English',
    },
    timezone: {
      type: String,
      default: 'IST',
    },
    notifications: {
      type: Boolean,
      default: true,
    },
  },
  stats: {
    goalsCreated: {
      type: Number,
      default: 0,
    },
    goalsAchieved: {
      type: Number,
      default: 0,
    },
    totalSavings: {
      type: Number,
      default: 0,
    },
    daysActive: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
```

### Transaction Model (Transaction.js)
```javascript
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['income', 'expense'], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  category: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model('Transaction', transactionSchema);
```

### Goal Model (Goal.js)
```javascript
import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['Short-Term', 'Long-Term'], 
    required: true 
  },
  progress: { 
    type: Number, 
    default: 0 
  },
  timeline: { 
    type: String, 
    required: true 
  },
  icon: { 
    type: String, 
    default: '' 
  },
  color: { 
    type: String, 
    default: '' 
  },
  progressColor: { 
    type: String, 
    default: '' 
  },
  recommendation: { 
    type: String, 
    default: '' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Pre-save middleware to update updatedAt
goalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Goal', goalSchema);
```

---

## 🔌 API Endpoints

### Authentication Endpoints

#### User Registration
```javascript
// POST /api/register
app.post('/api/register', validateSignup, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

#### User Login
```javascript
// POST /api/login
app.post('/api/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

### Transaction Endpoints

#### Get User Transactions
```javascript
// GET /api/transactions
app.get('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId })
      .sort({ date: -1 })
      .limit(50);

    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
});
```

#### Add New Transaction
```javascript
// POST /api/transactions
app.post('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const { type, amount, category, description } = req.body;

    const newTransaction = new Transaction({
      userId: req.user.userId,
      type,
      amount,
      category,
      description
    });

    await newTransaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      transaction: newTransaction
    });
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add transaction'
    });
  }
});
```

#### Get Transaction Statistics
```javascript
// GET /api/transactions/stats
app.get('/api/transactions/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get current month's transactions
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const monthlyTransactions = await Transaction.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // Calculate statistics
    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = totalIncome - totalExpenses;

    res.json({
      success: true,
      stats: {
        totalIncome,
        totalExpenses,
        netSavings,
        monthlyIncome: totalIncome,
        monthlyExpenses: totalExpenses
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});
```

### Goal Endpoints

#### Get User Goals
```javascript
// GET /api/goals
app.get('/api/goals', authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      goals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goals'
    });
  }
});
```

#### Create New Goal
```javascript
// POST /api/goals
app.post('/api/goals', authMiddleware, async (req, res) => {
  try {
    const { title, amount, type, timeline } = req.body;

    const newGoal = new Goal({
      userId: req.user.userId,
      title,
      amount,
      type,
      timeline
    });

    await newGoal.save();

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      goal: newGoal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create goal'
    });
  }
});
```

---

## 🔐 Authentication System

### JWT Token Generation
```javascript
// Generate JWT token with user data
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id, 
      email: user.email,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};
```

### Password Hashing
```javascript
// Hash password with bcrypt
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
```

### Token Verification Middleware
```javascript
// Enhanced authentication middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};
```

---

## 🤖 AI Integration

### OpenAI Configuration
```javascript
// OpenAI setup with error handling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// AI Tips Generation
const generateAITips = async (userData, financialData) => {
  try {
    const prompt = `
      Based on the following user financial data, provide 3 personalized financial tips:
      
      User Profile:
      - Name: ${userData.name}
      - Monthly Income: ${financialData.monthlyIncome}
      - Monthly Expenses: ${financialData.monthlyExpenses}
      - Net Savings: ${financialData.netSavings}
      
      Please provide practical, actionable financial advice in JSON format with the following structure:
      {
        "tips": [
          {
            "title": "Tip Title",
            "description": "Detailed description",
            "category": "savings|investment|budgeting|debt",
            "priority": "high|medium|low"
          }
        ]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a financial advisor providing personalized financial advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('AI tips generation error:', error);
    return {
      tips: [
        {
          title: "Start Saving",
          description: "Consider setting aside 20% of your income for savings",
          category: "savings",
          priority: "high"
        }
      ]
    };
  }
};
```

### AI Analysis Endpoint
```javascript
// GET /api/ai-tips
app.get('/api/ai-tips', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user data
    const user = await User.findById(userId);
    
    // Get financial statistics
    const statsResponse = await getTransactionStats(userId);
    const financialData = statsResponse.stats;
    
    // Generate AI tips
    const aiTips = await generateAITips(user, financialData);
    
    res.json({
      success: true,
      tips: aiTips.tips
    });
  } catch (error) {
    console.error('AI tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI tips'
    });
  }
});
```

---

## ⚠️ Error Handling

### Global Error Handler
```javascript
// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  if (error.name === 'MongoError' && error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});
```

### Validation Error Handler
```javascript
// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};
```

---

## 🔒 Security Implementation

### Input Validation
```javascript
// Comprehensive input validation
const validateTransaction = [
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either income or expense'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters')
];

const validateGoal = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('type')
    .isIn(['Short-Term', 'Long-Term'])
    .withMessage('Type must be either Short-Term or Long-Term'),
  body('timeline')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Timeline must be between 1 and 50 characters')
];
```

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  }
});

// Apply rate limiting to auth endpoints
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);
```

### CORS Configuration
```javascript
// CORS configuration for security
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## ⚡ Performance Optimization

### Database Indexing
```javascript
// Add indexes to models for better performance
userSchema.index({ email: 1 });
transactionSchema.index({ userId: 1, date: -1 });
goalSchema.index({ userId: 1, createdAt: -1 });
```

### Query Optimization
```javascript
// Optimized transaction query with pagination
const getTransactionsWithPagination = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const transactions = await Transaction.find({ userId })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .lean(); // Use lean() for better performance
    
  const total = await Transaction.countDocuments({ userId });
  
  return {
    transactions,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};
```

### Caching Strategy
```javascript
// Simple in-memory caching for frequently accessed data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};
```

---

## 🧪 Testing Strategy

### Unit Tests
```javascript
// Example unit test for user registration
import request from 'supertest';
import app from '../server.js';

describe('User Registration', () => {
  test('should register a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.token).toBeDefined();
  });

  test('should fail with invalid email', async () => {
    const userData = {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/register')
      .send(userData)
      .expect(400);

    expect(response.body.success).toBe(false);
  });
});
```

### Integration Tests
```javascript
// Example integration test for transaction flow
describe('Transaction Flow', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Register and login user
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await request(app)
      .post('/api/register')
      .send(userData);

    token = registerResponse.body.token;
    userId = registerResponse.body.user.id;
  });

  test('should add transaction and update stats', async () => {
    const transactionData = {
      type: 'expense',
      amount: 100,
      category: 'Food',
      description: 'Lunch'
    };

    // Add transaction
    const addResponse = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send(transactionData)
      .expect(201);

    expect(addResponse.body.success).toBe(true);

    // Get stats
    const statsResponse = await request(app)
      .get('/api/transactions/stats')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(statsResponse.body.stats.totalExpenses).toBe(100);
  });
});
```

---

## 🚀 Deployment Guide

### Environment Variables
```env
# Production environment variables
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finpilot
JWT_SECRET=your-super-secure-jwt-secret-key
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://your-frontend-domain.com
CORS_ORIGIN=https://your-frontend-domain.com
```

### Production Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "build": "npm install --production"
  }
}
```

### Docker Configuration
```dockerfile
# Dockerfile for backend
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'futurepath-ai-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

---

## 📊 Monitoring & Logging

### Request Logging
```javascript
import morgan from 'morgan';

// Request logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      console.log(message.trim());
    }
  }
}));
```

### Error Logging
```javascript
// Enhanced error logging
const logError = (error, req) => {
  console.error({
    timestamp: new Date().toISOString(),
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userId: req.user?.userId,
    ip: req.ip
  });
};
```

### Health Check Endpoint
```javascript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

---

*This detailed backend documentation covers all aspects of the FuturePath AI backend implementation, including architecture, security, performance, and deployment strategies.* 