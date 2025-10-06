# FuturePath AI - Complete Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Backend Documentation](#backend-documentation)
4. [Frontend Documentation](#frontend-documentation)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Features & Functionality](#features--functionality)
8. [Setup & Installation](#setup--installation)
9. [Deployment](#deployment)
10. [Security](#security)
11. [Testing](#testing)
12. [Performance](#performance)

---

## 🚀 Project Overview

**FuturePath AI** is a comprehensive financial management application that combines traditional expense tracking with AI-powered insights and goal planning. The application helps users track their expenses, set financial goals, get AI-powered financial advice, and monitor their investment portfolios.

### Key Features:
- 📊 Real-time financial dashboard
- 🎯 Goal setting and tracking
- 🤖 AI-powered financial insights
- 💰 Expense tracking and categorization
- 📈 Investment portfolio monitoring
- 🔔 Smart notifications
- 📱 Responsive design

### Tech Stack:
- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI API
- **Charts**: Recharts
- **Icons**: Lucide React

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │   (Express)     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   External      │    │   AI Services   │    │   File Storage  │
│   APIs          │    │   (OpenAI)      │    │   (Local)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Authentication**: JWT-based authentication
2. **Real-time Updates**: Polling mechanism every 15 seconds
3. **AI Integration**: OpenAI API for financial insights
4. **Data Persistence**: MongoDB for user data and transactions

---

## 🔧 Backend Documentation

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **AI Integration**: OpenAI API
- **CORS**: Enabled for frontend communication

### Project Structure
```
backend/
├── server.js              # Main server file (1255 lines)
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependencies
├── README.md             # Backend documentation
└── models/
    ├── User.js           # User schema and model
    ├── Transaction.js    # Transaction schema and model
    └── Goal.js          # Goal schema and model
```

### Key Dependencies
```json
{
  "bcryptjs": "^2.4.3",           // Password hashing
  "body-parser": "^1.20.2",        // Request body parsing
  "cors": "^2.8.5",               // Cross-origin resource sharing
  "dotenv": "^16.3.1",            // Environment variables
  "express": "^4.18.2",           // Web framework
  "express-validator": "^7.0.1",  // Input validation
  "jsonwebtoken": "^9.0.2",       // JWT authentication
  "mongoose": "^8.0.0",           // MongoDB ODM
  "openai": "^5.10.2"             // OpenAI API integration
}
```

### Server Configuration
- **Port**: 5000 (default) or from environment variable
- **Database**: MongoDB with connection string from environment
- **JWT Secret**: Configurable via environment variable
- **OpenAI API**: Configurable via environment variable

### API Endpoints

#### Authentication Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/signup` - Alias for registration

#### Transaction Endpoints
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Add new transaction
- `GET /api/transactions/stats` - Get transaction statistics

#### Goal Endpoints
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

#### AI Endpoints
- `GET /api/ai-tips` - Get AI-powered financial tips
- `POST /api/ai-analysis` - Get AI analysis of financial data

#### User Endpoints
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/notifications` - Get user notifications

### Security Features
- **JWT Authentication**: Token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: express-validator for all inputs
- **CORS Protection**: Configured for frontend communication
- **Environment Variables**: Sensitive data stored in .env

---

## 🎨 Frontend Documentation

### Technology Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Project Structure
```
frontend/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Main App component
    ├── App.css            # Global styles
    ├── components/        # Reusable components
    ├── pages/            # Page components
    ├── services/         # API services
    ├── LandingPage/      # Landing page components
    ├── SignUp/           # Authentication components
    └── assets/           # Static assets
```

### Key Dependencies
```json
{
  "axios": "^1.7.9",              // HTTP client
  "framer-motion": "^12.23.12",   // Animations
  "lucide-react": "^0.468.0",     // Icons
  "react": "^19.1.0",             // React framework
  "react-dom": "^19.1.0",         // React DOM
  "react-hot-toast": "^2.4.1",    // Notifications
  "react-router-dom": "^6.28.0",  // Routing
  "recharts": "^2.12.7"           // Charts
}
```

### Component Architecture

#### Core Components
- **App.jsx**: Main application component with routing
- **ProtectedRoute**: Authentication wrapper component
- **ErrorBoundary**: Error handling component
- **AIAssistant**: AI-powered assistant component

#### Page Components
- **LandingPage**: Marketing landing page
- **MainDashboard**: Primary dashboard with financial overview
- **ExpenseTracker**: Expense tracking and management
- **Goals**: Goal setting and tracking
- **Insights**: AI-powered insights and analysis
- **Investment**: Investment portfolio management
- **Profile**: User profile management
- **Settings**: Application settings

#### Service Layer
- **api.js**: Core API communication
- **authService.js**: Authentication services
- **dashboardService.js**: Dashboard data services
- **goalService.js**: Goal management services
- **transactionService.js**: Transaction services
- **userService.js**: User management services
- **ocrService.js**: OCR and data processing services

### State Management
- **Local State**: React useState for component state
- **Authentication**: localStorage for JWT tokens
- **Real-time Updates**: Polling mechanism every 15 seconds
- **Data Persistence**: API calls to backend

### Routing Structure
```javascript
Routes:
├── /                    # Landing page
├── /login              # Login page
├── /signup             # Signup page
├── /get-started        # Onboarding
├── /dashboard          # Main dashboard
├── /expense-tracker    # Expense tracking
├── /goals              # Goal management
├── /insights           # AI insights
├── /investment         # Investment tracking
├── /profile            # User profile
└── /settings           # Application settings
```

---

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String (required, min: 2),
  email: String (required, unique, lowercase),
  password: String (required, min: 6, hashed),
  phone: String (optional),
  location: String (optional),
  membership: String (default: 'Free Member'),
  avatar: String (default: '👤'),
  bio: String (optional),
  preferences: {
    currency: String (default: 'INR'),
    language: String (default: 'English'),
    timezone: String (default: 'IST'),
    notifications: Boolean (default: true)
  },
  stats: {
    goalsCreated: Number (default: 0),
    goalsAchieved: Number (default: 0),
    totalSavings: Number (default: 0),
    daysActive: Number (default: 0)
  },
  createdAt: Date (default: Date.now)
}
```

### Transaction Schema
```javascript
{
  userId: ObjectId (ref: 'User', required),
  type: String (enum: ['income', 'expense'], required),
  amount: Number (required, min: 0),
  category: String (required),
  description: String (required),
  date: Date (default: Date.now)
}
```

### Goal Schema
```javascript
{
  userId: ObjectId (ref: 'User', required),
  title: String (required),
  amount: Number (required),
  type: String (enum: ['Short-Term', 'Long-Term'], required),
  progress: Number (default: 0),
  timeline: String (required),
  icon: String (optional),
  color: String (optional),
  progressColor: String (optional),
  recommendation: String (optional),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

---

## 🔌 API Documentation

### Authentication APIs

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login User
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Transaction APIs

#### Get Transactions
```http
GET /api/transactions
Authorization: Bearer jwt_token_here

Response:
{
  "success": true,
  "transactions": [
    {
      "id": "transaction_id",
      "type": "expense",
      "amount": 100,
      "category": "Food",
      "description": "Lunch",
      "date": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Add Transaction
```http
POST /api/transactions
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "type": "expense",
  "amount": 100,
  "category": "Food",
  "description": "Lunch"
}

Response:
{
  "success": true,
  "transaction": {
    "id": "transaction_id",
    "type": "expense",
    "amount": 100,
    "category": "Food",
    "description": "Lunch",
    "date": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Transaction Statistics
```http
GET /api/transactions/stats
Authorization: Bearer jwt_token_here

Response:
{
  "success": true,
  "stats": {
    "totalIncome": 5000,
    "totalExpenses": 3000,
    "netSavings": 2000,
    "monthlyIncome": 5000,
    "monthlyExpenses": 3000
  }
}
```

### Goal APIs

#### Get Goals
```http
GET /api/goals
Authorization: Bearer jwt_token_here

Response:
{
  "success": true,
  "goals": [
    {
      "id": "goal_id",
      "title": "Buy a Car",
      "amount": 500000,
      "type": "Long-Term",
      "progress": 25,
      "timeline": "2 years"
    }
  ]
}
```

#### Create Goal
```http
POST /api/goals
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "title": "Buy a Car",
  "amount": 500000,
  "type": "Long-Term",
  "timeline": "2 years"
}

Response:
{
  "success": true,
  "goal": {
    "id": "goal_id",
    "title": "Buy a Car",
    "amount": 500000,
    "type": "Long-Term",
    "progress": 0,
    "timeline": "2 years"
  }
}
```

### AI APIs

#### Get AI Tips
```http
GET /api/ai-tips
Authorization: Bearer jwt_token_here

Response:
{
  "success": true,
  "tips": [
    {
      "id": "tip_id",
      "title": "Save More Money",
      "description": "Consider setting aside 20% of your income",
      "category": "savings"
    }
  ]
}
```

---

## ✨ Features & Functionality

### Core Features

#### 1. Financial Dashboard
- **Real-time Balance**: Current account balance
- **Monthly Overview**: Income vs expenses
- **Budget Tracking**: Visual budget progress
- **Quick Actions**: Add transactions, set goals
- **Recent Activity**: Latest transactions

#### 2. Expense Tracking
- **Transaction Management**: Add, edit, delete transactions
- **Categorization**: Automatic and manual categorization
- **Search & Filter**: Find specific transactions
- **Export**: Download transaction history

#### 3. Goal Management
- **Goal Setting**: Create short-term and long-term goals
- **Progress Tracking**: Visual progress indicators
- **Timeline Management**: Set target dates
- **Recommendations**: AI-powered goal suggestions

#### 4. AI Assistant
- **Financial Insights**: Personalized financial advice
- **Spending Analysis**: Pattern recognition
- **Budget Recommendations**: Smart budget suggestions
- **Investment Tips**: Market insights and recommendations

#### 5. Investment Tracking
- **Portfolio Overview**: Real-time stock data
- **Multiple Stocks**: Track various stocks
- **Charts & Analytics**: Visual performance data
- **Market Data**: Live price updates

#### 6. User Profile
- **Personal Information**: Name, email, location
- **Preferences**: Currency, language, timezone
- **Statistics**: Goals, savings, activity metrics
- **Settings**: Notification preferences

### Advanced Features

#### Real-time Updates
- **15-second Polling**: Automatic data refresh
- **Live Notifications**: Real-time alerts
- **Auto-sync**: Background data synchronization

#### AI Integration
- **OpenAI API**: Advanced financial analysis
- **Personalized Tips**: User-specific recommendations
- **Pattern Recognition**: Spending habit analysis
- **Predictive Analytics**: Future financial projections

#### Security Features
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs encryption
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Cross-origin security

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key
- Git

### Backend Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd "FuturePath Ai/backend"
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finpilot
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here
```

4. **Start Development Server**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to Frontend**
```bash
cd "../frontend"
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

### Database Setup

1. **Install MongoDB**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb

# Windows
# Download from mongodb.com
```

2. **Start MongoDB**
```bash
# Ubuntu/Debian
sudo systemctl start mongodb

# macOS
brew services start mongodb

# Windows
# Start MongoDB service
```

3. **Verify Connection**
```bash
mongo
# or
mongosh
```

---

## 🚀 Deployment

### Backend Deployment

#### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finpilot
JWT_SECRET=your-production-secret-key
OPENAI_API_KEY=your-openai-api-key
```

#### Production Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Frontend Deployment

#### Build Process
```bash
npm run build
```

#### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

### Deployment Platforms

#### Heroku
```bash
# Backend
heroku create futurepath-ai-backend
git push heroku main

# Frontend
heroku create futurepath-ai-frontend
git push heroku main
```

#### Vercel (Frontend)
```bash
npm install -g vercel
vercel --prod
```

#### Railway
```bash
railway login
railway init
railway up
```

---

## 🔒 Security

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Token Expiration**: Configurable token lifetime
- **Secure Headers**: CORS and security headers

### Data Security
- **Input Validation**: Comprehensive validation using express-validator
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Token-based CSRF protection

### API Security
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Request Validation**: All inputs validated
- **Error Handling**: Secure error messages
- **Logging**: Comprehensive security logging

### Environment Security
- **Environment Variables**: Sensitive data in .env
- **Production Secrets**: Different secrets for production
- **API Key Management**: Secure API key storage
- **Database Security**: MongoDB authentication

---

## 🧪 Testing

### Backend Testing

#### Unit Tests
```bash
npm test
```

#### API Testing
```bash
# Using Postman or similar
GET /api/health
POST /api/register
POST /api/login
```

#### Database Testing
```bash
# Test MongoDB connection
mongo finpilot --eval "db.users.find()"
```

### Frontend Testing

#### Component Testing
```bash
npm run test
```

#### E2E Testing
```bash
npm run test:e2e
```

#### Manual Testing Checklist
- [ ] User registration
- [ ] User login/logout
- [ ] Dashboard functionality
- [ ] Transaction management
- [ ] Goal creation and tracking
- [ ] AI assistant features
- [ ] Responsive design
- [ ] Cross-browser compatibility

---

## ⚡ Performance

### Backend Performance
- **Database Indexing**: Optimized MongoDB queries
- **Caching**: Implement Redis for caching
- **Compression**: gzip compression
- **Connection Pooling**: MongoDB connection pooling

### Frontend Performance
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format and compression
- **Bundle Optimization**: Tree shaking and minification
- **CDN**: Content Delivery Network for assets

### Monitoring
- **Error Tracking**: Implement error monitoring
- **Performance Metrics**: Track Core Web Vitals
- **Uptime Monitoring**: Service health checks
- **Analytics**: User behavior tracking

---

## 📊 Project Statistics

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

---

## 🔮 Future Enhancements

### Planned Features
1. **Mobile App**: React Native implementation
2. **Advanced Analytics**: Machine learning insights
3. **Multi-currency Support**: International currencies
4. **Bank Integration**: Direct bank account linking
5. **Tax Planning**: Automated tax calculations
6. **Social Features**: Share goals and achievements
7. **Voice Commands**: Voice-activated features
8. **Offline Support**: PWA capabilities

### Technical Improvements
1. **Microservices**: Break down into microservices
2. **GraphQL**: Implement GraphQL API
3. **Real-time**: WebSocket implementation
4. **Caching**: Redis integration
5. **Monitoring**: Advanced monitoring tools
6. **Testing**: Comprehensive test coverage
7. **CI/CD**: Automated deployment pipeline
8. **Security**: Advanced security features

---

## 📞 Support & Contact

### Development Team
- **Project Lead**: [Your Name]
- **Backend Developer**: [Your Name]
- **Frontend Developer**: [Your Name]
- **UI/UX Designer**: [Your Name]

### Contact Information
- **Email**: support@futurepath-ai.com
- **GitHub**: [Repository URL]
- **Documentation**: [Documentation URL]

### Bug Reports
Please report bugs and issues through:
- GitHub Issues
- Email support
- In-app feedback

---

## 📄 License

This project is licensed under the ISC License.

---

*Last Updated: January 2024*
*Version: 1.0.0*
*Documentation Version: 1.0* 