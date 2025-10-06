# 🥇 Gold Stock Market Dashboard

A production-ready, real-time Gold Stock Market Dashboard with modern UI, advanced charts, and AI-powered insights.

## ✨ Features

### 🎯 Core Features
- **Real-time Gold Prices** - Live data from multiple APIs (Metals-API, Gold-API, MetalpriceAPI)
- **Advanced Charts** - Candlestick, line, and area charts with technical indicators
- **WebSocket Integration** - Real-time price updates without page refresh
- **Dark/Light Mode** - Beautiful theme switching with smooth animations
- **Price Alerts** - Custom notifications for price thresholds
- **Data Export** - CSV, Excel, PDF export functionality
- **AI Predictions** - Trend analysis and market insights

### 🚀 Technical Stack
**Frontend:**
- React 19 + Vite
- Tailwind CSS + Framer Motion
- Lightweight Charts (TradingView)
- Socket.io Client
- Zustand (State Management)
- Radix UI Components

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Redis (Caching)
- Socket.io (WebSockets)
- JWT Authentication
- Winston (Logging)
- Helmet (Security)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB
- Redis (optional, will fallback gracefully)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API keys
# Get free API keys from:
# - https://metals-api.com/
# - https://www.goldapi.io/
# - https://metalpriceapi.com/

# Start the server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Database Setup

MongoDB will automatically create the required collections. No manual setup needed.

## 🔑 API Keys Setup

### Required API Keys (Get Free Tiers):

1. **Metals API** (https://metals-api.com/)
   - Free: 1,000 requests/month
   - Add to `.env`: `METALS_API_KEY=your_key_here`

2. **Gold API** (https://www.goldapi.io/)
   - Free: 100 requests/month
   - Add to `.env`: `GOLD_API_KEY=your_key_here`

3. **Metal Price API** (https://metalpriceapi.com/)
   - Free: 1,000 requests/month
   - Add to `.env`: `METAL_PRICE_API_KEY=your_key_here`

### Optional API Keys:

4. **OpenAI API** (for enhanced AI predictions)
   - Add to `.env`: `OPENAI_API_KEY=your_key_here`

## 🚀 Quick Start

1. **Clone and Install:**
```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

2. **Configure Environment:**
```bash
# Copy and edit backend/.env
cp backend/.env.example backend/.env
```

3. **Start Services:**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

4. **Access Dashboard:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001
   - Gold Dashboard: http://localhost:5173/gold-dashboard

## 📊 Dashboard Features

### Real-time Price Cards
- Live gold, silver, platinum, palladium prices
- 24h change indicators with animations
- Volume and market cap data

### Advanced Charting
- Candlestick charts with zoom/pan
- Technical indicators (SMA, EMA, RSI, MACD)
- Multiple timeframes (1D, 1W, 1M, 3M, 6M, 1Y)
- Volume overlay

### Price Alerts
- Set custom price thresholds
- Real-time notifications
- Email alerts (configurable)

### Data Export
- CSV format for spreadsheets
- JSON for developers
- PDF reports
- Excel compatibility

### AI Market Analysis
- Trend prediction
- Volatility analysis
- Support/resistance levels
- Confidence scoring

## 🔧 Configuration

### Environment Variables

```env
# Server
PORT=5001
NODE_ENV=development
JWT_SECRET=your-secret-key

# Database
MONGODB_URI=mongodb://localhost:27017/gold-dashboard

# Redis (Optional)
REDIS_HOST=localhost
REDIS_PORT=6379

# API Keys
METALS_API_KEY=your_key
GOLD_API_KEY=your_key
METAL_PRICE_API_KEY=your_key
```

### Customization

**Update Refresh Intervals:**
```javascript
// backend/gold-server.js
cron.schedule('*/30 * * * * *', async () => {
  await PriceUpdateService.updatePrices();
});
```

**Modify Commodities:**
```javascript
// frontend/src/pages/GoldDashboard.jsx
const commodities = [
  { symbol: 'XAU', name: 'Gold', icon: '🥇' },
  // Add more commodities
];
```

## 🎨 UI Components

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions

### Animations
- Smooth page transitions
- Hover effects
- Loading states
- Real-time data updates

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode

## 🔒 Security Features

- JWT authentication
- Rate limiting
- CORS protection
- Input validation
- SQL injection prevention
- XSS protection

## 📈 Performance

### Optimization Features
- Redis caching (5-minute TTL)
- API request batching
- Lazy loading
- Code splitting
- Image optimization

### Monitoring
- Winston logging
- Error tracking
- Performance metrics
- API response times

## 🚀 Deployment

### Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

### Environment Setup
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://your-production-db
REDIS_URL=redis://your-redis-instance
```

### Docker Support (Optional)

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

### Common Issues

**API Rate Limits:**
- Use multiple API keys
- Implement request queuing
- Cache responses longer

**WebSocket Connection:**
- Check firewall settings
- Verify CORS configuration
- Use polling fallback

**Chart Performance:**
- Limit data points
- Use data decimation
- Implement virtualization

### Getting Help

1. Check the logs: `backend/logs/`
2. Verify API keys in `.env`
3. Ensure MongoDB is running
4. Check network connectivity

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced technical indicators
- [ ] Portfolio tracking
- [ ] Social trading features
- [ ] News sentiment analysis
- [ ] Multi-language support

---

**Built with ❤️ for traders and investors**
