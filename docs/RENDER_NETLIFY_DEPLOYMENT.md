# 🚀 Render Backend + Netlify Frontend Deployment Guide

## 📋 Architecture Overview
- **Frontend**: Netlify (Static hosting)
- **Backend**: Render (Node.js + Python services)
- **Database**: MongoDB Atlas + Redis Cloud

## 🎯 Step-by-Step Deployment

### **Step 1: Deploy Backend to Render**

#### **1.1 Go to Render**
- Visit [render.com](https://render.com)
- Sign up with GitHub account
- Click "New" → "Web Service"

#### **1.2 Connect Repository**
- Select your `futurepath-ai` repository
- Render will detect the `render.yaml` configuration
- Click "Apply"

#### **1.3 Configure Services**
Render will automatically create these services from `render.yaml`:

**Main Backend Service:**
- **Name**: `futurepath-backend`
- **Environment**: Node.js
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Port**: 5000

**Real-time Stock Service:**
- **Name**: `futurepath-realtime`
- **Environment**: Node.js
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm run start:realtime`
- **Port**: 5001

**SIP Advisor Service:**
- **Name**: `futurepath-sip`
- **Environment**: Python
- **Build Command**: `cd backend/sip_advisor && pip install -r requirements-simple.txt`
- **Start Command**: `cd backend/sip_advisor && uvicorn sip_api_server:app --host 0.0.0.0 --port $PORT`
- **Port**: 5002

**Gold Service:**
- **Name**: `futurepath-gold`
- **Environment**: Node.js
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && node gold-server.js`
- **Port**: 5003

**Stock Advisor Service:**
- **Name**: `futurepath-stock-advisor`
- **Environment**: Python
- **Build Command**: `cd backend/stock_advisor && pip install -r requirements.txt`
- **Start Command**: `cd backend/stock_advisor && python api_server.py`
- **Port**: 5004

#### **1.4 Set Environment Variables in Render**
For each service, add these environment variables:

**Backend Services:**
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secure-jwt-secret-here
OPENAI_API_KEY=your-openai-api-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/futurepath_ai
REDIS_URL=redis://username:password@host:port
```

**Python Services:**
```
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
```

### **Step 2: Set Up Databases**

#### **2.1 MongoDB Atlas**
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (free tier)
4. Create database user
5. Get connection string
6. Add to Render environment variables

#### **2.2 Redis Cloud**
1. Go to [redis.com/redis-enterprise-cloud](https://redis.com/redis-enterprise-cloud)
2. Create free account
3. Create database
4. Get connection string
5. Add to Render environment variables

### **Step 3: Deploy Frontend to Netlify**

#### **3.1 Go to Netlify**
- Visit [netlify.com](https://netlify.com)
- Sign up/Login with GitHub
- Click "New site from Git"

#### **3.2 Configure Build Settings**
- **Repository**: Select your `futurepath-ai` repository
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

#### **3.3 Set Environment Variables in Netlify**
```
VITE_API_URL=https://futurepath-backend.onrender.com
VITE_WS_URL=wss://futurepath-realtime.onrender.com
```

### **Step 4: Get Render URLs**

After deployment, you'll get URLs like:
- **Main Backend**: `https://futurepath-backend.onrender.com`
- **Real-time**: `https://futurepath-realtime.onrender.com`
- **SIP Advisor**: `https://futurepath-sip.onrender.com`
- **Gold Service**: `https://futurepath-gold.onrender.com`
- **Stock Advisor**: `https://futurepath-stock-advisor.onrender.com`

### **Step 5: Update Netlify Environment Variables**

Update Netlify with your actual Render URLs:
```
VITE_API_URL=https://your-actual-backend-url.onrender.com
VITE_WS_URL=wss://your-actual-realtime-url.onrender.com
```

### **Step 6: Test Your Deployment**

#### **6.1 Test Backend Services**
```bash
# Test main backend
curl https://futurepath-backend.onrender.com/api/health

# Test real-time service
curl https://futurepath-realtime.onrender.com/health

# Test SIP advisor
curl https://futurepath-sip.onrender.com/health
```

#### **6.2 Test Frontend**
- Visit your Netlify URL
- Check if API calls work
- Test login functionality
- Test real-time features

## 🔧 Render-Specific Configuration

### **Render.yaml Optimization**
Your `render.yaml` is already configured for:
- ✅ Multiple services
- ✅ Health checks
- ✅ Auto-deployment
- ✅ Environment variables
- ✅ Database connections

### **Render Dashboard**
- **Services**: Monitor all your services
- **Logs**: Check deployment and runtime logs
- **Metrics**: Monitor performance
- **Environment**: Manage environment variables

## 🚨 Common Issues & Solutions

### **Render Issues:**

#### **Build Failures:**
- Check if all dependencies are in package.json
- Verify Python requirements files
- Check build logs in Render dashboard

#### **Service Not Starting:**
- Check start commands
- Verify environment variables
- Check service logs

#### **Database Connection Issues:**
- Verify MongoDB Atlas connection string
- Check Redis Cloud connection
- Ensure database is accessible from Render

### **Netlify Issues:**

#### **Build Failures:**
- Check if frontend builds locally
- Verify build command and directory
- Check Netlify build logs

#### **API Calls Failing:**
- Verify `VITE_API_URL` is correct
- Check if backend services are running
- Test API endpoints directly

## 📊 Deployment Checklist

### **Render Backend:**
- [ ] All services deployed successfully
- [ ] Environment variables configured
- [ ] MongoDB Atlas connected
- [ ] Redis Cloud connected
- [ ] Health checks passing
- [ ] Services responding to requests

### **Netlify Frontend:**
- [ ] Site deployed successfully
- [ ] Environment variables set
- [ ] Build completed without errors
- [ ] API calls working
- [ ] Real-time features working

### **Integration:**
- [ ] Frontend can connect to backend
- [ ] Authentication working
- [ ] Real-time data flowing
- [ ] All features functional

## 🎯 Quick Commands

### **Update and Redeploy:**
```bash
# Make changes
git add .
git commit -m "Update for production"
git push origin main

# Render will auto-deploy backend
# Netlify will auto-deploy frontend
```

### **Check Deployment Status:**
- **Render**: Dashboard → Services
- **Netlify**: Dashboard → Deploys

## 🚀 Production URLs

After deployment, you'll have:
- **Frontend**: `https://your-app-name.netlify.app`
- **Backend API**: `https://futurepath-backend.onrender.com`
- **Real-time**: `https://futurepath-realtime.onrender.com`
- **SIP Advisor**: `https://futurepath-sip.onrender.com`
- **Gold Service**: `https://futurepath-gold.onrender.com`

---

**Your FuturePath AI will be live with Render + Netlify! 🎉**
