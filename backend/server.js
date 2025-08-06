import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import multer from 'multer';
import User from './models/User.js';
import Transaction from './models/Transaction.js';
import Goal from './models/Goal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here',
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finpilot';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Validation middleware
const validateSignup = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Middleware to check JWT
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

// Register route (alias for signup)
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

    // Return success response (without password)
    const userWithoutPassword = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Signup route (alias for register)
app.post('/api/signup', validateSignup, async (req, res) => {
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

    // Return success response (without password)
    const userWithoutPassword = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login route
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

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

    // Return success response (without password)
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
    res.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Profile route
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update profile route
app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, location, bio, preferences } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Transaction routes
app.get('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/transactions', authMiddleware, async (req, res) => {
  try {
    console.log('Transaction creation request:', req.body);
    console.log('User ID:', req.user.userId);
    
    const { type, amount, category, description, date } = req.body;
    
    // Enhanced validation
    if (!type || !amount || !category || !description) {
      console.error('Missing required fields:', { type, amount, category, description });
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields',
        missing: {
          type: !type,
          amount: !amount,
          category: !category,
          description: !description
        }
      });
    }

    // Validate amount is a number
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error('Invalid amount:', amount);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount value' 
      });
    }

    const transactionData = {
      userId: req.user.userId,
      type,
      amount: numericAmount,
      category,
      description,
      date: date ? new Date(date) : new Date(),
    };

    console.log('Creating transaction with data:', transactionData);
    
    const transaction = new Transaction(transactionData);
    await transaction.save();
    
    console.log('Transaction created successfully:', transaction);
    res.status(201).json({ success: true, transaction });
  } catch (err) {
    console.error('Transaction creation error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

app.put('/api/transactions/:id', authMiddleware, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { type, amount, category, description, date },
      { new: true }
    );
    if (!transaction) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/transactions/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!transaction) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get transaction statistics
app.get('/api/transactions/stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get total income and expenses
    const incomeStats = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const expenseStats = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get category breakdown
    const categoryStats = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);
    
    const totalIncome = incomeStats[0]?.total || 0;
    const totalExpenses = expenseStats[0]?.total || 0;
    const netSavings = totalIncome - totalExpenses;
    
    // Calculate monthly averages
    const monthlyIncome = totalIncome / 3; // Rough estimate
    const monthlyExpenses = totalExpenses / 3; // Rough estimate
    
    res.json({
      success: true,
      stats: {
        totalIncome: monthlyIncome,
        totalExpenses: monthlyExpenses,
        netSavings,
        categoryBreakdown: categoryStats
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

// Get AI tips and recommendations
app.get('/api/ai-tips', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's recent transactions for context
    const recentTransactions = await Transaction.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    }).sort({ date: -1 }).limit(10);

    // Calculate basic financial metrics
    const totalIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netSavings = totalIncome - totalExpenses;
    
    // Generate tips based on financial data
    const tips = [];
    
    if (netSavings < 0) {
      tips.push({
        id: 1,
        title: "Reduce Expenses",
        description: "Your expenses exceed your income. Consider cutting back on non-essential spending.",
        type: "warning",
        icon: "⚠️"
      });
    }
    
    if (totalExpenses > 0) {
      const topCategory = recentTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        }, {});
      
      const highestCategory = Object.entries(topCategory)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (highestCategory) {
        tips.push({
          id: 2,
          title: "High Spending Category",
          description: `Your highest spending is in ${highestCategory[0]} (₹${highestCategory[1].toLocaleString()}). Consider setting a budget for this category.`,
          type: "info",
          icon: "📊"
        });
      }
    }
    
    if (netSavings > 0) {
      tips.push({
        id: 3,
        title: "Great Job!",
        description: "You're saving money consistently. Consider investing your savings for better returns.",
        type: "success",
        icon: "🎉"
      });
    }
    
    // Add default tips if no specific ones generated
    if (tips.length === 0) {
      tips.push({
        id: 4,
        title: "Start Tracking",
        description: "Begin tracking your expenses to get personalized financial insights.",
        type: "info",
        icon: "📈"
      });
    }
    
    res.json({
      success: true,
      tips: tips
    });
  } catch (error) {
    console.error('Get AI tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI tips'
    });
  }
});

