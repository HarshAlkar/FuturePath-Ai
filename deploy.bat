@echo off
echo 🚀 Starting FuturePath AI Deployment...

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: FuturePath AI application"
)

REM Build frontend
echo 🔨 Building frontend...
cd frontend
call npm install
call npm run build
cd ..

REM Build backend
echo 🔨 Building backend...
cd backend
call npm install
cd ..

REM Commit and push changes
echo 📤 Pushing to GitHub...
git add .
git commit -m "Deploy: %date% %time%"
git push origin main

echo ✅ Deployment complete!
echo.
echo Next steps:
echo 1. Connect your GitHub repository to Vercel/Netlify
echo 2. Set up environment variables
echo 3. Configure database connections
echo 4. Test your deployment
echo.
echo 📚 See DEPLOYMENT_GUIDE.md for detailed instructions
pause
