# 🛠️ Render Manual Setup Guide for FuturePath AI

## 📋 Overview
This guide will help you manually set up each service on Render instead of using the automatic `render.yaml` configuration.

## 🎯 Step-by-Step Manual Setup

### **Step 1: Create Main Backend Service**

#### **1.1 Go to Render Dashboard**
- Visit [render.com](https://render.com)
- Sign up/Login with GitHub
- Click "New" → "Web Service"

#### **1.2 Configure Main Backend**
- **Name**: `futurepath-backend`
- **Environment**: Node.js
- **Repository**: Select your `futurepath-ai` repository
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: Free (or Starter for production)

#### **1.3 Environment Variables for Main Backend**
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secure-jwt-secret-here
OPENAI_API_KEY=your-openai-api-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/futurepath_ai
REDIS_URL=redis://username:password@host:port
```

#### **1.4 Deploy Main Backend**
- Click "Create Web Service"
- Wait for deployment to complete
- Note the URL: `https://futurepath-backend.onrender.com`

### **Step 2: Create Real-time Stock Service**

#### **2.1 Create New Web Service**
- Click "New" → "Web Service"
- **Name**: `futurepath-realtime`
- **Environment**: Node.js
- **Repository**: Same `futurepath-ai` repository
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm run start:realtime`
- **Instance Type**: Free

#### **2.2 Environment Variables for Real-time Service**
```
NODE_ENV=production
PORT=5001
REDIS_URL=redis://username:password@host:port
```

#### **2.3 Deploy Real-time Service**
- Click "Create Web Service"
- Wait for deployment
- Note the URL: `https://futurepath-realtime.onrender.com`

### **Step 3: Create SIP Advisor Service (Python)**

#### **3.1 Create New Web Service**
- Click "New" → "Web Service"
- **Name**: `futurepath-sip`
- **Environment**: Python
- **Repository**: Same `futurepath-ai` repository
- **Branch**: `main`
- **Root Directory**: `backend/sip_advisor`
- **Build Command**: `pip install -r requirements-simple.txt`
- **Start Command**: `uvicorn sip_api_server:app --host 0.0.0.0 --port $PORT`
- **Instance Type**: Free

#### **3.2 Environment Variables for SIP Service**
```
PORT=5002
GEMINI_API_KEY=your-gemini-api-key
```

#### **3.3 Deploy SIP Service**
- Click "Create Web Service"
- Wait for deployment
- Note the URL: `https://futurepath-sip.onrender.com`

### **Step 4: Create Gold Service**

#### **4.1 Create New Web Service**
- Click "New" → "Web Service"
- **Name**: `futurepath-gold`
- **Environment**: Node.js
- **Repository**: Same `futurepath-ai` repository
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node gold-server.js`
- **Instance Type**: Free

#### **4.2 Environment Variables for Gold Service**
```
NODE_ENV=production
PORT=5003
REDIS_URL=redis://username:password@host:port
```

#### **4.3 Deploy Gold Service**
- Click "Create Web Service"
- Wait for deployment
- Note the URL: `https://futurepath-gold.onrender.com`

### **Step 5: Create Stock Advisor Service (Python)**

#### **5.1 Create New Web Service**
- Click "New" → "Web Service"
- **Name**: `futurepath-stock-advisor`
- **Environment**: Python
- **Repository**: Same `futurepath-ai` repository
- **Branch**: `main`
- **Root Directory**: `backend/stock_advisor`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python api_server.py`
- **Instance Type**: Free

#### **5.2 Environment Variables for Stock Advisor**
```
PORT=5004
OPENAI_API_KEY=your-openai-api-key
```

#### **5.3 Deploy Stock Advisor**
- Click "Create Web Service"
- Wait for deployment
- Note the URL: `https://futurepath-stock-advisor.onrender.com`

## 🔧 Service Configuration Details

### **Main Backend Service (futurepath-backend)**
```
Service Type: Web Service
Environment: Node.js
Repository: your-repo/futurepath-ai
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
Instance Type: Free
Auto-Deploy: Yes
```

### **Real-time Stock Service (futurepath-realtime)**
```
Service Type: Web Service
Environment: Node.js
Repository: your-repo/futurepath-ai
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm run start:realtime
Instance Type: Free
Auto-Deploy: Yes
```

### **SIP Advisor Service (futurepath-sip)**
```
Service Type: Web Service
Environment: Python
Repository: your-repo/futurepath-ai
Branch: main
Root Directory: backend/sip_advisor
Build Command: pip install -r requirements-simple.txt
Start Command: uvicorn sip_api_server:app --host 0.0.0.0 --port $PORT
Instance Type: Free
Auto-Deploy: Yes
```

### **Gold Service (futurepath-gold)**
```
Service Type: Web Service
Environment: Node.js
Repository: your-repo/futurepath-ai
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: node gold-server.js
Instance Type: Free
Auto-Deploy: Yes
```

### **Stock Advisor Service (futurepath-stock-advisor)**
```
Service Type: Web Service
Environment: Python
Repository: your-repo/futurepath-ai
Branch: main
Root Directory: backend/stock_advisor
Build Command: pip install -r requirements.txt
Start Command: python api_server.py
Instance Type: Free
Auto-Deploy: Yes
```

## 🔑 Environment Variables Setup

### **Required Environment Variables:**

#### **For All Services:**
- **NODE_ENV**: `production`
- **PORT**: Service-specific port (5000, 5001, 5002, 5003, 5004)

#### **For Backend Services:**
- **JWT_SECRET**: Your secure JWT secret key
- **MONGODB_URI**: MongoDB Atlas connection string
- **REDIS_URL**: Redis Cloud connection string

#### **For AI Services:**
- **OPENAI_API_KEY**: OpenAI API key for AI features
- **GEMINI_API_KEY**: Google Gemini API key for SIP recommendations

### **Environment Variables by Service:**

#### **Main Backend (futurepath-backend):**
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secure-jwt-secret
OPENAI_API_KEY=your-openai-api-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/futurepath_ai
REDIS_URL=redis://username:password@host:port
```

#### **Real-time Stock (futurepath-realtime):**
```
NODE_ENV=production
PORT=5001
REDIS_URL=redis://username:password@host:port
```

#### **SIP Advisor (futurepath-sip):**
```
PORT=5002
GEMINI_API_KEY=your-gemini-api-key
```

#### **Gold Service (futurepath-gold):**
```
NODE_ENV=production
PORT=5003
REDIS_URL=redis://username:password@host:port
```

#### **Stock Advisor (futurepath-stock-advisor):**
```
PORT=5004
OPENAI_API_KEY=your-openai-api-key
```

## 🗄️ Database Setup

### **MongoDB Atlas Setup:**
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (free tier)
4. Create database user
5. Get connection string
6. Add to environment variables

### **Redis Cloud Setup:**
1. Go to [redis.com/redis-enterprise-cloud](https://redis.com/redis-enterprise-cloud)
2. Create free account
3. Create database
4. Get connection string
5. Add to environment variables

## 🧪 Testing Your Services

### **Test Each Service:**
```bash
# Main Backend
curl https://futurepath-backend.onrender.com/api/health

# Real-time Stock
curl https://futurepath-realtime.onrender.com/health

# SIP Advisor
curl https://futurepath-sip.onrender.com/health

# Gold Service
curl https://futurepath-gold.onrender.com/health

# Stock Advisor
curl https://futurepath-stock-advisor.onrender.com/health
```

### **Expected Responses:**
- All services should return `{"status": "OK"}` or similar
- Check Render logs if any service fails

## 🚨 Troubleshooting

### **Common Issues:**

#### **Build Failures:**
- Check if all dependencies are in package.json/requirements.txt
- Verify build commands are correct
- Check Render build logs

#### **Service Not Starting:**
- Check start commands
- Verify environment variables
- Check service logs in Render dashboard

#### **Database Connection Issues:**
- Verify MongoDB Atlas connection string
- Check Redis Cloud connection
- Ensure database is accessible from Render

#### **Python Service Issues:**
- Check if Python version is compatible
- Verify requirements.txt has all dependencies
- Check if all Python packages are installed

### **Debug Steps:**
1. Check Render service logs
2. Verify environment variables are set
3. Test database connections
4. Check if all dependencies are installed
5. Verify start commands are correct

## 📊 Deployment Checklist

### **Before Deployment:**
- [ ] Code pushed to GitHub
- [ ] All dependencies listed in package.json/requirements.txt
- [ ] Environment variables ready
- [ ] Database connections set up

### **After Each Service Deployment:**
- [ ] Service starts successfully
- [ ] Health check endpoint responds
- [ ] Environment variables are set
- [ ] Service logs show no errors

### **Final Integration:**
- [ ] All services deployed
- [ ] Frontend can connect to backend
- [ ] Real-time features working
- [ ] AI services responding
- [ ] Database connections working

## 🎯 Next Steps After Manual Setup

1. **Deploy Frontend to Netlify** (see NETLIFY_DEPLOYMENT_GUIDE.md)
2. **Set up environment variables in Netlify**
3. **Test complete application**
4. **Monitor services in Render dashboard**

---

**Your FuturePath AI backend will be live on Render! 🚀**
