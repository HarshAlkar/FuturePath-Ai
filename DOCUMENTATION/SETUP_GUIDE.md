# FuturePath AI - Complete Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud)
- **Git**
- **OpenAI API Key** (for AI features)
- **Stock API Key** (for investment tracking)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "FuturePath Ai"
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/finpilot

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-change-this-in-production

# AI Integration
OPENAI_API_KEY=your-openai-api-key-here

# CORS Configuration
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

#### Start Backend Server
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd ../frontend
```

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
Create a `.env` file in the frontend directory:
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Stock API (for investment tracking)
VITE_STOCK_API_KEY=your-stock-api-key-here

# OpenAI API (for AI features)
VITE_OPENAI_API_KEY=your-openai-api-key-here
```

#### Start Frontend Development Server
```bash
npm run dev
```

### 4. Database Setup

#### Local MongoDB Installation

**Windows:**
1. Download MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install MongoDB Community Server
3. Start MongoDB service

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
# Install MongoDB
sudo apt-get update
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env` file

### 5. API Keys Setup

#### OpenAI API Key
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create account and get API key
3. Add to both backend and frontend `.env` files

#### Stock API Key (Optional)
1. Visit [twelvedata.com](https://twelvedata.com)
2. Sign up for free API key
3. Add to frontend `.env` file

## 🛠️ Development Workflow

### Backend Development
```bash
cd backend

# Install dependencies
npm install

# Start development server with auto-restart
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint
```

### Database Management
```bash
# Connect to MongoDB
mongosh

# Switch to database
use finpilot

# View collections
show collections

# View users
db.users.find()

# View transactions
db.transactions.find()

# View goals
db.goals.find()
```

## 🔧 Configuration Details

### Backend Configuration

#### Package.json Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

#### Dependencies
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.0",
    "openai": "^5.10.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### Frontend Configuration

#### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}
```

#### Dependencies
```json
{
  "dependencies": {
    "axios": "^1.7.9",
    "framer-motion": "^12.23.12",
    "lucide-react": "^0.468.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.28.0",
    "recharts": "^2.12.7"
  }
}
```

## 🚀 Deployment

### Backend Deployment

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create futurepath-ai-backend

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set OPENAI_API_KEY=your-openai-api-key

# Deploy
git push heroku main
```

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Frontend Deployment

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Build the project
npm run build

# Deploy to Netlify
# Upload dist folder to Netlify dashboard
```

## 🔍 Troubleshooting

### Common Issues

#### Backend Issues

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
sudo systemctl status mongodb

# Start MongoDB if not running
sudo systemctl start mongodb

# Check MongoDB connection
mongosh
```

**Port Already in Use:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in .env file
PORT=5001
```

**JWT Secret Error:**
```bash
# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Update .env file with new secret
JWT_SECRET=your-new-secret
```

#### Frontend Issues

**API Connection Error:**
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Update API base URL in .env
VITE_API_BASE_URL=http://localhost:5000
```

**Build Errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

**CORS Errors:**
```bash
# Update CORS configuration in backend
# Add frontend URL to allowed origins
FRONTEND_URL=http://localhost:3000
```

### Environment Variables Checklist

#### Backend (.env)
- [ ] `PORT=5000`
- [ ] `NODE_ENV=development`
- [ ] `MONGODB_URI=mongodb://localhost:27017/finpilot`
- [ ] `JWT_SECRET=your-secret-key`
- [ ] `OPENAI_API_KEY=your-openai-api-key`
- [ ] `FRONTEND_URL=http://localhost:3000`

#### Frontend (.env)
- [ ] `VITE_API_BASE_URL=http://localhost:5000`
- [ ] `VITE_STOCK_API_KEY=your-stock-api-key`
- [ ] `VITE_OPENAI_API_KEY=your-openai-api-key`

## 📊 Testing

### Backend Testing
```bash
cd backend

# Run tests
npm test

# Test API endpoints
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Frontend Testing
```bash
cd frontend

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security Checklist

### Backend Security
- [ ] JWT secret is strong and unique
- [ ] Passwords are hashed with bcrypt
- [ ] Input validation is implemented
- [ ] CORS is properly configured
- [ ] Environment variables are secure
- [ ] Rate limiting is implemented

### Frontend Security
- [ ] API keys are in environment variables
- [ ] Authentication tokens are stored securely
- [ ] Input validation is implemented
- [ ] HTTPS is used in production
- [ ] Sensitive data is not logged

## 📈 Performance Optimization

### Backend Optimization
- [ ] Database indexes are created
- [ ] Query optimization is implemented
- [ ] Caching is configured
- [ ] Compression is enabled
- [ ] Connection pooling is used

### Frontend Optimization
- [ ] Code splitting is implemented
- [ ] Images are optimized
- [ ] Bundle size is minimized
- [ ] Lazy loading is used
- [ ] CDN is configured

## 🚀 Production Checklist

### Before Deployment
- [ ] All tests pass
- [ ] Environment variables are set
- [ ] Database is configured
- [ ] SSL certificates are installed
- [ ] Monitoring is set up
- [ ] Backup strategy is implemented

### After Deployment
- [ ] Health checks are passing
- [ ] API endpoints are working
- [ ] Frontend is accessible
- [ ] Database connections are stable
- [ ] Logs are being collected
- [ ] Performance is monitored

## 📞 Support

### Getting Help
- Check the troubleshooting section above
- Review the documentation files
- Check GitHub issues
- Contact the development team

### Useful Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB version
mongosh --version

# Check if ports are in use
netstat -tulpn | grep :5000
netstat -tulpn | grep :3000

# Check disk space
df -h

# Check memory usage
free -h
```

---

*This setup guide provides comprehensive instructions for setting up and deploying the FuturePath AI application.* 