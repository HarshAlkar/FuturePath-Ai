# Real-Time Investment Dashboard

This document describes the real-time features implemented for the Investment page in the FuturePath AI platform.

## 🚀 Features Implemented

### 1. Real-Time Stock Price Updates
- **WebSocket Connection**: Live price feeds for all investment symbols
- **Automatic Reconnection**: Handles connection drops gracefully
- **Price Caching**: Local cache for offline viewing
- **Visual Indicators**: Live status indicators showing real-time updates

### 2. Real-Time Market News
- **Live News Feed**: Automatic news updates from market sources
- **Impact Analysis**: AI-powered news impact assessment
- **Real-Time Indicators**: Visual indicators for live news updates

### 3. Real-Time Portfolio Performance
- **Live Portfolio Tracking**: Real-time calculation of portfolio value
- **Performance Charts**: Dynamic charts updating with live data
- **Risk Analysis**: Real-time risk assessment updates

### 4. Connection Status Monitoring
- **Connection Indicators**: Visual status of real-time connection
- **Fallback Mode**: Graceful degradation when offline
- **Error Handling**: Comprehensive error handling and recovery

## 🏗️ Architecture

### Frontend Components

#### RealTimeStockService (`frontend/src/services/realTimeStockService.js`)
- WebSocket client for real-time data
- Price update management
- Connection status monitoring
- Fallback to REST API when WebSocket unavailable

#### Investment Page (`frontend/src/pages/Investment.jsx`)
- Real-time price display
- Live portfolio updates
- Connection status indicators
- Market news integration

### Backend Components

#### RealTimeStockServer (`backend/realTimeStockServer.js`)
- WebSocket server for real-time connections
- Stock price fetching and broadcasting
- Market news aggregation
- Portfolio performance calculation

#### API Endpoints
- `/api/stocks/prices` - REST fallback for stock prices
- `/api/market/news` - Market news endpoint
- `/api/portfolio/performance` - Portfolio performance calculation

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install ws yfinance axios

# Frontend dependencies (already included)
cd ../frontend
npm install
```

### 2. Start the Servers

#### Option 1: Start All Servers (Recommended)
```bash
# Run the startup script
./start-realtime-servers.bat
```

#### Option 2: Start Manually
```bash
# Terminal 1: Main server
cd backend
npm start

# Terminal 2: Real-time server
cd backend
npm run start:realtime

# Terminal 3: Frontend
cd frontend
npm run dev
```

### 3. Verify Installation

1. **Main Server**: http://localhost:5000/api/health
2. **Real-time Server**: http://localhost:5001/api/health
3. **Frontend**: http://localhost:5173

## 📊 Real-Time Features

### Live Price Updates
- **Update Frequency**: Every 5 seconds
- **Symbols Supported**: All major stock symbols
- **Data Sources**: Yahoo Finance API
- **Fallback**: Cached data when API unavailable

### Market News
- **Update Frequency**: Every 30 seconds
- **Sources**: News API (configurable)
- **Impact Analysis**: AI-powered sentiment analysis
- **Fallback**: Mock news when API unavailable

### Portfolio Performance
- **Real-Time Calculation**: Live portfolio value updates
- **Performance Metrics**: Total return, percentage gains
- **Risk Assessment**: Dynamic risk level updates
- **Chart Updates**: Live chart data updates

## 🎨 UI Enhancements

### Connection Status Indicators
- **Live Data Indicator**: Green pulsing dot when connected
- **Offline Mode**: Red indicator when disconnected
- **Last Update Time**: Shows when data was last updated
- **Connection Status**: Text indicator of connection state

### Real-Time Price Display
- **Live Price Updates**: Prices update in real-time
- **Change Indicators**: Color-coded price changes
- **Update Timestamps**: Shows when each price was last updated
- **Volume Information**: Real-time volume data

### Market News Section
- **Live News Feed**: Automatically updating news
- **Impact Indicators**: Color-coded news impact
- **Refresh Button**: Manual news refresh
- **Real-Time Status**: Live/Offline indicator

## 🔧 Configuration

### Environment Variables

```bash
# Backend (.env)
NEWS_API_KEY=your_news_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=mongodb://localhost:27017/finpilot

# Frontend (.env)
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5001
```

### WebSocket Configuration

```javascript
// Real-time service configuration
const wsUrl = process.env.NODE_ENV === 'production' 
  ? 'wss://your-production-websocket-url.com/ws'
  : 'ws://localhost:5001/ws';
