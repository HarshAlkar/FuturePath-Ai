@echo off
echo Checking FuturePath AI Servers...
echo.

echo ========================================
echo Checking Main Backend (Port 5000)
echo ========================================
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Main Backend: RUNNING
) else (
    echo ❌ Main Backend: NOT RUNNING
)

echo.
echo ========================================
echo Checking Gold Server (Port 5001)
echo ========================================
curl -s http://localhost:5001/api/health >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Gold Server: RUNNING
) else (
    echo ❌ Gold Server: NOT RUNNING
)

echo.
echo ========================================
echo Checking Frontend (Port 3002)
echo ========================================
curl -s http://localhost:3002 >nul 2>&1
if %errorlevel%==0 (
    echo ✅ Frontend: RUNNING
) else (
    echo ❌ Frontend: NOT RUNNING
)

echo.
echo ========================================
echo Server Status Complete
echo ========================================
pause
