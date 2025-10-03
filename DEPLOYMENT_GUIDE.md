# FuturePath AI - Deployment Guide

This guide covers deploying your FuturePath AI application to GitHub, Vercel, and Netlify.

## 🚀 Quick Start

### 1. GitHub Setup

#### Initialize Git Repository
```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: FuturePath AI application"

# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/yourusername/futurepath-ai.git

# Push to GitHub
git push -u origin main
```

#### GitHub Repository Setup
1. Create a new repository on GitHub
2. Copy the repository URL
3. Run the commands above to push your code

### 2. Frontend Deployment Options

## Option A: Vercel Deployment (Recommended)

### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository

### Step 2: Configure Vercel
1. **Framework Preset**: Vite
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

### Step 3: Environment Variables
Add these in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.vercel.app
VITE_WS_URL=wss://your-websocket-url.vercel.app
```

### Step 4: Deploy
- Vercel will automatically deploy on every push to main branch
- Your app will be available at `https://your-project.vercel.app`

## Option B: Netlify Deployment

### Step 1: Connect to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Choose your GitHub repository

### Step 2: Configure Netlify
1. **Base directory**: `frontend`
2. **Build command**: `npm run build`
3. **Publish directory**: `dist`

### Step 3: Environment Variables
Add these in Netlify dashboard:
```
VITE_API_URL=https://your-backend-url.netlify.app
VITE_WS_URL=wss://your-websocket-url.netlify.app
```

### Step 4: Deploy
- Netlify will automatically deploy on every push to main branch
- Your app will be available at `https://your-project.netlify.app`

## 3. Backend Deployment Options

### Option A: Vercel Serverless Functions
Create `api/` directory in your project root:

```javascript
// api/health.js
export default function handler(req, res) {
  res.status(200).json({ status: 'OK' });
}
```

### Option B: Railway
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Select backend folder
4. Add environment variables
5. Deploy

### Option C: Render
1. Use the provided `render.yaml` configuration
2. Connect GitHub repository
3. Deploy all services

## 4. Database Setup

### MongoDB Atlas (Recommended)
1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Add to environment variables: `MONGODB_URI`

### Redis Cloud
1. Create account at [redis.com/redis-enterprise-cloud](https://redis.com/redis-enterprise-cloud)
2. Create a new database
3. Get connection string
4. Add to environment variables: `REDIS_URL`

## 5. Environment Variables Setup

### Required Environment Variables:
```bash
# Backend
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secure-jwt-secret
OPENAI_API_KEY=your-openai-api-key
MONGODB_URI=your-mongodb-connection-string
REDIS_URL=your-redis-connection-string

# Frontend
VITE_API_URL=your-backend-url
VITE_WS_URL=your-websocket-url

# SIP Advisor
GEMINI_API_KEY=your-gemini-api-key
```

## 6. Deployment Checklist

### Pre-Deployment:
- [ ] All environment variables configured
- [ ] Database connections tested
- [ ] API endpoints working
- [ ] Frontend builds successfully
- [ ] All dependencies installed

### Post-Deployment:
- [ ] Health checks passing
- [ ] API endpoints accessible
- [ ] Frontend loads correctly
- [ ] Database connections working
- [ ] WebSocket connections working

## 7. Custom Domain Setup

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

## 8. Monitoring and Analytics

### Vercel Analytics:
- Built-in analytics available
- Performance monitoring
- Error tracking

### Netlify Analytics:
- Built-in analytics available
- Form submissions tracking
- Performance insights

## 9. Troubleshooting

### Common Issues:

#### Build Failures:
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

#### API Connection Issues:
- Verify environment variables
- Check CORS configuration
- Ensure backend is deployed and running

#### Database Connection Issues:
- Verify connection strings
- Check database access permissions
- Ensure database is accessible from deployment platform

## 10. Production Optimization

### Frontend:
- Enable gzip compression
- Optimize images
- Use CDN for static assets
- Enable caching headers

### Backend:
- Implement rate limiting
- Add request logging
- Set up monitoring
- Configure auto-scaling

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review error logs
3. Test locally first
4. Contact platform support if needed

---

**Happy Deploying! 🚀**
