@echo off
echo Starting all servers including SIP recommendation service...
echo.

echo [1/4] Starting MongoDB (if not running)...
net start MongoDB >nul 2>&1

echo [2/4] Starting Python SIP Server...
start "SIP Server" cmd /k "cd backend\sip_advisor && pip install -r requirements.txt && python sip_api_server.py"

echo [3/4] Starting Node.js Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

echo [4/4] Starting React Frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo All servers are starting...
echo.
echo SIP Server: http://localhost:8001
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
