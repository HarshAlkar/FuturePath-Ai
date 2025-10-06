# 🚀 FuturePath AI - Financial Management Platform

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-orange.svg)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

> **FuturePath AI** is a comprehensive financial management application that combines traditional expense tracking with AI-powered insights and goal planning. Built with React, Node.js, and MongoDB, it helps users track expenses, set financial goals, get AI-powered advice, and monitor investments.

## ✨ Features

### 🎯 Core Features
- **📊 Real-time Financial Dashboard** - Live financial overview with charts and analytics
- **💰 Expense Tracking** - Categorize and track all income and expenses
- **🎯 Goal Management** - Set and track short-term and long-term financial goals
- **🤖 AI-Powered Insights** - Personalized financial advice using OpenAI
- **📈 Investment Tracking** - Monitor stock portfolios with real-time data
- **🔔 Smart Notifications** - Stay updated with financial alerts and reminders

### 🚀 Advanced Features
- **Real-time Updates** - 15-second polling for live data
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- **Data Visualization** - Beautiful charts and graphs using Recharts
- **AI Integration** - OpenAI-powered financial analysis and recommendations

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Beautiful and responsive charts
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **OpenAI API** - AI-powered financial insights
- **express-validator** - Input validation

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Auto-restart for development
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
FuturePath Ai/
├── backend/                 # Backend API server
│   ├── models/             # MongoDB schemas
│   │   ├── User.js        # User model
│   │   ├── Transaction.js # Transaction model
│   │   └── Goal.js        # Goal model
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── README.md         # Backend documentation
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── LandingPage/  # Landing page components
│   │   ├── SignUp/       # Authentication components
│   │   └── assets/       # Static assets
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
├── PROJECT_DOCUMENTATION.md  # Complete project documentation
├── BACKEND_DETAILED.md      # Detailed backend documentation
├── FRONTEND_DETAILED.md     # Detailed frontend documentation
├── SETUP_GUIDE.md          # Setup and installation guide
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud)
- **Git**
- **OpenAI API Key** (for AI features)
- **Stock API Key** (for investment tracking)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "FuturePath Ai"
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PORT=5000
MONGODB_URI=mongodb://localhost:27017/finpilot
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key" > .env

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:5000
VITE_STOCK_API_KEY=your-stock-api-key
VITE_OPENAI_API_KEY=your-openai-api-key" > .env

# Start development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📚 Documentation

### 📖 Complete Documentation
- **[PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)** - Complete A-Z project documentation
- **[BACKEND_DETAILED.md](BACKEND_DETAILED.md)** - Detailed backend implementation guide
- **[FRONTEND_DETAILED.md](FRONTEND_DETAILED.md)** - Detailed frontend implementation guide
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Comprehensive setup and deployment guide

### 🔧 API Documentation

#### Authentication Endpoints
```http
POST /api/register - User registration
POST /api/login    - User login
```

#### Transaction Endpoints
```http
GET  /api/transactions        - Get user transactions
POST /api/transactions        - Add new transaction
GET  /api/transactions/stats  - Get transaction statistics
```

#### Goal Endpoints
```http
GET  /api/goals     - Get user goals
POST /api/goals     - Create new goal
PUT  /api/goals/:id - Update goal
```

#### AI Endpoints
```http
GET /api/ai-tips - Get AI-powered financial tips
```

## 🎯 Key Features Explained

### 1. Financial Dashboard
The main dashboard provides a comprehensive overview of your financial health:
- **Real-time Balance** - Current account balance with trend indicators
- **Monthly Overview** - Income vs expenses comparison
- **Budget Tracking** - Visual budget progress with spending alerts
- **Quick Actions** - Add transactions, set goals, view insights

### 2. Expense Tracking
Comprehensive expense management system:
- **Transaction Management** - Add, edit, delete transactions
- **Categorization** - Automatic and manual categorization
- **Search & Filter** - Find specific transactions easily
- **Export** - Download transaction history

### 3. Goal Management
Smart goal setting and tracking:
- **Goal Setting** - Create short-term and long-term goals
- **Progress Tracking** - Visual progress indicators
- **Timeline Management** - Set target dates and milestones
- **AI Recommendations** - Smart goal suggestions

### 4. AI Assistant
Powered by OpenAI for personalized financial advice:
- **Financial Insights** - Personalized financial advice
- **Spending Analysis** - Pattern recognition and analysis
- **Budget Recommendations** - Smart budget suggestions
- **Investment Tips** - Market insights and recommendations

