# 🚀 FuturePath AI - Complete Setup & Running Guide

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **MongoDB** (Optional - for full backend functionality)
- **Git** - [Download here](https://git-scm.com/)

## 🏗️ Project Structure

```
FuturePath AI/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js backend servers
│   ├── models/        # Database models
│   ├── sip_advisor/   # Python SIP recommendation service
│   └── stock_advisor/ # Python stock prediction service
└── docs/             # Documentation
```

## 🚀 Quick Start Commands

### 1. Install Dependencies

#### Frontend Dependencies
```bash
cd frontend
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
```

#### Python Dependencies
```bash
# SIP Advisor
cd backend/sip_advisor
pip install -r requirements.txt

# Stock Advisor
cd backend/stock_advisor
pip install -r requirements.txt
```

### 2. Environment Setup

#### Frontend Environment
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOLD_API_URL=http://localhost:5001
```

#### Backend Environment
Create `backend/.env`:
```env
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb://localhost:27017/finpilot
OPENAI_API_KEY=your-openai-api-key-here
METALS_API_KEY=your-metals-api-key
GOLD_API_KEY=your-gold-api-key
REDIS_HOST=localhost
REDIS_PORT=6379
FRONTEND_URL=http://localhost:5173
```

## 🖥️ Running the Application

### Option 1: Development Mode (Recommended)

#### Terminal 1 - Frontend
```bash
cd frontend
npm run dev
```
**Access:** http://localhost:5173

#### Terminal 2 - Main Backend Server
```bash
cd backend
node server.js
```
**Access:** http://localhost:5000

#### Terminal 3 - Gold Server
```bash
cd backend
node gold-server.js
```
**Access:** http://localhost:5001

#### Terminal 4 - SIP Advisor (Optional)
```bash
cd backend/sip_advisor
python sip_api_server.py
```
**Access:** http://localhost:8000

#### Terminal 5 - Stock Advisor (Optional)
```bash
cd backend/stock_advisor
python api_server.py
```
**Access:** http://localhost:8001

### Option 2: Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start All Backend Services
```bash
# Main server
cd backend
node server.js &

# Gold server
node gold-server.js &

# SIP advisor
cd sip_advisor
python sip_api_server.py &

# Stock advisor
cd ../stock_advisor
python api_server.py &
```

## 🔧 Individual Service Commands

### Frontend Commands
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install

# Lint code
npm run lint
```

### Backend Commands
```bash
cd backend

# Main server (Port 5000)
node server.js

# Gold server (Port 5001)
node gold-server.js

# Simple real-time server
node simple-realtime-server.js

# Real-time stock server
node realTimeStockServer.js

# Install dependencies
npm install

# Run tests
npm test
```

### Python Services Commands
```bash
# SIP Advisor
cd backend/sip_advisor
python sip_api_server.py

# Stock Advisor
cd backend/stock_advisor
python api_server.py

# Install Python dependencies
pip install -r requirements.txt
```

## 🌐 API Endpoints

### Main Server (Port 5000)
- **Health Check:** `GET http://localhost:5000/api/health`
- **Authentication:** `POST http://localhost:5000/api/login`
- **Transactions:** `GET http://localhost:5000/api/transactions`
- **Goals:** `GET http://localhost:5000/api/goals`

### Gold Server (Port 5001)
- **Gold Prices:** `GET http://localhost:5001/api/gold/prices`
- **Historical Data:** `GET http://localhost:5001/api/gold/historical/:symbol`
- **Market Analysis:** `GET http://localhost:5001/api/gold/analysis/:symbol`
- **WebSocket:** `ws://localhost:5001`

### SIP Advisor (Port 8000)
- **SIP Recommendations:** `POST http://localhost:8000/recommend`
- **Health Check:** `GET http://localhost:8000/health`

### Stock Advisor (Port 8001)
- **Stock Predictions:** `POST http://localhost:8001/predict`
- **Health Check:** `GET http://localhost:8001/health`

## 🔍 Health Checks

### Check All Services
```bash
# Main server
curl http://localhost:5000/api/health

# Gold server
curl http://localhost:5001/api/gold/prices

# SIP advisor
curl http://localhost:8000/health

# Stock advisor
curl http://localhost:8001/health
```

### Check WebSocket Connection
```bash
# Test WebSocket connection
wscat -c ws://localhost:5001
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000
netstat -ano | findstr :5001

# Kill process
taskkill /PID <PID_NUMBER> /F
```

#### 2. Module Not Found Errors
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 3. Python Dependencies Issues
```bash
# Reinstall Python dependencies
cd backend/sip_advisor
pip install -r requirements.txt --force-reinstall

cd backend/stock_advisor
pip install -r requirements.txt --force-reinstall
```

#### 4. WebSocket Connection Errors
- Ensure Gold Server is running on port 5001
- Check firewall settings
- Verify WebSocket URL: `ws://localhost:5001`

### Logs and Debugging

#### Backend Logs
```bash
# Main server logs
cd backend
node server.js 2>&1 | tee server.log

# Gold server logs
node gold-server.js 2>&1 | tee gold-server.log
```

#### Frontend Debug
```bash
cd frontend
npm run dev -- --debug
```

## 📊 Service Dependencies

### Required Services for Full Functionality
1. **Frontend** (Port 5173) - React application
2. **Main Server** (Port 5000) - Authentication, transactions, goals
3. **Gold Server** (Port 5001) - Gold prices, analysis, WebSocket

### Optional Services
4. **SIP Advisor** (Port 8000) - SIP recommendations
5. **Stock Advisor** (Port 8001) - Stock predictions

## 🚀 Production Deployment

### Build for Production
```bash
# Build frontend
cd frontend
npm run build

# The built files will be in frontend/dist/
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-production-secret
MONGODB_URI=your-production-mongodb-uri
OPENAI_API_KEY=your-production-openai-key
```

## 📝 Development Workflow

### 1. Start Development Environment
```bash
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Main Backend
cd backend && node server.js

# Terminal 3: Gold Server
cd backend && node gold-server.js
```

### 2. Make Changes
- Frontend changes auto-reload
- Backend changes require server restart

### 3. Test Changes
- Frontend: http://localhost:5173
- API: http://localhost:5000/api/health
- Gold API: http://localhost:5001/api/gold/prices

## 🎯 Quick Commands Summary

```bash
# Start everything (5 terminals needed)
# Terminal 1:
cd frontend && npm run dev

# Terminal 2:
cd backend && node server.js

# Terminal 3:
cd backend && node gold-server.js

# Terminal 4:
cd backend/sip_advisor && python sip_api_server.py

# Terminal 5:
cd backend/stock_advisor && python api_server.py
```

## 📞 Support

If you encounter any issues:
1. Check the logs for error messages
2. Verify all services are running on correct ports
3. Ensure all dependencies are installed
4. Check environment variables are set correctly

---

**Happy Coding! 🚀**
