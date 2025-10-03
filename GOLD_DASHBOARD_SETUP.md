# 🥇 Gold Dashboard Setup Guide

## Quick Start

### 1. Start the Gold Server

**Option A: Using the batch file (Windows)**
```bash
# Double-click the file or run in terminal
start-gold-server.bat
```

**Option B: Manual start**
```bash
cd backend
npm install
node gold-server.js
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Access the Dashboard
- Go to: http://localhost:5173/main-dashboard
- Click "Indian Gold" in Quick Actions
- Or navigate directly to: http://localhost:5173/indian-gold-dashboard

## 🔧 Troubleshooting

### Error: "Failed to fetch"
**Solution**: The gold server is not running. Start it using one of the methods above.

### Error: "WebSocket connection failed"
**Solution**: Make sure the gold server is running on port 5001.

### Error: "MongoDB connection error"
**Solution**: Make sure MongoDB is running on your system.

### Port 5001 already in use
**Solution**: 
1. Kill the process using port 5001:
   ```bash
   # Windows
   netstat -ano | findstr :5001
   taskkill /PID <PID_NUMBER> /F
   
   # Mac/Linux
   lsof -ti:5001 | xargs kill -9
   ```

## 📊 What You'll See

### With Gold Server Running:
- ✅ Real-time gold prices in INR
- ✅ Live market updates every 30 seconds
- ✅ Interactive charts with historical data
- ✅ Market analysis and predictions
- ✅ WebSocket connection status: "Live"

### Without Gold Server:
- ⚠️ Fallback data (mock prices)
- ⚠️ Error message: "Gold server not running"
- ⚠️ WebSocket connection status: "Offline"
- ⚠️ Charts still work with mock data

## 🚀 Features Available

### Real-time Data
- Gold (XAU): Per 10 grams in INR
- Silver (XAG): Per kg in INR
- Platinum (XPT): Per oz in INR
- Palladium (XPD): Per oz in INR

### Interactive Features
- Live price updates
- Historical charts (1D, 1W, 1M, 3M, 6M, 1Y)
- Market analysis
- Dark/light mode toggle
- Responsive design

## 🔍 Testing the Setup

### 1. Check Gold Server
```bash
curl http://localhost:5001/api/health
```
Should return: `{"success":true,"message":"Gold Dashboard API is running"}`

### 2. Check Gold Prices
```bash
curl http://localhost:5001/api/gold/prices
```
Should return gold prices in JSON format.

### 3. Check Frontend
- Open browser console
- Look for "WebSocket connected" message
- Check for any error messages

## 📝 Notes

- The gold server runs on port 5001
- The frontend runs on port 5173 (Vite default)
- MongoDB is required for the gold server
- Redis is optional (will fallback gracefully)
- The dashboard works with fallback data if the server is not running

## 🆘 Still Having Issues?

1. **Check if MongoDB is running**
2. **Verify port 5001 is available**
3. **Check the gold server console for errors**
4. **Look at browser console for frontend errors**
5. **Try refreshing the page after starting the server**

The dashboard is designed to work with fallback data, so you can still see the UI and functionality even without the gold server running!
