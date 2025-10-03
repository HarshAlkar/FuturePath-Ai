# 🚀 Render Deployment Guide for FuturePath AI Backend

## Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- MongoDB Atlas account (for database)
- API keys for external services

## 📋 Step-by-Step Deployment

### 1. Prepare Your Repository
Your backend is already configured for deployment with:
- ✅ `package.json` with proper start script
- ✅ Environment variable configuration
- ✅ Port configuration (`process.env.PORT || 5000`)

### 2. Create MongoDB Database
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier available)
3. Create a database user
4. Get your connection string
5. Whitelist Render's IP addresses (0.0.0.0/0 for all IPs)

### 3. Deploy to Render

#### Option A: Manual Deployment (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `futurepath-ai-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
Add these in the Render dashboard:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/futurepath?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
NEWS_API_KEY=your-news-api-key-here
METALS_API_KEY=your-metals-api-key-here
GOLD_API_KEY=your-gold-api-key-here
METAL_PRICE_API_KEY=your-metal-price-api-key-here
```

#### Option B: Using render.yaml (Infrastructure as Code)
1. The `render.yaml` file is already created in your repository
2. In Render dashboard, click "New +" → "Blueprint"
3. Connect your repository
4. Render will automatically detect and use the `render.yaml` configuration

### 4. Configure Environment Variables

In your Render dashboard, go to your service → Environment tab and add:

#### Required Variables:
```
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
```

#### API Keys (Optional - for full functionality):
```
OPENAI_API_KEY=sk-your-openai-key
GEMINI_API_KEY=your-gemini-key
NEWS_API_KEY=your-news-api-key
METALS_API_KEY=your-metals-api-key
GOLD_API_KEY=your-gold-api-key
METAL_PRICE_API_KEY=your-metal-price-api-key
```

### 5. Deploy and Test

1. Click "Deploy" in Render dashboard
2. Wait for build to complete (usually 2-5 minutes)
3. Your backend will be available at: `https://your-service-name.onrender.com`
4. Test the health endpoint: `https://your-service-name.onrender.com/api/health`

## 🔧 Configuration Details

### Backend Structure
```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── models/            # Database models
├── logs/             # Log files
└── uploads/          # File uploads
```

### Key Features
- ✅ Express.js server with CORS enabled
- ✅ MongoDB integration with Mongoose
- ✅ JWT authentication
- ✅ File upload support
- ✅ Real-time WebSocket support
- ✅ Rate limiting and security headers
- ✅ Comprehensive logging

### API Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - User profile
- `POST /api/transactions` - Add transaction
- `GET /api/transactions` - Get transactions
- `POST /api/goals` - Create goal
- `GET /api/goals` - Get goals
- `POST /api/ai/chat` - AI chat endpoint

## 🚨 Important Notes

### Free Tier Limitations
- **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- **Cold Start**: First request after sleep takes 30-60 seconds
- **Build Time**: 90 minutes per month
- **Bandwidth**: 100GB per month

### Production Considerations
1. **Database**: Use MongoDB Atlas (free tier available)
2. **Environment Variables**: Never commit real API keys
3. **Logs**: Check Render logs for debugging
4. **Monitoring**: Set up health checks
5. **Scaling**: Upgrade to paid plan for better performance

### Troubleshooting

#### Common Issues:
1. **Build Fails**: Check Node.js version compatibility
2. **Database Connection**: Verify MongoDB URI and network access
3. **Environment Variables**: Ensure all required vars are set
4. **Port Issues**: Render automatically sets PORT environment variable

#### Debug Steps:
1. Check Render service logs
2. Verify environment variables
3. Test database connection
4. Check API endpoint responses

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas](https://cloud.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 📞 Support

If you encounter issues:
1. Check Render service logs
2. Verify all environment variables are set
3. Test your backend locally first
4. Check MongoDB Atlas connection

Your backend is now ready for production deployment! 🎉
