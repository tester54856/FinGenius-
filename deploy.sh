#!/bin/bash

echo "🚀 FinGenius Deployment Script"
echo "================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote is set
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ Git remote not set. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/yourrepo.git"
    exit 1
fi

echo "✅ Git repository ready"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Ready for deployment $(date)"
git push origin main

echo ""
echo "🎯 Next Steps:"
echo "==============="
echo ""
echo "1. 🌐 Deploy Backend on Render:"
echo "   - Go to https://dashboard.render.com"
echo "   - Create new Web Service"
echo "   - Connect your GitHub repo"
echo "   - Select 'backend' directory"
echo "   - Set environment variables (see DEPLOYMENT.md)"
echo ""
echo "2. 🎨 Deploy Frontend on Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repo"
echo "   - Select 'client' directory"
echo "   - Set VITE_API_URL to your Render backend URL"
echo ""
echo "3. 🔧 Update Backend CORS:"
echo "   - Update FRONTEND_ORIGIN in Render with your Vercel URL"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎉 Happy deploying!" 