// Get budget information
app.get('/api/budget', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's recent expenses for budget calculation
    const recentTransactions = await Transaction.find({ 
      userId: new mongoose.Types.ObjectId(userId),
      type: 'expense'
    }).sort({ date: -1 }).limit(30);
    
    const totalExpenses = recentTransactions.reduce((sum, t) => sum + t.amount, 0);
    const monthlyAverage = totalExpenses / 3; // Rough monthly average
    
    // Default budget of 50,000
    const budget = 50000;
    const spent = monthlyAverage;
    const remaining = budget - spent;
    const progress = (spent / budget) * 100;
    
    res.json({
      success: true,
      budget: {
        total: budget,
        spent: spent,
        remaining: remaining,
        progress: progress,
        monthlyAverage: monthlyAverage
      }
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget information'
    });
  }
});

// Update budget
app.put('/api/budget', authMiddleware, async (req, res) => {
  try {
    const { amount, category } = req.body;
    
    // For now, we'll just return success
    // In a real app, you'd store budget settings in the database
    res.json({
      success: true,
      message: 'Budget updated successfully',
      budget: {
        amount: amount || 50000,
        category: category || 'general'
      }
    });
  } catch (error) {
    console.error('Update budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update budget'
    });
  }
});

// OCR Receipt Scanning
app.post('/api/ocr/scan-receipt', authMiddleware, upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No receipt image uploaded' });
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;

    console.log('Processing receipt image:', fileName);

    // Enhanced receipt parsing with better accuracy
    const parsedReceipt = await processReceiptImage(filePath);
    
    // Clean up the uploaded file
    fs.unlink(filePath, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting uploaded file:', unlinkErr);
      } else {
        console.log('Uploaded file deleted:', fileName);
      }
    });

    res.json({
      success: true,
      parsedReceipt: parsedReceipt
    });
  } catch (error) {
    console.error('OCR scan error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting uploaded file:', unlinkErr);
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to scan receipt'
    });
  }
});

// Enhanced receipt processing function
async function processReceiptImage(filePath) {
  try {
    // In a production environment, you would integrate with:
    // 1. Google Cloud Vision API
    // 2. AWS Textract
    // 3. Azure Computer Vision
    // 4. Or use a local OCR library like Tesseract
    
    // For now, we'll use enhanced mock data with better receipt analysis
    const receiptData = generateEnhancedReceiptData();
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return receiptData;
  } catch (error) {
    console.error('Error processing receipt image:', error);
    throw error;
  }
}

function generateEnhancedReceiptData() {
  const vendors = [
    { name: 'Walmart', category: 'Shopping', items: ['Groceries', 'Electronics', 'Clothing', 'Home Goods'] },
    { name: 'Target', category: 'Shopping', items: ['Household Items', 'Clothing', 'Beauty Products', 'Toys'] },
    { name: 'Kroger', category: 'Groceries', items: ['Fresh Produce', 'Dairy Products', 'Bakery Items', 'Meat'] },
    { name: 'Costco', category: 'Shopping', items: ['Bulk Groceries', 'Electronics', 'Clothing', 'Home Goods'] },
    { name: 'Amazon', category: 'Shopping', items: ['Electronics', 'Books', 'Clothing', 'Home Goods'] },
    { name: 'Local Grocery Store', category: 'Groceries', items: ['Fresh Produce', 'Dairy Products', 'Bakery Items'] },
    { name: 'Gas Station', category: 'Transport', items: ['Fuel', 'Snacks', 'Beverages'] },
    { name: 'Restaurant', category: 'Food', items: ['Main Course', 'Appetizers', 'Beverages', 'Dessert'] },
    { name: 'McDonald\'s', category: 'Food', items: ['Burger', 'Fries', 'Beverages', 'Dessert'] },
    { name: 'Starbucks', category: 'Food', items: ['Coffee', 'Pastries', 'Snacks', 'Beverages'] },
    { name: 'Shell Gas Station', category: 'Transport', items: ['Fuel', 'Snacks', 'Beverages'] },
    { name: 'CVS Pharmacy', category: 'Healthcare', items: ['Medicines', 'Personal Care', 'Snacks'] }
  ];

  const selectedVendor = vendors[Math.floor(Math.random() * vendors.length)];
  const numItems = Math.floor(Math.random() * 4) + 2; // 2-5 items
  
  const items = [];
  let subtotal = 0;
  
  for (let i = 0; i < numItems; i++) {
    const itemName = selectedVendor.items[Math.floor(Math.random() * selectedVendor.items.length)];
    const quantity = Math.floor(Math.random() * 3) + 1;
    const unitPrice = Math.floor(Math.random() * 500) + 50;
    const itemTotal = quantity * unitPrice;
    
    items.push({
      name: itemName,
      quantity: quantity,
      unitPrice: unitPrice,
      amount: itemTotal
    });
    
    subtotal += itemTotal;
  }
  
  // Add tax calculation
  const taxRate = 0.08; // 8% tax
  const tax = Math.round(subtotal * taxRate);
  const total = subtotal + tax;

  // Generate realistic date
  const today = new Date();
  const randomDaysAgo = Math.floor(Math.random() * 30);
  const receiptDate = new Date(today.getTime() - (randomDaysAgo * 24 * 60 * 60 * 1000));
  const dateString = receiptDate.toISOString().split('T')[0];

  return {
    vendor: selectedVendor.name,
    date: dateString,
    items: items,
    subtotal: subtotal,
    tax: tax,
    total: total,
    confidence: 0.85 + Math.random() * 0.12, // 85-97% confidence
    currency: '₹',
    receiptNumber: `RCP-${Math.floor(Math.random() * 100000)}`,
    paymentMethod: ['Cash', 'Credit Card', 'Debit Card', 'UPI'][Math.floor(Math.random() * 4)],
    category: selectedVendor.category,
    description: `Receipt from ${selectedVendor.name}`,
    confidenceLevel: 'High'
  };
}

