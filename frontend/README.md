# FinPilot - AI-Powered Financial Management Platform

A modern, full-stack financial management application with AI-powered insights, expense tracking, and goal planning.

## 🚀 Features

### Frontend
- **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS
- **Authentication**: Secure login/signup with JWT tokens
- **Dashboard**: AI-powered financial insights and analytics
- **Expense Tracking**: Comprehensive expense management
- **Goal Planning**: Financial goal setting and tracking
- **Real-time Updates**: Live data synchronization

### Backend
- **RESTful API**: Express.js server with comprehensive endpoints
- **Authentication**: JWT-based user authentication
- **Data Validation**: Input validation and sanitization
- **Security**: Password hashing with bcrypt
- **CORS Enabled**: Cross-origin resource sharing for frontend integration

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- AOS (Animate On Scroll)

### Backend
- Node.js
- Express.js
- JWT (JSON Web Tokens)
- bcryptjs
- express-validator
- CORS

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Quick Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinPilot
   ```

2. **Run the setup script**
   ```bash
   node setup.js
   ```

### Manual Setup
1. **Install frontend dependencies**
   ```bash
   npm install
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Mode

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm start
   ```

## 📁 Project Structure

```
FinPilot/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── Dashboard/          # Dashboard components
│   ├── LandingPage/        # Landing page components
│   ├── SignUp/            # Authentication components
│   ├── services/          # API services
│   └── assets/            # Static assets
├── backend/               # Backend source code
│   ├── data/              # JSON database files
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── public/                # Public assets
└── package.json           # Frontend dependencies
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- **Registration**: Users can create new accounts
- **Login**: Secure authentication with email/password
- **Protected Routes**: Dashboard access requires authentication
- **Token Storage**: JWT tokens stored in localStorage
- **Auto-logout**: Automatic logout on token expiration

## 📡 API Endpoints

### Authentication
- `POST /api/signup` - Register a new user
- `POST /api/login` - Login user
- `GET /api/profile` - Get user profile (protected)
- `GET /api/health` - Health check

### Request Examples

#### Signup
```json
POST /api/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```json
POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the backend directory:
```env
JWT_SECRET=your-super-secret-key-here
PORT=5000
```

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive validation
- **CORS Protection**: Configured for frontend integration
- **Error Handling**: Proper error responses

## 📊 Data Storage

Currently uses JSON file storage for development. For production, consider:
- MongoDB
- PostgreSQL
- MySQL
- Redis (for caching)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Happy coding! 🎉**
