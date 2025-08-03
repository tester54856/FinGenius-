#!/bin/bash

echo "🔧 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🏗️ Building TypeScript..."
npm run build

# Check if build was successful
if [ -f "dist/index.js" ]; then
    echo "✅ Build successful! dist/index.js exists."
    ls -la dist/
else
    echo "❌ Build failed! dist/index.js not found."
    exit 1
fi

echo "🚀 Build process completed!" 