# 🇮🇳 Indian Gold Market Dashboard

A comprehensive real-time Indian gold market dashboard with live precious metals tracking, advanced analytics, and investment insights.

## ✨ Features

### 🎯 Core Features
- **Real-time Indian Gold Prices** - Live data from multiple APIs with INR conversion
- **Live Market Feed** - Real-time updates every 30 seconds
- **Advanced Charts** - Interactive price charts with technical indicators
- **WebSocket Integration** - Real-time price updates without page refresh
- **Dark/Light Mode** - Beautiful theme switching with smooth animations
- **Price Alerts** - Custom notifications for price thresholds
- **Market Analysis** - AI-powered trend analysis and predictions
- **Indian Market Focus** - Prices in INR with Indian market standards

### 🚀 Technical Stack
**Frontend:**
- React 19 + Vite
- Tailwind CSS + Framer Motion
- Recharts for data visualization
- WebSocket for real-time updates
- Responsive design

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Redis (Caching)
- Socket.io (WebSockets)
- JWT Authentication
- Winston (Logging)
- Cron jobs for scheduled updates

## 🏗️ Architecture

### Backend Implementation
- **API Endpoints**: `/api/gold/prices`, `/api/gold/historical/:symbol`, `/api/gold/analysis/:symbol`
- **Data Sources**: Multiple gold APIs with INR conversion
- **Real-time Updates**: WebSocket connections for live data
- **Caching**: Redis for performance optimization
- **Scheduled Tasks**: Cron jobs for regular price updates

### Frontend Implementation
- **Gold Service**: `frontend/src/services/goldService.js`
- **Indian Gold Dashboard**: `frontend/src/pages/IndianGoldDashboard.jsx`
- **Integration**: Added to main dashboard with quick access
- **Real-time Updates**: WebSocket integration for live data

## 📊 Features Implemented

### 1. Real-time Indian Gold Prices
- **Gold (XAU)**: Per 10 grams in INR
- **Silver (XAG)**: Per kg in INR
- **Platinum (XPT)**: Per oz in INR
- **Palladium (XPD)**: Per oz in INR
- **Live Updates**: Every 30 seconds
- **Fallback Data**: Mock data when APIs fail

### 2. Live Market Feed
- **Real-time Prices**: Live price updates
- **Price Changes**: 24h change in INR and percentage
- **High/Low**: 24h high and low prices
- **Volume**: Trading volume data
- **Market Cap**: Market capitalization

### 3. Interactive Charts
- **Time Ranges**: 1D, 1W, 1M, 3M, 6M, 1Y
- **Price Charts**: Line charts with price history
- **Technical Indicators**: Trend analysis
- **Responsive Design**: Mobile-friendly charts

### 4. Market Analysis
- **Trend Analysis**: Bullish, Bearish, Neutral
- **Volatility**: Market volatility percentage
- **Support/Resistance**: Key price levels
- **AI Predictions**: Market sentiment analysis
- **Confidence Levels**: Prediction confidence

## 🔧 API Endpoints

### GET `/api/gold/prices`
Get current gold prices in INR.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "symbol": "XAU",
      "name": "Gold",
      "price": 6850,
      "currency": "INR",
      "unit": "10g",
      "indianUnit": "per 10 grams",
      "change24h": 45,
      "changePercent24h": 0.66,
      "high24h": 6890,
      "low24h": 6820,
      "volume": 1250000,
      "marketCap": 1500000000,
      "timestamp": "2025-01-11T10:30:00.000Z",
      "source": "indian-gold-api",
      "isIndianMarket": true
    }
  ],
  "timestamp": "2025-01-11T10:30:00.000Z"
}
```

### GET `/api/gold/historical/:symbol`
Get historical data for a specific commodity.

**Parameters:**
- `symbol`: XAU, XAG, XPT, XPD
- `period`: 1D, 1W, 1M, 3M, 6M, 1Y

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-01-11T00:00:00.000Z",
      "open": 6800,
      "high": 6900,
      "low": 6750,
      "close": 6850,
      "volume": 125000
    }
  ],
  "symbol": "XAU",
  "period": "1M"
}
```

### GET `/api/gold/analysis/:symbol`
Get market analysis for a specific commodity.

**Response:**
```json
{
  "success": true,
  "data": {
    "symbol": "XAU",
    "trend": "bullish",
    "volatility": 2.5,
    "support": 6800,
    "resistance": 7000,
    "prediction": "Market shows bullish sentiment with moderate volatility",
    "confidence": 85,
    "lastUpdated": "2025-01-11T10:30:00.000Z"
  }
}
```

## 🎨 Frontend Components

