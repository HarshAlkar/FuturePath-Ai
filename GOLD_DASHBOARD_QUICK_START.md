# 🥇 Gold Dashboard Quick Start Guide

## 🚀 Quick Setup (2 Steps)

### Step 1: Start the Gold Server
Open a **new terminal/command prompt** and run:
```bash
cd backend
node simple-gold-server.js
```

You should see:
```
🚀 Simple Gold Dashboard API server running on port 5001
📊 WebSocket server ready for real-time updates
🔗 Health check: http://localhost:5001/api/health
📈 Gold prices: http://localhost:5001/api/gold/prices
```

### Step 2: Access the Dashboard
1. Go to your main dashboard: http://localhost:3002/main-dashboard
2. Click **"Indian Gold"** in Quick Actions
3. Or navigate directly to: http://localhost:3002/indian-gold-dashboard

## ✅ What You'll See

### With Gold Server Running:
- ✅ **Real-time gold prices** in INR
- ✅ **Live market updates** every 30 seconds  
- ✅ **Interactive charts** with historical data
- ✅ **Market analysis** and predictions
- ✅ **WebSocket connection**: "Live" status

### Without Gold Server:
- ⚠️ **Fallback data** (mock prices)
- ⚠️ **Error message**: "Gold server not running"
- ⚠️ **WebSocket status**: "Offline"
- ⚠️ **Charts still work** with mock data

## 🔧 Troubleshooting

### Error: "Failed to fetch"
**Solution**: The gold server is not running. Start it using Step 1 above.

### Error: "WebSocket connection failed"
**Solution**: Make sure the gold server is running on port 5001.

### Port 5001 already in use
**Solution**: 
1. Find what's using port 5001:
   ```bash
   # Windows
   netstat -ano | findstr :5001
   taskkill /PID <PID_NUMBER> /F
   ```

### Server won't start
**Solution**: Make sure you're in the backend directory:
```bash
cd backend
node simple-gold-server.js
```

## 📊 Features Available

### Real-time Indian Gold Prices
- **Gold (XAU)**: Per 10 grams in INR (₹6,850)
- **Silver (XAG)**: Per kg in INR (₹82,500)
- **Platinum (XPT)**: Per oz in INR (₹7,034,625)
- **Palladium (XPD)**: Per oz in INR (₹1,23,643)

### Interactive Features
- **Live price updates** every 30 seconds
- **Historical charts** (1D, 1W, 1M, 3M, 6M, 1Y)
- **Market analysis** with trend predictions
- **Dark/light mode** toggle
- **Responsive design** for mobile

## 🧪 Testing the Setup

### 1. Test Gold Server
Open a new terminal and run:
```bash
curl http://localhost:5001/api/health
```
Should return: `{"success":true,"message":"Gold Dashboard API is running"}`

### 2. Test Gold Prices
```bash
curl http://localhost:5001/api/gold/prices
```
Should return gold prices in JSON format.

### 3. Check Frontend
- Open browser console (F12)
- Look for "WebSocket connected" message
- Check for any error messages

## 📝 Important Notes

- **Gold server runs on port 5001**
- **Frontend runs on port 3002** (Vite default)
- **No MongoDB or Redis required** (simplified server)
- **Dashboard works with fallback data** if server is not running
- **Real-time updates** via WebSocket connections

## 🆘 Still Having Issues?

1. **Check if port 5001 is available**
2. **Verify you're in the backend directory**
3. **Look at the gold server console for errors**
4. **Check browser console for frontend errors**
5. **Try refreshing the page after starting the server**

The dashboard is designed to work with fallback data, so you can still see the UI and functionality even without the gold server running!

## 🎯 Next Steps

Once the gold server is running:
1. Navigate to the Indian Gold Dashboard
2. You should see real-time prices updating
3. Try the interactive charts
4. Check the market analysis
5. Toggle dark/light mode

**The dashboard will work perfectly with the simplified gold server!** 🚀
