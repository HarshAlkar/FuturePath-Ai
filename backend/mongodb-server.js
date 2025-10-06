// MongoDB-based Backend Server
// This is a simplified backend using MongoDB instead of PostgreSQL

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Initialize Express app
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "https://futurepath-ai.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/futurepath_ai';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  panNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Middleware
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "https://futurepath-ai.netlify.app"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// ===============================
// HEALTH CHECK
// ===============================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FuturePath AI Backend is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// ===============================
// DATABASE TEST ENDPOINT
// ===============================
app.get('/api/test-db', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({
      status: 'OK',
      message: 'Database connection successful',
      userCount: userCount,
      database: 'MongoDB',
      connectionState: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// ===============================
// AUTHENTICATION ROUTES
// ===============================

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName, dateOfBirth, panNumber } = req.body;
    
    console.log('Registration attempt:', { email, phone, firstName, lastName });
    
    // Validation
    if (!email || !phone || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['email', 'phone', 'password', 'firstName', 'lastName']
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists',
        message: 'A user with this email or phone number already exists'
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const user = new User({
      email,
      phone,
      password: hashedPassword,
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      panNumber
    });
    
    await user.save();
    
    console.log('User created successfully:', user._id);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Login successful:', user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// Get Users (for testing)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// ===============================
// WEBSOCKET CONNECTION
// ===============================
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔍 Database test: http://localhost:${PORT}/api/test-db`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  mongoose.disconnect();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
