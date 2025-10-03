# 🚀 FuturePath AI - Complete Setup Guide

## 📋 Prerequisites

- Node.js 18+ 
- Python 3.9+
- MongoDB (local or Atlas)
- Redis (local or Cloud)
- Git

## 🔧 Local Development Setup

### 1. Clone and Setup Repository
```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit: FuturePath AI application"

# Add remote repository
git remote add origin https://github.com/yourusername/futurepath-ai.git
```

### 2. Backend Setup
```bash
# Install Node.js dependencies
cd backend
npm install

# Install Python dependencies (SIP Advisor)
cd sip_advisor
pip install -r requirements-simple.txt
cd ..

# Install Python dependencies (Stock Advisor)
cd stock_advisor
pip install -r requirements.txt
cd ..
```

### 3. Environment Variables
Create `.env` file in backend directory:
```bash
# Backend Environment Variables
NODE_ENV=development
PORT=5000
JWT_SECRET=your-jwt-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here
MONGODB_URI=mongodb://localhost:27017/futurepath_ai
REDIS_URL=redis://localhost:6379

# SIP Advisor
GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Frontend Setup
```bash
# Install frontend dependencies
cd frontend
npm install
```

## 🚀 Starting Services

### Option 1: Start All Services (Recommended)
```bash
# From project root
cd backend
npm run start:all
```

### Option 2: Start Services Individually

#### Main Backend Server
```bash
cd backend
npm start
```

#### Real-time Stock Server
```bash
cd backend
npm run start:realtime
```

#### SIP Advisor (Python)
```bash
cd backend/sip_advisor
uvicorn sip_api_server:app --host 0.0.0.0 --port 5002
```

#### Stock Advisor (Python)
```bash
cd backend/stock_advisor
python api_server.py
```

#### Gold Service
```bash
cd backend
node gold-server.js
```

#### Frontend Development Server
```bash
cd frontend
npm run dev
```

## 🔍 Testing Services

### Test All Services
```bash
# Run the test script
node test-services.js
```

### Manual Testing
- **Main API**: http://localhost:5000/api/health
- **Real-time Stock**: http://localhost:5001/health
- **SIP Advisor**: http://localhost:5002/health
- **Gold Service**: http://localhost:5003/health
- **Frontend**: http://localhost:3000

## 🐛 Troubleshooting

### Common Issues:

#### 1. "require is not defined" Error
- **Cause**: Mixing CommonJS and ES modules
- **Fix**: Use `import` instead of `require` in ES module files

#### 2. Python Dependencies Error
- **Cause**: Missing C++ compiler for pandas/numpy
- **Fix**: Use `requirements-simple.txt` or install Visual Studio Build Tools

#### 3. MongoDB Connection Error
- **Cause**: MongoDB not running or wrong connection string
- **Fix**: Start MongoDB service or use MongoDB Atlas

#### 4. Redis Connection Error
- **Cause**: Redis not running
- **Fix**: Start Redis service or use Redis Cloud

### Service Status Check:
```bash
# Check if ports are in use
netstat -an | findstr :5000
netstat -an | findstr :5001
netstat -an | findstr :5002
netstat -an | findstr :5003
```

## 📦 Production Deployment

### 1. GitHub Setup
```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Frontend Deployment (Vercel/Netlify)
- Use the provided `vercel.json` or `netlify.toml`
- Set environment variables in platform dashboard
- Deploy automatically on push to main

### 3. Backend Deployment (Railway/Render)
- Use the provided `render.yaml` for Render
- Or deploy to Railway with simple configuration
- Set environment variables in platform dashboard

## 🔧 Environment Variables for Production

### Required Variables:
```bash
# Backend
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secure-jwt-secret
OPENAI_API_KEY=your-openai-api-key
MONGODB_URI=your-mongodb-atlas-connection-string
REDIS_URL=your-redis-cloud-connection-string

# Frontend
VITE_API_URL=your-backend-deployment-url
VITE_WS_URL=your-websocket-deployment-url

# Python Services
GEMINI_API_KEY=your-gemini-api-key
```

## 📊 Database Setup

### MongoDB Atlas (Recommended)
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Add to environment variables

### Redis Cloud
1. Create account at [redis.com/redis-enterprise-cloud](https://redis.com/redis-enterprise-cloud)
2. Create database
3. Get connection string
4. Add to environment variables

## 🎯 Next Steps After Setup

1. **Test all services** using the test script
2. **Configure environment variables** for your APIs
3. **Set up databases** (MongoDB Atlas + Redis Cloud)
4. **Deploy to production** using the deployment guide
5. **Monitor services** and check logs

## 📚 Additional Resources

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [render.yaml](./render.yaml) - Render deployment configuration
- [vercel.json](./vercel.json) - Vercel deployment configuration
- [netlify.toml](./netlify.toml) - Netlify deployment configuration

---

**Happy Coding! 🚀**
