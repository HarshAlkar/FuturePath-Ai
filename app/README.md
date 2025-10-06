# FuturePath AI - React Native Mobile App

## Setup Instructions

### Initialize React Native Project
```bash
# Navigate to the app directory
cd app

# Initialize React Native project with Expo
npx create-expo-app@latest FuturePathMobile --template blank

# Or use React Native CLI
npx react-native init FuturePathMobile --template react-native-template-typescript

# Install dependencies
cd FuturePathMobile
npm install
```

### Required Dependencies
```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install axios react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install react-native-chart-kit react-native-svg
npm install @react-native-firebase/app @react-native-firebase/auth
npm install react-native-paper
npm install react-native-reanimated react-native-gesture-handler
npm install @react-native-community/netinfo
npm install react-native-webview
npm install socket.io-client
```

## Project Structure
```
app/FuturePathMobile/
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── Dashboard/
│   │   │   └── MainDashboard.js
│   │   ├── Trading/
│   │   │   ├── StockList.js
│   │   │   ├── OrderScreen.js
│   │   │   └── Holdings.js
│   │   ├── Gold/
│   │   │   ├── GoldDashboard.js
│   │   │   └── GoldBuyScreen.js
│   │   ├── AI/
│   │   │   ├── AIChat.js
│   │   │   ├── StockPrediction.js
│   │   │   └── AIAdvisor.js
│   │   ├── Goals/
│   │   │   └── GoalsScreen.js
│   │   └── Profile/
│   │       └── ProfileScreen.js
│   ├── components/
│   │   ├── Charts/
│   │   ├── Cards/
│   │   └── Buttons/
│   ├── navigation/
│   │   ├── AppNavigator.js
│   │   └── TabNavigator.js
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── websocket.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   └── styles/
│       └── theme.js
├── assets/
│   ├── images/
│   └── fonts/
├── App.js
└── package.json
```

## Features Implemented

### 1. Authentication
- Login & Registration
- JWT Token Management
- Biometric Authentication (Face ID/Touch ID)

### 2. Dashboard
- Portfolio Overview
- Real-time Market Data
- Quick Actions
- Watchlist

### 3. Trading
- Stock Search & Buy/Sell
- Order History
- Holdings View
- Real-time Prices

### 4. Gold Trading
- Gold Price Charts
- Buy/Sell Gold
- Gold Holdings

### 5. AI Features
- AI Chatbot
- Stock Predictions
- AI Advisor
- Market Insights

### 6. Goals
- Financial Goal Tracking
- SIP Management
- Progress Visualization

### 7. Profile
- User Profile Management
- KYC Verification
- Settings & Preferences

## Running the App

### Development
```bash
# For Expo
npm start

# For iOS (requires Mac)
npm run ios

# For Android
npm run android
```

### Production Build
```bash
# Android
cd android
./gradlew assembleRelease

# iOS
cd ios
pod install
# Open Xcode and build
```

## API Integration
Base URL: http://localhost:5000/api

All screens are connected to the backend API with proper authentication and error handling.

## Screenshots & Demo
Mobile app provides the same features as web version, optimized for mobile experience.

