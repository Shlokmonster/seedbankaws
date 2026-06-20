#!/bin/bash
# SeedBank Setup Script

echo "🔧 Starting SeedBank setup..."

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

echo "✅ Setup complete! Run ./deploy.sh to start the application."