### 5. Investment Tracking
Real-time investment portfolio monitoring:
- **Portfolio Overview** - Real-time stock data
- **Multiple Stocks** - Track various stocks and indices
- **Charts & Analytics** - Visual performance data
- **Market Data** - Live price updates and trends

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens** - Secure token-based authentication
- **Password Hashing** - bcryptjs with salt rounds
- **Protected Routes** - Client-side route protection
- **Token Expiration** - Configurable token lifetime

### Data Security
- **Input Validation** - Comprehensive validation using express-validator
- **CORS Protection** - Configured for frontend communication
- **Environment Variables** - Sensitive data stored securely
- **SQL Injection Prevention** - Mongoose ODM protection

## 📊 Performance Features

### Backend Optimization
- **Database Indexing** - Optimized MongoDB queries
- **Connection Pooling** - MongoDB connection pooling
- **Caching Strategy** - In-memory caching for frequently accessed data
- **Query Optimization** - Efficient database queries

### Frontend Optimization
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - WebP format and compression
- **Bundle Optimization** - Tree shaking and minification
- **Real-time Updates** - Efficient polling mechanism

## 🚀 Deployment

### Backend Deployment
```bash
# Heroku
heroku create futurepath-ai-backend
git push heroku main

# Railway
railway login
railway init
railway up
```

### Frontend Deployment
```bash
# Vercel
npm install -g vercel
vercel --prod

# Netlify
npm run build
# Upload dist folder to Netlify
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test

# API Testing
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:coverage
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/finpilot
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_STOCK_API_KEY=your-stock-api-key
VITE_OPENAI_API_KEY=your-openai-api-key
```

## 📈 Project Statistics

### Code Metrics
- **Backend Lines**: 1,255 lines (server.js)
- **Frontend Components**: 20+ components
- **API Endpoints**: 15+ endpoints
- **Database Models**: 3 models (User, Transaction, Goal)

### File Structure
- **Backend Files**: 8 files
- **Frontend Files**: 50+ files
- **Assets**: 15+ SVG/webm files
- **Services**: 7 service files

### Dependencies
- **Backend Dependencies**: 9 packages
- **Frontend Dependencies**: 8 packages
- **Dev Dependencies**: 10 packages

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use ESLint for code linting
- Follow React best practices
- Write meaningful commit messages
- Add tests for new features

## 📞 Support

### Getting Help
- 📖 **Documentation**: Check the documentation files above
- 🐛 **Issues**: Report bugs via GitHub issues
- 💬 **Discussions**: Use GitHub discussions for questions
- 📧 **Email**: Contact the development team

### Useful Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB version
mongosh --version

# Check if ports are in use
netstat -tulpn | grep :5000
netstat -tulpn | grep :3000
```

## 🔮 Roadmap

### Planned Features
- [ ] **Mobile App** - React Native implementation
- [ ] **Advanced Analytics** - Machine learning insights
- [ ] **Multi-currency Support** - International currencies
- [ ] **Bank Integration** - Direct bank account linking
- [ ] **Tax Planning** - Automated tax calculations
- [ ] **Social Features** - Share goals and achievements
- [ ] **Voice Commands** - Voice-activated features
- [ ] **Offline Support** - PWA capabilities

### Technical Improvements
- [ ] **Microservices** - Break down into microservices
- [ ] **GraphQL** - Implement GraphQL API
- [ ] **Real-time** - WebSocket implementation
- [ ] **Caching** - Redis integration
- [ ] **Monitoring** - Advanced monitoring tools
- [ ] **Testing** - Comprehensive test coverage
- [ ] **CI/CD** - Automated deployment pipeline
- [ ] **Security** - Advanced security features

## 📄 License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **OpenAI** - For the AI capabilities
- **MongoDB** - For the database solution
- **Recharts** - For the beautiful charts
- **Lucide** - For the beautiful icons

---

## 🎉 Getting Started

Ready to start your financial journey with AI-powered insights?

1. **Clone the repository**
2. **Follow the setup guide**
3. **Configure your environment**
4. **Start developing**

**Happy coding! 🚀**

---

*Built with ❤️ using React, Node.js, and MongoDB*

*Last Updated: January 2024*
*Version: 1.0.0* 