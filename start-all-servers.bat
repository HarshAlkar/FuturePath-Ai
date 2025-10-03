@echo off
echo Starting FuturePath AI Servers...
echo.

echo ========================================
echo Starting Main Backend Server (Port 5000)
echo ========================================
start "Main Backend" cmd /k "cd backend && npm run dev"

echo.
echo ========================================
echo Starting Gold Server (Port 5001)
echo ========================================
start "Gold Server" cmd /k "cd backend && node simple-gold-server.js"

echo.
echo ========================================
echo Starting Frontend (Port 3002)
echo ========================================
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All servers are starting...
echo.
echo Main Backend: http://localhost:5000
echo Gold Server: http://localhost:5001
echo Frontend: http://localhost:3002
echo.
echo Note: For SIP AI recommendations, use start-all-servers-with-sip.bat
echo.
echo Press any key to exit...
pause
