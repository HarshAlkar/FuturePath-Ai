# ✅ Render Manual Setup Checklist

## 🎯 Services to Create (5 Total)

### **1. Main Backend Service**
- [ ] **Name**: `futurepath-backend`
- [ ] **Environment**: Node.js
- [ ] **Root Directory**: `backend`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Environment Variables**:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `JWT_SECRET=your-secure-secret`
  - [ ] `OPENAI_API_KEY=your-openai-key`
  - [ ] `MONGODB_URI=your-mongodb-url`
  - [ ] `REDIS_URL=your-redis-url`
- [ ] **Deploy**: Click "Create Web Service"
- [ ] **Test**: `https://futurepath-backend.onrender.com/api/health`

### **2. Real-time Stock Service**
- [ ] **Name**: `futurepath-realtime`
- [ ] **Environment**: Node.js
- [ ] **Root Directory**: `backend`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm run start:realtime`
- [ ] **Environment Variables**:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5001`
  - [ ] `REDIS_URL=your-redis-url`
- [ ] **Deploy**: Click "Create Web Service"
- [ ] **Test**: `https://futurepath-realtime.onrender.com/health`

### **3. SIP Advisor Service**
- [ ] **Name**: `futurepath-sip`
- [ ] **Environment**: Python
- [ ] **Root Directory**: `backend/sip_advisor`
- [ ] **Build Command**: `pip install -r requirements-simple.txt`
- [ ] **Start Command**: `uvicorn sip_api_server:app --host 0.0.0.0 --port $PORT`
- [ ] **Environment Variables**:
  - [ ] `PORT=5002`
  - [ ] `GEMINI_API_KEY=your-gemini-key`
- [ ] **Deploy**: Click "Create Web Service"
- [ ] **Test**: `https://futurepath-sip.onrender.com/health`

### **4. Gold Service**
- [ ] **Name**: `futurepath-gold`
- [ ] **Environment**: Node.js
- [ ] **Root Directory**: `backend`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `node gold-server.js`
- [ ] **Environment Variables**:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5003`
  - [ ] `REDIS_URL=your-redis-url`
- [ ] **Deploy**: Click "Create Web Service"
- [ ] **Test**: `https://futurepath-gold.onrender.com/health`

### **5. Stock Advisor Service**
- [ ] **Name**: `futurepath-stock-advisor`
- [ ] **Environment**: Python
- [ ] **Root Directory**: `backend/stock_advisor`
- [ ] **Build Command**: `pip install -r requirements.txt`
- [ ] **Start Command**: `python api_server.py`
- [ ] **Environment Variables**:
  - [ ] `PORT=5004`
  - [ ] `OPENAI_API_KEY=your-openai-key`
- [ ] **Deploy**: Click "Create Web Service"
- [ ] **Test**: `https://futurepath-stock-advisor.onrender.com/health`

## 🔑 Required API Keys & Databases

### **API Keys Needed:**
- [ ] **OpenAI API Key**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- [ ] **Gemini API Key**: [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

### **Databases Needed:**
- [ ] **MongoDB Atlas**: [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
  - [ ] Create free cluster
  - [ ] Get connection string
  - [ ] Add to environment variables
- [ ] **Redis Cloud**: [redis.com/redis-enterprise-cloud](https://redis.com/redis-enterprise-cloud)
  - [ ] Create free database
  - [ ] Get connection string
  - [ ] Add to environment variables

## 📝 Quick Setup Commands

### **For Each Service:**
1. Click "New" → "Web Service"
2. Select your repository
3. Set the configuration (see above)
4. Add environment variables
5. Click "Create Web Service"
6. Wait for deployment
7. Test the health endpoint

### **Environment Variables Template:**
```
# Main Backend
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secure-jwt-secret
OPENAI_API_KEY=your-openai-api-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/futurepath_ai
REDIS_URL=redis://username:password@host:port

# Real-time Stock
NODE_ENV=production
PORT=5001
REDIS_URL=redis://username:password@host:port

# SIP Advisor
PORT=5002
GEMINI_API_KEY=your-gemini-api-key

# Gold Service
NODE_ENV=production
PORT=5003
REDIS_URL=redis://username:password@host:port

# Stock Advisor
PORT=5004
OPENAI_API_KEY=your-openai-api-key
```

## 🧪 Testing Commands

```bash
# Test all services
curl https://futurepath-backend.onrender.com/api/health
curl https://futurepath-realtime.onrender.com/health
curl https://futurepath-sip.onrender.com/health
curl https://futurepath-gold.onrender.com/health
curl https://futurepath-stock-advisor.onrender.com/health
```

## 🎯 Final URLs

After deployment, you'll have:
- **Main Backend**: `https://futurepath-backend.onrender.com`
- **Real-time Stock**: `https://futurepath-realtime.onrender.com`
- **SIP Advisor**: `https://futurepath-sip.onrender.com`
- **Gold Service**: `https://futurepath-gold.onrender.com`
- **Stock Advisor**: `https://futurepath-stock-advisor.onrender.com`

---

**Check off each item as you complete it! ✅**
