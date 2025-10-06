# 🚀 FuturePath AI - Quick Setup Guide

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **MongoDB** (Optional - for full backend functionality)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

#### Python Services
```bash
# SIP Advisor
cd backend/sip_advisor
pip install -r requirements.txt

# Stock Advisor  
cd backend/stock_advisor
pip install -r requirements.txt
```

### 2. Environment Setup

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

### Development Mode (5 Terminals Required)

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

## 🔍 Health Checks

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

## 🌐 API Endpoints

### Main Server (Port 5000)
- **Health:** `GET http://localhost:5000/api/health`
- **Auth:** `POST http://localhost:5000/api/login`
- **Transactions:** `GET http://localhost:5000/api/transactions`

### Gold Server (Port 5001)
- **Prices:** `GET http://localhost:5001/api/gold/prices`
- **Analysis:** `GET http://localhost:5001/api/gold/analysis/:symbol`
- **WebSocket:** `ws://localhost:5001`

### SIP Advisor (Port 8000)
- **Recommendations:** `POST http://localhost:8000/recommend`

### Stock Advisor (Port 8001)
- **Predictions:** `POST http://localhost:8001/predict`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Module Not Found
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
```

### WebSocket Errors
- Ensure Gold Server is running on port 5001
- Check WebSocket URL: `ws://localhost:5001`

## 📊 Service Architecture

```
Frontend (5173) → Main Server (5000) → Database
                → Gold Server (5001) → WebSocket
                → SIP Advisor (8000) → Python
                → Stock Advisor (8001) → Python
```

## 🚀 Production Build

```bash
# Build frontend
cd frontend
npm run build

# Start production servers
cd backend
NODE_ENV=production node server.js &
node gold-server.js &
```

---

**For detailed setup instructions, see `COMPLETE_SETUP_GUIDE.md`**

**Happy Coding! 🚀**