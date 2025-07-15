# FinPilot Backend

A Node.js/Express backend for the FinPilot application with user authentication.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS enabled for frontend integration
- File-based JSON database (for development)

## Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional):
   ```bash
   JWT_SECRET=your-super-secret-key-here
   PORT=5000
   ```

4. Start the server:
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

- `POST /api/signup` - Register a new user
- `POST /api/login` - Login user
- `GET /api/profile` - Get user profile (protected route)
- `GET /api/health` - Health check

### Request/Response Examples

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

#### Profile (requires Authorization header)
```bash
GET /api/profile
Authorization: Bearer <jwt-token>
```

## Data Storage

User data is stored in `data/users.json` file. In production, consider using a proper database like MongoDB or PostgreSQL.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- Error handling 