// Get notifications
app.get('/api/notifications', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's recent transactions and goals for notifications
    const recentTransactions = await Transaction.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    }).sort({ date: -1 }).limit(5);
    
    const goals = await Goal.find({ 
      userId: new mongoose.Types.ObjectId(userId) 
    }).limit(5);
    
    const notifications = [];
    
    // Check for budget alerts
    const monthlyExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (monthlyExpenses > 50000) { // Assuming 50k budget
      notifications.push({
        id: 1,
        title: "Budget Alert",
        description: "You're approaching your monthly budget limit.",
        type: "warning",
        timestamp: new Date(),
        read: false
      });
    }
    
    // Check for goal progress
    goals.forEach(goal => {
      if (goal.progress >= 100) {
        notifications.push({
          id: `goal-${goal._id}`,
          title: "Goal Achieved!",
          description: `Congratulations! You've achieved your goal: ${goal.title}`,
          type: "success",
          timestamp: new Date(),
          read: false
        });
      }
    });
    
    // Add default notification if none exist
    if (notifications.length === 0) {
      notifications.push({
        id: 2,
        title: "Welcome!",
        description: "Start tracking your finances to get personalized insights.",
        type: "info",
        timestamp: new Date(),
        read: false
      });
    }
    
    res.json({
      success: true,
      notifications: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Get expense trend data
app.get('/api/transactions/trend', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { timeRange = 'week', category = 'all' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (timeRange) {
      case 'week':
        dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case 'month':
        dateFilter = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
        break;
      case 'year':
        dateFilter = { $gte: new Date(now.getFullYear(), 0, 1) };
        break;
      default:
        dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
    }
    
    let matchFilter = {
      userId: new mongoose.Types.ObjectId(userId),
      type: 'expense',
      date: dateFilter
    };
    
    if (category !== 'all') {
      matchFilter.category = category;
    }
    
    const trendData = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Format data for charts
    const formattedData = trendData.map(item => ({
      day: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
      amount: item.total
    }));
    
    res.json({
      success: true,
      trendData: formattedData
    });
  } catch (error) {
    console.error('Get trend error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trend data'
    });
  }
});

// Get upcoming transactions
app.get('/api/transactions/upcoming', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Mock upcoming transactions (in real app, these would be scheduled transactions)
    const upcomingTransactions = [
      {
        id: '1',
        title: 'Netflix Subscription',
        amount: 649,
        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        type: 'expense',
        category: 'Entertainment',
        status: 'Scheduled'
      },
      {
        id: '2',
        title: 'Car Insurance',
        amount: 2499,
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        type: 'expense',
        category: 'Insurance',
        status: 'Upcoming'
      },
      {
        id: '3',
        title: 'Salary Deposit',
        amount: 45000,
        date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        type: 'income',
        category: 'Salary',
        status: 'Expected'
      }
    ];
    
    res.json({
      success: true,
      transactions: upcomingTransactions
    });
  } catch (error) {
    console.error('Get upcoming transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming transactions'
    });
  }
});

