@echo off
echo Starting Gold Dashboard Server...
echo.

cd backend

echo Installing dependencies if needed...
npm install

echo.
echo Starting Gold Server on port 5001...
echo Make sure MongoDB is running!
echo.

node gold-server.js

pause
