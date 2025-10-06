# 🚀 Netlify Deployment Guide for FuturePath AI

## 📋 Prerequisites
- GitHub repository with your code
- Netlify account (free)
- Backend hosting solution (Railway/Render/Heroku)

## 🎯 Step-by-Step Deployment

### **Step 1: GitHub Setup (If not done already)**

1. **Create GitHub Repository:**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name: `futurepath-ai`
   - Make it public
   - Click "Create repository"

2. **Push Your Code:**
   ```bash
   # Add remote origin (replace with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/futurepath-ai.git
   
   # Push to GitHub
   git push -u origin main
   ```

### **Step 2: Deploy Frontend to Netlify**

1. **Go to Netlify:**
   - Visit [netlify.com](https://netlify.com)
   - Sign up/Login (use GitHub account for easy integration)

2. **Create New Site:**
   - Click "New site from Git"
   - Choose "GitHub" as provider
   - Authorize Netlify to access your GitHub

3. **Select Repository:**
   - Find and select `futurepath-ai` repository
   - Click "Deploy site"

4. **Configure Build Settings:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`

5. **Set Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add these variables:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     VITE_WS_URL=wss://your-websocket-url.railway.app
     ```

### **Step 3: Deploy Backend (Choose One Option)**

#### **Option A: Railway (Recommended - Easiest)**

1. **Go to Railway:**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend:**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your `futurepath-ai` repository
   - Set **Root Directory** to `backend`
   - Railway will auto-detect Node.js

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-secure-jwt-secret
   OPENAI_API_KEY=your-openai-api-key
   MONGODB_URI=your-mongodb-atlas-connection-string
   REDIS_URL=your-redis-cloud-connection-string
   ```

#### **Option B: Render**

1. **Go to Render:**
   - Visit [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Use the provided `render.yaml` configuration
   - Render will automatically deploy all services

#### **Option C: Heroku**

1. **Go to Heroku:**
   - Visit [heroku.com](https://heroku.com)
   - Sign up for free account

2. **Deploy Backend:**
   - Create new app
   - Connect GitHub repository
   - Set buildpack to Node.js
   - Deploy from main branch

### **Step 4: Database Setup**

#### **MongoDB Atlas (Free)**
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (free tier)
4. Get connection string
5. Add to backend environment variables

#### **Redis Cloud (Free)**
1. Go to [redis.com/redis-enterprise-cloud](https://redis.com/redis-enterprise-cloud)
2. Create free account
3. Create database
4. Get connection string
5. Add to backend environment variables

### **Step 5: Update Netlify Environment Variables**

After getting your backend URL, update Netlify:

1. **Go to Netlify Dashboard**
2. **Site Settings → Environment Variables**
3. **Update with your actual backend URLs:**
   ```
   VITE_API_URL=https://your-actual-backend-url.railway.app
   VITE_WS_URL=wss://your-actual-websocket-url.railway.app
   ```
4. **Redeploy** your site

### **Step 6: Test Your Deployment**

1. **Check Frontend:** Visit your Netlify URL
2. **Check Backend:** Visit `your-backend-url.railway.app/api/health`
3. **Test Features:** Try logging in, creating goals, etc.

## 🔧 Troubleshooting

### **Common Issues:**

#### **Build Fails on Netlify:**
- Check if all dependencies are in `package.json`
- Verify build command is correct
- Check Node.js version compatibility

#### **API Calls Fail:**
- Verify `VITE_API_URL` is correct
- Check if backend is deployed and running
- Check CORS settings in backend

#### **Environment Variables Not Working:**
- Make sure variables start with `VITE_`
- Redeploy after adding variables
- Check for typos in variable names

### **Debug Steps:**
1. Check Netlify build logs
2. Check backend deployment logs
3. Test API endpoints directly
4. Verify environment variables

## 📊 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Netlify site created and configured
- [ ] Backend deployed (Railway/Render/Heroku)
- [ ] MongoDB Atlas database set up
- [ ] Redis Cloud database set up
- [ ] Environment variables configured
- [ ] Frontend builds successfully
- [ ] Backend API responds
- [ ] Full application tested

## 🎯 Quick Commands

### **Update and Redeploy:**
```bash
# Make changes to your code
git add .
git commit -m "Update for deployment"
git push origin main

# Netlify will auto-deploy
# Railway/Render will auto-deploy
```

### **Check Deployment Status:**
- **Netlify:** Dashboard → Deploys
- **Railway:** Dashboard → Deployments
- **Render:** Dashboard → Services

## 🚀 Production Optimization

### **Netlify Optimizations:**
- Enable form handling
- Set up redirects for SPA routing
- Configure custom domain
- Enable analytics

### **Backend Optimizations:**
- Set up monitoring
- Configure auto-scaling
- Set up logging
- Configure health checks

---

**Your FuturePath AI will be live on Netlify! 🎉**