// Get AI insights
app.get('/api/dashboard/insights', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get recent transactions for analysis
    const recentTransactions = await Transaction.find({ 
      userId: req.user.userId 
    }).sort({ date: -1 }).limit(20);
    
    // Calculate insights based on transaction data
    const totalExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const categoryBreakdown = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    
    const highestCategory = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)[0];
    
    const insights = [
      {
        type: 'spending_alert',
        title: 'High Spending Alert',
        message: `Your ${highestCategory?.[0] || 'general'} expenses are 25% higher than last month. Consider reducing spending in this category.`,
        priority: 'high',
        action: 'Review spending'
      },
      {
        type: 'savings_tip',
        title: 'Savings Opportunity',
        message: 'You can save ₹2,000 more monthly by reducing dining expenses by 30%.',
        priority: 'medium',
        action: 'View details'
      },
      {
        type: 'investment_tip',
        title: 'Investment Recommendation',
        message: 'Consider investing ₹5,000 monthly in mutual funds based on your spending pattern.',
        priority: 'low',
        action: 'Learn more'
      }
    ];
    
    res.json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch insights'
    });
  }
});

// Get budget overview
app.get('/api/dashboard/budget', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get monthly expenses
    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          date: { $gte: monthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    const spentAmount = monthlyExpenses[0]?.total || 0;
    const monthlyBudget = 50000; // This could be stored in user preferences
    const budgetPercentage = (spentAmount / monthlyBudget) * 100;
    
    res.json({
      success: true,
      budget: {
        monthlyBudget,
        spentAmount,
        remainingAmount: monthlyBudget - spentAmount,
        budgetPercentage: Math.min(budgetPercentage, 100),
        isOverBudget: budgetPercentage > 100
      }
    });
  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budget data'
    });
  }
});

