#!/bin/bash
# SeedBank Health Check Script
BACKEND_URL="http://localhost:5001/api/health"
FRONTEND_URL="http://localhost"

echo "🔍 Checking SeedBank health..."

# Check backend health
echo "Checking backend at $BACKEND_URL..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL || echo "000")

if [ "$BACKEND_STATUS" = "200" ]; then
  echo "✅ Backend is healthy"
else
  echo "❌ Backend is unhealthy (status code: $BACKEND_STATUS)"
fi

# Check frontend health
echo "Checking frontend at $FRONTEND_URL..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL || echo "000")

if [ "$FRONTEND_STATUS" = "200" ]; then
  echo "✅ Frontend is healthy"
else
  echo "❌ Frontend is unhealthy (status code: $FRONTEND_STATUS)"
fi

# Summary
if [ "$BACKEND_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
  echo "🎉 All services are healthy!"
  exit 0
else
  echo "⚠️  One or more services are unhealthy!"
  exit 1
fi
