@echo off
echo Starting FuturePath AI Real-time Investment Platform...
echo.

echo Starting main server...
start "Main Server" cmd /k "cd backend && npm start"

echo Waiting 3 seconds for main server to start...
timeout /t 3 /nobreak > nul

echo Starting real-time stock server...
start "Real-time Server" cmd /k "cd backend && npm run start:realtime"

echo.
echo Both servers are starting...
echo Main server: http://localhost:5000
echo Real-time server: http://localhost:5000/ws
echo.
echo Press any key to close this window...
pause > nul
