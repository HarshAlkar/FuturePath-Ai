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
    const { type, amount, category, description, date } = req.body;
    if (!type || !amount || !category || !description) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const transaction = new Transaction({
      userId: req.user.userId,
      type,
      amount,
      category,
      description,
      date: date ? new Date(date) : new Date(),
    });
    await transaction.save();
    res.status(201).json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
    
    res.json({
      success: true,
      stats: {
        totalIncome,
        totalExpenses,
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