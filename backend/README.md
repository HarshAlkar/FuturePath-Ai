# Backend API for FinPilot

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the backend directory with:
```
PORT=5000
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb://localhost:27017/finpilot
OPENAI_API_KEY=your-openai-api-key-here
```

3. Get an OpenAI API key:
- Visit https://platform.openai.com/
- Create an account and get your API key
- Add it to the `.env` file

4. Start the server:
```bash
npm start
```

## Features

- User authentication (JWT)
- Transaction management
- Goal management
- **AI-powered financial plan generation** (NEW!)
  - Personalized plans based on goal details and transaction history
  - Uses OpenAI GPT-3.5-turbo for intelligent recommendations
  - Fallback plan generation if AI is unavailable

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get transaction statistics

### Goals
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/plan` - Generate AI plan for goal (NEW!)

## AI Plan Generation

The AI plan generation endpoint (`POST /api/goals/:id/plan`) provides:

1. **Personalized Analysis**: Uses your transaction history and goal details
2. **Smart Recommendations**: Monthly savings targets, spending adjustments
3. **Milestone Tracking**: Clear checkpoints to monitor progress
4. **Actionable Tips**: Practical advice for staying on track
5. **Alternative Strategies**: Backup plans if needed

The AI considers:
- Your current financial situation
- Recent spending patterns
- Goal timeline and amount
- Progress made so far
- Available monthly savings

## Health Check
- `GET /api/health` - Server status 