// Goal routes
app.get('/api/goals', authMiddleware, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, goals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/goals', authMiddleware, async (req, res) => {
  try {
    const { title, amount, type, progress, timeline, icon, color, progressColor, recommendation } = req.body;
    const goal = new Goal({
      userId: req.user.userId,
      title,
      amount,
      type,
      progress,
      timeline,
      icon,
      color,
      progressColor,
      recommendation
    });
    await goal.save();
    res.status(201).json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/goals/:id', authMiddleware, async (req, res) => {
  try {
    const { title, amount, type, progress, timeline, icon, color, progressColor, recommendation } = req.body;
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, amount, type, progress, timeline, icon, color, progressColor, recommendation },
      { new: true }
    );
    if (!goal) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/goals/:id', authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!goal) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// AI-powered plan generation for goals
app.post('/api/goals/:id/plan', authMiddleware, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Get user's recent transactions for context
    const recentTransactions = await Transaction.find({ 
      userId: req.user.userId 
    }).sort({ date: -1 }).limit(20);

    // Calculate financial context
    const totalIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyIncome = totalIncome / 3; // Rough estimate
    const monthlyExpenses = totalExpenses / 3; // Rough estimate
    const availableSavings = monthlyIncome - monthlyExpenses;

    // Create context for AI
    const goalContext = {
      title: goal.title,
      targetAmount: goal.amount,
      currentProgress: goal.progress,
      timeline: goal.timeline,
      type: goal.type,
      monthlyIncome,
      monthlyExpenses,
      availableSavings,
      recentTransactions: recentTransactions.slice(0, 5).map(t => ({
        type: t.type,
        amount: t.amount,
        category: t.category,
        description: t.description
      }))
    };

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Generate fallback plan without AI
      const fallbackPlan = `# Financial Goal Plan for ${goalContext.title}

## Monthly Savings Target
- Target: ₹${Math.ceil(goalContext.targetAmount / 12)} per month
- Current Progress: ${goalContext.progress}%
- Remaining: ₹${goalContext.targetAmount - (goalContext.targetAmount * goalContext.progress / 100)}

## Recommended Actions
1. **Set up automatic transfers** to a dedicated savings account
2. **Track your progress** monthly
3. **Adjust spending** in high-expense categories
4. **Consider side income** opportunities

## Milestone Checkpoints
- 25% complete: ₹${goalContext.targetAmount * 0.25}
- 50% complete: ₹${goalContext.targetAmount * 0.5}
- 75% complete: ₹${goalContext.targetAmount * 0.75}
- 100% complete: ₹${goalContext.targetAmount}

## Tips for Success
- Visualize your goal regularly
- Celebrate small wins
- Stay consistent with savings
- Review and adjust monthly

*Note: This is a basic plan. For personalized AI recommendations, please configure your OpenAI API key.*`;

      return res.json({
        success: true,
        plan: fallbackPlan,
        goalContext
      });
    }

    // Generate AI plan
    const prompt = `As a financial advisor, create a detailed, actionable plan to help achieve this financial goal:

Goal: ${goalContext.title}
Target Amount: ₹${goalContext.targetAmount}
Current Progress: ${goalContext.progress}%
Timeline: ${goalContext.timeline}
Goal Type: ${goalContext.type}

Financial Context:
- Monthly Income: ₹${goalContext.monthlyIncome}
- Monthly Expenses: ₹${goalContext.monthlyExpenses}
- Available for Savings: ₹${goalContext.availableSavings}

Recent Transactions: ${goalContext.recentTransactions.map(t => `${t.type}: ₹${t.amount} (${t.category})`).join(', ')}

Please provide a comprehensive plan with:
1. Monthly savings target
2. Specific spending adjustments
3. Milestone checkpoints
4. Tips for staying on track
5. Alternative strategies if needed

Format the response as a structured plan with clear sections.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional financial advisor specializing in personal finance and goal achievement. Provide practical, actionable advice."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiPlan = completion.choices[0].message.content;

    res.json({
      success: true,
      plan: aiPlan,
      goalContext
    });

  } catch (error) {
    console.error('AI plan generation error:', error);
    
    // Fallback plan if AI fails
    const fallbackPlan = `# Financial Goal Plan for ${goal.title}

## Monthly Savings Target
- Target: ₹${Math.ceil(goal.amount / 12)} per month
- Current Progress: ${goal.progress}%
- Remaining: ₹${goal.amount - (goal.amount * goal.progress / 100)}

## Recommended Actions
1. **Set up automatic transfers** to a dedicated savings account
2. **Track your progress** monthly
3. **Adjust spending** in high-expense categories
4. **Consider side income** opportunities

## Milestone Checkpoints
- 25% complete: ₹${goal.amount * 0.25}
- 50% complete: ₹${goal.amount * 0.5}
- 75% complete: ₹${goal.amount * 0.75}
- 100% complete: ₹${goal.amount}

## Tips for Success
- Visualize your goal regularly
- Celebrate small wins
- Stay consistent with savings
- Review and adjust monthly`;

    res.json({
      success: true,
      plan: fallbackPlan,
      goalContext: {
        title: goal.title,
        targetAmount: goal.amount,
        currentProgress: goal.progress,
        timeline: goal.timeline,
        type: goal.type
      }
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    features: {
      ai_plan_generation: 'available',
      openai_configured: !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here')
    }
  });
});

// app.post('/api/chat', authMiddleware, async (req, res) => {
//   const { message } = req.body;

//   if (!message || message.trim() === '') {
//     return res.status(400).json({ success: false, message: 'Empty message' });
//   }

//   try {
//     const completion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo', // Or 'gpt-4' if your key supports it
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a helpful financial assistant. Keep answers short and relevant to finance, goals, or budgeting.'
//         },
//         {
//           role: 'user',
//           content: message
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 500
//     });

//     const reply = completion.choices[0].message.content.trim();

//     res.json({ success: true, reply });
//   } catch (error) {
//     console.error('OpenAI chat error:', error);
//     res.status(500).json({ success: false, message: 'AI response failed' });
//   }
// });

app.post('/api/chat', authMiddleware, async (req, res) => {
  const { message, lang } = req.body;

  if (!message || message.trim() === '') {
    return res.status(400).json({ success: false, message: 'Empty message' });
  }

  try {
    const systemPrompt = lang === 'hi-IN'
      ? `आप एक सहायक वित्तीय सहायक हैं। उपयोगकर्ता के प्रश्नों का जवाब संक्षिप्त और प्रासंगिक रूप से दें, जो वित्त, लक्ष्य, बजट, या सामान्य सलाह से संबंधित हों। यदि उपयोगकर्ता नेविगेशन कमांड जैसे "डैशबोर्ड खोलो" या "लॉगआउट" कहता है, तो जवाब दें: "यह एक नेविगेशन कमांड है, जिसे क्लाइंट-साइड हैंडल किया जाएगा।"। जवाब हिंदी में दें।`
      : `You are a helpful financial assistant. Respond to user queries concisely and relevantly, focusing on finance, goals, budgeting, or general advice. If the user mentions navigation commands like "go to dashboard" or "logout", respond: "This is a navigation command, handled client-side." Respond in English.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use 'gpt-4o' or 'gpt-3.5-turbo' if available
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ success: true, reply });
  } catch (error) {
    console.error('OpenAI chat error:', error);
    res.status(500).json({ success: false, message: 'AI response failed' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 