```

## 🚨 Error Handling

### Connection Errors
- **Automatic Reconnection**: Attempts to reconnect every 5 seconds
- **Max Retries**: 5 reconnection attempts before giving up
- **Fallback Mode**: Switches to REST API when WebSocket fails
- **User Notification**: Visual indicators for connection status

### API Errors
- **Graceful Degradation**: Falls back to cached data
- **Error Logging**: Comprehensive error logging
- **User Feedback**: Clear error messages to users
- **Recovery**: Automatic retry mechanisms

## 📈 Performance Optimizations

### Data Caching
- **Price Cache**: Local storage of recent prices
- **News Cache**: Cached news articles
- **Portfolio Cache**: Cached portfolio calculations

### Update Batching
- **Batch Updates**: Multiple price updates in single message
- **Debounced Updates**: Prevents excessive UI updates
- **Selective Updates**: Only update changed data

### Memory Management
- **Subscription Cleanup**: Automatic cleanup of unused subscriptions
- **Cache Limits**: Limited cache size to prevent memory leaks
- **Connection Pooling**: Efficient WebSocket connection management

## 🔍 Monitoring

### Connection Monitoring
- **Ping/Pong**: Regular connection health checks
- **Connection Count**: Track active connections
- **Error Rates**: Monitor connection error rates

### Performance Metrics
- **Update Latency**: Measure data update delays
- **Throughput**: Track data update frequency
- **Error Rates**: Monitor API error rates

## 🛠️ Troubleshooting

### Common Issues

#### WebSocket Connection Failed
```bash
# Check if real-time server is running
curl http://localhost:5001/api/health

# Check firewall settings
# Ensure port 5001 is not blocked
```

#### No Real-Time Updates
```bash
# Check browser console for errors
# Verify WebSocket connection in Network tab
# Check if symbols are subscribed correctly
```

#### API Errors
```bash
# Check API keys in environment variables
# Verify external API access
# Check rate limiting
```

### Debug Mode

```javascript
// Enable debug logging
localStorage.setItem('debug', 'realtime:*');

// Check connection status
console.log('Connection status:', realTimeStockService.getConnectionStatus());
```

## 🚀 Future Enhancements

### Planned Features
- **Push Notifications**: Real-time alerts for price changes
- **Advanced Analytics**: Real-time technical indicators
- **Social Trading**: Real-time social sentiment
- **Mobile Support**: Real-time updates on mobile devices

### Performance Improvements
- **WebSocket Compression**: Reduce bandwidth usage
- **Data Compression**: Optimize data transfer
- **CDN Integration**: Faster data delivery
- **Edge Computing**: Reduce latency

## 📚 API Documentation

### WebSocket Events

#### Client → Server
```javascript
// Subscribe to symbol
{ type: 'subscribe', symbol: 'AAPL' }

// Unsubscribe from symbol
{ type: 'unsubscribe', symbol: 'AAPL' }

// Ping server
{ type: 'ping' }
```

#### Server → Client
```javascript
// Price update
{
  type: 'price_update',
  symbol: 'AAPL',
  price: 150.25,
  change: 2.15,
  changePercent: 1.45,
  timestamp: '2024-01-15T10:30:00Z'
}

// Market status
{
  type: 'market_status',
  status: 'open'
}

// News alert
{
  type: 'news_alert',
  news: {
    title: 'Market Update',
    summary: 'Stocks rally on positive news',
    impact: 'positive'
  }
}
```

### REST API Endpoints

#### Stock Prices
```bash
POST /api/stocks/prices
Content-Type: application/json
Authorization: Bearer <token>

{
  "symbols": ["AAPL", "GOOGL", "MSFT"]
}
```

#### Market News
```bash
GET /api/market/news
Authorization: Bearer <token>
```

#### Portfolio Performance
```bash
POST /api/portfolio/performance
Content-Type: application/json
Authorization: Bearer <token>

{
  "portfolio": [
    { "symbol": "AAPL", "shares": 10, "amountInvested": 1500 },
    { "symbol": "GOOGL", "shares": 5, "amountInvested": 1000 }
  ]
}
```

## 🎯 Success Metrics

### Performance Targets
- **Update Latency**: < 1 second for price updates
- **Connection Uptime**: > 99% WebSocket connection uptime
- **Data Accuracy**: 100% accurate price data
- **User Experience**: Smooth, responsive interface

### Monitoring Dashboard
- **Real-Time Metrics**: Live performance monitoring
- **Error Tracking**: Comprehensive error logging
- **User Analytics**: Usage patterns and performance
- **System Health**: Overall system status monitoring

---

## 📞 Support

For technical support or questions about the real-time investment features:

1. **Documentation**: Check this README and inline code comments
2. **Issues**: Report bugs or issues in the project repository
3. **Community**: Join the developer community for discussions
4. **Updates**: Follow the project for latest updates and improvements

---

*Last updated: January 2024*
*Version: 1.0.0*
