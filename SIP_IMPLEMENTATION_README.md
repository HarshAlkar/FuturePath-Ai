# SIP Investment Recommendation System

This document describes the implementation of the SIP (Systematic Investment Plan) recommendation system integrated into the FuturePath AI application.

## 🎯 Overview

The SIP recommendation system provides personalized mutual fund recommendations based on user's financial profile, risk tolerance, and investment goals. It's integrated from the Jupyter notebook model into the full-stack application.

## 🏗️ Architecture

### Backend Implementation
- **API Endpoints**: `/api/sip/recommendations` and `/api/sip/calculate`
- **Data Source**: Live mutual fund data from mfapi.in
- **Risk Assessment**: Automated risk level determination
- **SIP Calculations**: Future value projections with compound interest

### Frontend Implementation
- **SIP Service**: `frontend/src/services/sipService.js`
- **SIP Component**: `frontend/src/components/SipRecommendation.jsx`
- **Integration**: Added to Goals page with modal interface

## 📊 Features

### 1. Personalized Recommendations
- **Risk-based filtering**: Low, Moderate, Aggressive risk profiles
- **Fund categorization**: Small Cap, Mid Cap, Large Cap, Balanced, Debt funds
- **Live data**: Real-time mutual fund information from mfapi.in

### 2. SIP Calculations
- **Future Value**: Compound interest calculations
- **Year-wise projections**: Growth tracking over time
- **Return analysis**: Expected vs actual returns
- **Investment planning**: Monthly SIP amount suggestions

### 3. User Interface
- **Interactive form**: Income, horizon, risk level inputs
- **Real-time calculations**: Instant SIP amount suggestions
- **Visual results**: Charts and projections
- **Responsive design**: Mobile-friendly interface

## 🔧 API Endpoints

### POST `/api/sip/recommendations`
Get personalized mutual fund recommendations.

**Request Body:**
```json
{
  "annualIncome": 900000,
  "horizonYears": 10,
  "riskLevel": "moderate"
}
```

**Response:**
```json
{
  "success": true,
  "recommendation": {
    "monthlySip": 11250,
    "annualIncome": 900000,
    "horizonYears": 10,
    "riskLevel": "moderate",
    "fundRecommendations": {
      "totalFunds": 37122,
      "filteredFunds": 1250,
      "recommendations": [
        {
          "rank": 1,
          "schemeName": "HSBC Balanced Advantage Fund - Direct Growth",
          "schemeCode": "151129",
          "category": "Balanced",
          "reason": "This Balanced fund offers a balanced approach...",
          "suitability": "moderate"
        }
      ]
    },
    "timestamp": "2025-01-11T10:30:00.000Z"
  }
}
```

### POST `/api/sip/calculate`
Calculate SIP returns and projections.

**Request Body:**
```json
{
  "monthlySip": 11250,
  "horizonYears": 10,
  "expectedReturn": 12
}
```

**Response:**
```json
{
  "success": true,
  "calculation": {
    "monthlySip": 11250,
    "horizonYears": 10,
    "expectedReturn": 12,
    "totalInvested": 1350000,
    "futureValue": 2456789,
    "totalGains": 1106789,
    "returnPercentage": 82.0,
    "yearlyProjections": [
      {
        "year": 1,
        "invested": 135000,
        "value": 145678,
        "gains": 10678,
        "returnPercentage": 7.9
      }
    ]
  }
}
```

## 🎨 Frontend Components

### SipRecommendation Component
- **Location**: `frontend/src/components/SipRecommendation.jsx`
- **Features**:
  - Interactive form for user inputs
  - Real-time SIP amount calculation
  - Fund recommendations display
  - SIP returns projection
  - Risk level visualization

### SipService
- **Location**: `frontend/src/services/sipService.js`
- **Methods**:
  - `getRecommendations()`: Fetch fund recommendations
  - `calculateSip()`: Calculate SIP returns
  - `getRiskLevel()`: Determine risk level
  - `calculateSuggestedSip()`: Suggest SIP amount

## 🔄 Integration with Goals Page

The SIP recommendation system is integrated into the Goals page:

1. **SIP Button**: Added "SIP Recommendations" button in the header
2. **Modal Interface**: Opens SIP recommendation modal
3. **User Profile**: Uses existing user income data
4. **Goal Integration**: Can create SIP-based investment goals

## 🧪 Testing

### Backend Testing
```bash
# Run the test script
node test_sip_api.js
```

### Frontend Testing
1. Navigate to Goals page
2. Click "SIP Recommendations" button
3. Fill in the form with test data
4. Verify recommendations and calculations

## 📈 Risk Levels

### Low Risk (Conservative)
- **Target**: Capital preservation
- **Funds**: Debt, Liquid, Gilt, Corporate Bond
- **Returns**: 6-8% annually
- **Suitability**: Risk-averse investors

### Moderate Risk (Balanced)
- **Target**: Balanced growth
- **Funds**: Flexi Cap, Large & Mid Cap, Multi Cap, Hybrid
- **Returns**: 10-12% annually
- **Suitability**: Most investors

### Aggressive Risk (Growth)
- **Target**: High returns
- **Funds**: Small Cap, Midcap, Sectoral, Thematic
- **Returns**: 12-15% annually
- **Suitability**: Young investors with high risk tolerance

## 💡 Usage Examples

### Basic SIP Recommendation
```javascript
// Get recommendations for a moderate risk investor
const response = await sipService.getRecommendations(
  900000,  // Annual income
  10,      // 10 years horizon
  'moderate' // Risk level
);
```

### SIP Calculation
```javascript
// Calculate returns for ₹11,250 monthly SIP
const calculation = await sipService.calculateSip(
  11250,   // Monthly SIP
  10,      // 10 years
  12       // 12% expected return
);
```

## 🚀 Deployment

### Backend
1. Ensure Node.js dependencies are installed
2. Set up environment variables
3. Start the server: `npm start`

### Frontend
1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Serve the application

## 🔒 Security

- **Authentication**: JWT token required for all endpoints
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API rate limiting to prevent abuse
- **Data Privacy**: User data is not stored permanently

## 📊 Performance

- **API Response Time**: < 2 seconds for recommendations
- **Fund Data**: Live data from mfapi.in
- **Caching**: Recommendations cached for 1 hour
- **Error Handling**: Graceful fallbacks for API failures

## 🛠️ Future Enhancements

1. **AI Integration**: Use Gemini API for advanced recommendations
2. **Portfolio Tracking**: Track actual SIP investments
3. **Goal Integration**: Link SIP recommendations to financial goals
4. **Notifications**: SIP reminders and updates
5. **Analytics**: Investment performance tracking

## 📝 Notes

- The system uses live mutual fund data from mfapi.in
- SIP calculations use compound interest formulas
- Risk assessment is based on fund categories and names
- All monetary values are in Indian Rupees (₹)
- The system is designed for Indian mutual fund investments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues or questions regarding the SIP implementation:
1. Check the API health endpoint: `/api/health`
2. Review the test script: `test_sip_api.js`
3. Check browser console for frontend errors
4. Verify backend server is running on port 5000