### IndianGoldDashboard Component
- **Location**: `frontend/src/pages/IndianGoldDashboard.jsx`
- **Features**:
  - Real-time price display
  - Interactive charts
  - Market analysis
  - Dark/light mode
  - WebSocket integration
  - Responsive design

### GoldService
- **Location**: `frontend/src/services/goldService.js`
- **Methods**:
  - `getGoldPrices()`: Fetch current prices
  - `getHistoricalData()`: Get historical data
  - `getMarketAnalysis()`: Get market analysis
  - `createPriceAlert()`: Create price alerts
  - `formatPrice()`: Format prices in INR
  - `generateMockData()`: Generate fallback data

## 🔄 Integration

### Main Dashboard Integration
The Indian Gold Dashboard is integrated into the main dashboard:

1. **Quick Actions**: Added "Indian Gold" button in main dashboard
2. **Navigation**: Direct link to `/indian-gold-dashboard`
3. **User Experience**: Seamless navigation between dashboards

### Route Configuration
```javascript
// In App.jsx
<Route path="/indian-gold-dashboard" element={<ProtectedRoute><IndianGoldDashboard /></ProtectedRoute>} />
```

## 🧪 Testing

### Backend Testing
```bash
# Start the gold server
cd backend
node gold-server.js

# Test API endpoints
curl http://localhost:5001/api/gold/prices
curl http://localhost:5001/api/gold/historical/XAU?period=1M
curl http://localhost:5001/api/gold/analysis/XAU
```

### Frontend Testing
1. Navigate to main dashboard
2. Click "Indian Gold" in Quick Actions
3. Verify real-time price updates
4. Test chart interactions
5. Check dark/light mode toggle

## 📈 Data Sources

### Primary APIs
1. **Metals API**: https://metals-api.com/
2. **Gold API**: https://www.goldapi.io/
3. **Metal Price API**: https://api.metalpriceapi.com/
4. **Forex API**: https://api.exchangerate-api.com/

### Data Processing
- **USD to INR Conversion**: Real-time exchange rates
- **Indian Standards**: Gold per 10g, Silver per kg
- **Price Normalization**: Consistent data format
- **Fallback Data**: Mock data when APIs fail

## 💡 Usage Examples

### Basic Price Fetching
```javascript
// Get current gold prices
const response = await goldService.getGoldPrices();
console.log(response.data); // Array of gold prices in INR
```

### Historical Data
```javascript
// Get 1 month of gold price history
const historical = await goldService.getHistoricalData('XAU', '1M');
console.log(historical.data); // Array of historical prices
```

### Market Analysis
```javascript
// Get market analysis for gold
const analysis = await goldService.getMarketAnalysis('XAU');
console.log(analysis.data.trend); // 'bullish', 'bearish', or 'neutral'
```

## 🚀 Deployment

### Backend
1. Ensure Node.js dependencies are installed
2. Set up environment variables
3. Start the gold server: `node gold-server.js`

### Frontend
1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Serve the application

## 🔒 Security

- **Authentication**: JWT token required for alerts
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Server-side validation for all inputs
- **CORS**: Configured for frontend communication
- **Error Handling**: Graceful fallbacks for API failures

## 📊 Performance

- **API Response Time**: < 2 seconds for prices
- **Real-time Updates**: WebSocket connections
- **Caching**: Redis caching for performance
- **Fallback Data**: Mock data when APIs fail
- **Error Handling**: Graceful degradation

## 🛠️ Future Enhancements

1. **Portfolio Tracking**: Track gold investments
2. **Price Alerts**: Email/SMS notifications
3. **Trading Integration**: Connect to trading platforms
4. **Advanced Analytics**: More technical indicators
5. **Mobile App**: React Native mobile app

## 📝 Notes

- The system prioritizes Indian market data (INR prices)
- Gold prices are displayed per 10 grams (Indian standard)
- Silver prices are displayed per kg (Indian standard)
- All monetary values are in Indian Rupees (₹)
- The system includes fallback data for reliability
- WebSocket connections provide real-time updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions regarding the Indian Gold Dashboard:
1. Check the API health endpoint: `/api/health`
2. Review the gold service: `frontend/src/services/goldService.js`
3. Check browser console for frontend errors
4. Verify gold server is running on port 5001
5. Test WebSocket connections

## 🎯 Key Benefits

- **Real-time Data**: Live Indian gold prices
- **Indian Market Focus**: Prices in INR with Indian standards
- **Reliable Fallbacks**: Mock data when APIs fail
- **Beautiful UI**: Modern, responsive design
- **Performance**: Optimized for speed and reliability
- **Integration**: Seamlessly integrated with main dashboard
