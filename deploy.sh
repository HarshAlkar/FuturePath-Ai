#!/bin/bash

# FuturePath AI Deployment Script
echo "🚀 Starting FuturePath AI Deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: FuturePath AI application"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found. Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/futurepath-ai.git"
    exit 1
fi

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Build backend
echo "🔨 Building backend..."
cd backend
npm install
cd ..

# Commit and push changes
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy: $(date)"
git push origin main

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Connect your GitHub repository to Vercel/Netlify"
echo "2. Set up environment variables"
echo "3. Configure database connections"
echo "4. Test your deployment"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
