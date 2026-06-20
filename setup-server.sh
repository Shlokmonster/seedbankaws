#!/bin/bash
# SeedBank Production Server Setup Script
set -e

echo "🚀 Starting SeedBank server setup..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
DOCKER_COMPOSE_VERSION="v2.20.0"
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p ~/seedbank/logs
mkdir -p ~/seedbank/backend/uploads

# Verify installation
echo "✅ Verifying installation..."
docker --version
docker-compose --version

echo "🎉 Server setup complete! Please log out and log back in for Docker group changes to take effect."
