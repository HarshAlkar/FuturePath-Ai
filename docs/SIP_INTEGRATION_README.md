# SIP AI Integration Guide

This guide explains how the Python SIP model from your Jupyter notebook has been integrated into your FuturePath AI application.

## 🎯 What's Been Integrated

### 1. Python SIP API Server (`backend/sip_advisor/`)
- **File**: `sip_api_server.py` - FastAPI server with Gemini AI integration
- **Port**: 8001
- **Features**:
  - Live mutual fund data from mfapi.in
  - Gemini AI-powered recommendations
  - Risk-based fund filtering
  - Advanced fund analysis (CAGR, volatility)

### 2. Node.js Backend Integration (`backend/server.js`)
- Updated `/api/sip/recommendations` endpoint to call Python service
- Fallback to basic recommendations if Python service fails
- 30-second timeout for AI processing

### 3. Frontend Integration (`frontend/src/components/SipRecommendation.jsx`)
- New AI recommendations section with purple gradient
- Displays Gemini AI analysis
- Maintains existing fund recommendations

## 🚀 How to Start the Integrated System

### Option 1: Start All Servers with SIP (Recommended)
```bash
start-all-servers-with-sip.bat
```
This starts:
- Python SIP Server (port 8001)
- Node.js Backend (port 5000) 
- React Frontend (port 3002)

### Option 2: Start Individual Services
```bash
# Start Python SIP Server only
start-sip-server.bat

# Start other services
start-all-servers.bat
```

## 🧪 Testing the Integration

### Test Script
```bash
node test-sip-integration.js
```

### Manual Testing
1. **Python SIP Server**: http://localhost:8001/health
2. **Node.js Backend**: http://localhost:5000/api/health
3. **Frontend**: http://localhost:3002 → Goals → SIP Recommendations

## 📊 API Endpoints

### Python SIP Server (Port 8001)
- `GET /` - Server status
- `GET /health` - Health check
- `POST /recommend` - Get SIP recommendations

### Node.js Backend (Port 5000)
- `POST /api/sip/recommendations` - Integrated SIP recommendations
- `POST /api/sip/calculate` - SIP calculations

## 🔧 Configuration

### Gemini API Key
The API key is hardcoded in `backend/sip_advisor/sip_api_server.py`:
```python
GEMINI_API_KEY = "AIzaSyDq8Ejg1Cx46i9LUDgnLMRsgLY-ijk2Tfg"
```

### Dependencies
Python requirements are in `backend/sip_advisor/requirements.txt`:
- fastapi==0.104.1
- uvicorn==0.24.0
- requests==2.31.0
- pandas==2.1.3
- google-generativeai==0.3.2
- numpy==1.24.3
- pydantic==2.5.0

## 🎨 Frontend Features

### AI Recommendations Section
- Purple gradient background
- AI badge with "AI" text
- Formatted AI analysis from Gemini
- Preserves line breaks and formatting

### Fund Recommendations
- Traditional fund list
- Fallback when AI service unavailable
- Risk-based categorization

## 🔄 How It Works

1. **User Input**: User enters income, horizon, risk level
2. **Frontend**: Calls Node.js backend `/api/sip/recommendations`
3. **Node.js**: Forwards request to Python SIP service
4. **Python**: 
   - Fetches live fund data from mfapi.in
   - Filters funds by risk level
   - Analyzes fund performance (CAGR, volatility)
   - Sends top funds to Gemini AI
   - Returns AI recommendations
5. **Node.js**: Returns combined response to frontend
6. **Frontend**: Displays AI recommendations + fund list

## 🛠️ Troubleshooting

### Python SIP Server Not Starting
```bash
cd backend/sip_advisor
pip install -r requirements.txt
python sip_api_server.py
```

### Gemini API Errors
- Check API key is valid
- Ensure internet connection
- Check API quota limits

### Integration Issues
- Verify Python server on port 8001
- Check Node.js backend on port 5000
- Run test script: `node test-sip-integration.js`

## 📈 Performance Notes

- **AI Processing**: 10-30 seconds for recommendations
- **Fallback**: Basic recommendations if AI fails
- **Caching**: Consider adding Redis for fund data caching
- **Rate Limiting**: Gemini API has usage limits

## 🔐 Security Considerations

- API key is currently hardcoded (move to environment variables)
- Add authentication to Python service
- Implement rate limiting
- Add input validation

## 🎯 Next Steps

1. **Environment Variables**: Move API key to `.env` file
2. **Authentication**: Add JWT validation to Python service
3. **Caching**: Cache fund data to reduce API calls
4. **Monitoring**: Add logging and error tracking
5. **Testing**: Add unit tests for Python service

## 📞 Support

If you encounter issues:
1. Check all services are running
2. Run the test script
3. Check console logs for errors
4. Verify internet connection for API calls
