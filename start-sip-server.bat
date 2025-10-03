@echo off
echo Starting Python SIP Recommendation Server...
echo.

cd backend\sip_advisor

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Starting SIP API server on port 8001...
echo You can test it at: http://localhost:8001
echo.

python sip_api_server.py

pause
