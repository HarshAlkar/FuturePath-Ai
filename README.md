# FuturePath AI - Intelligent Financial Management Platform

![FuturePath AI](https://img.shields.io/badge/FuturePath-AI-blue)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![AI](https://img.shields.io/badge/AI-OpenAI-orange)

A comprehensive financial management web application that combines traditional finance tracking with AI-powered insights. Built with modern web technologies and real-time data integration.

## 🚀 Features

### Core Features
- **📊 Real-time Dashboard** - Live financial overview with interactive charts
- **💰 Expense Tracking** - Add, edit, and categorize transactions
- **🎯 Goal Planning** - Set financial goals with AI-powered recommendations
- **🤖 AI Assistant** - Natural language financial advice (English & Hindi)
- **📈 Live Stock Integration** - Real-time stock market data
- **📱 Responsive Design** - Works seamlessly on all devices
- **🔐 Secure Authentication** - JWT-based user authentication

### Advanced Features
- **AI-Powered Insights** - Personalized financial recommendations
- **Multi-language Support** - English and Hindi interface
- **Budget Management** - Visual budget tracking with alerts
- **Analytics Dashboard** - Interactive charts and insights
- **Goal Progress Tracking** - Visual progress indicators
- **Real-time Updates** - Live data synchronization

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - Latest React with modern features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization library
- **AOS** - Animate On Scroll library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### External APIs
- **OpenAI GPT-4** - AI-powered financial advice
- **Twelve Data** - Real-time stock market data

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Git**

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/futurepath-ai.git
cd futurepath-ai
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
cd frontend
npm install
```

#### Backend Dependencies
```bash
cd ../backend
npm install
```

### 3. Environment Setup

#### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finpilot
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=your-openai-api-key-here
```

#### Frontend Environment Variables
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_STOCK_API_KEY=your-twelve-data-api-key
```

### 4. Database Setup
Make sure MongoDB is running on your system or use a cloud MongoDB instance.

## 🏃‍♂️ Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend application will start on `http://localhost:5173`

### Production Build

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Production Server
```bash
cd backend
npm start
```

## 📁 Project Structure

```
FuturePath Ai/
├── backend/
│   ├── data/
│   │   └── users.json
│   ├── models/
│   │   ├── Goal.js
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── FinPilot_logo.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIAssistant.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── LandingPage/
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Expense_tracker.jsx
│   │   │   ├── Goals.jsx
│   │   │   ├── Insights.jsx
│   │   │   ├── Investment.jsx
│   │   │   ├── main_dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── goalService.js
│   │   │   ├── transactionService.js
│   │   │   └── userService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get statistics

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/plan` - Generate AI plan

### AI Assistant
- `POST /api/chat` - AI assistant chat
- `GET /api/health` - Health check

## 🎯 Key Features in Detail

### 1. Dashboard
- Real-time financial overview
- Live stock market integration
- Budget tracking with visual progress
- AI-powered recommendations
- Quick action buttons

### 2. Expense Tracking
- Add, edit, and delete transactions
- Categorize expenses (Food, Transport, Entertainment, etc.)
- Income and expense tracking
- Date-based filtering and search
- Real-time balance updates

### 3. Goal Planning
- Create personalized financial goals
- Set target amounts and timelines
- Visual progress tracking
- AI-powered goal recommendations
- Achievement milestones

### 4. AI Assistant
- Natural language interaction
- Multi-language support (English & Hindi)
- Contextual financial advice
- Personalized recommendations
- Spending pattern analysis

### 5. Analytics & Insights
- Interactive charts and graphs
- Category-wise expense breakdown
- Monthly/yearly trends
- Budget vs actual analysis
- Financial health score

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **Input Validation** - express-validator for data sanitization
- **Protected Routes** - Secure access to authenticated features
- **CORS Configuration** - Cross-origin resource sharing setup

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Deploy the backend folder
3. Update frontend API URL to production backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- OpenAI for AI integration
- Twelve Data for stock market API
- React team for the amazing framework
- MongoDB for the database solution
- All contributors and supporters

## 📞 Support

If you have any questions or need support, please:

1. Check the [Issues](https://github.com/yourusername/futurepath-ai/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact the maintainer directly

---

**FuturePath AI** - Empowering financial decisions with AI-driven insights! 🚀 