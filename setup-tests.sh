#!/bin/bash

# Setup script for installing test dependencies
# Run this after initial project setup

set -e

echo "📦 Setting up test environment..."
echo ""

# Client setup
echo "🎨 Setting up Client (React + Vitest)..."
cd client

if [ ! -d "node_modules" ]; then
    echo "Installing client dependencies..."
    npm install
else
    echo "Client dependencies already installed"
fi

echo "✅ Client test environment ready"
echo ""

# Server setup
cd ../server
echo "🚀 Setting up Server (Laravel + PHPUnit)..."

if [ ! -d "vendor" ]; then
    echo "Installing server dependencies..."
    composer install
else
    echo "Server dependencies already installed"
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    php artisan key:generate
fi

echo "✅ Server test environment ready"
echo ""

# Run tests to verify setup
echo "🧪 Running tests to verify setup..."
echo ""

echo "Running client tests..."
cd ../client
npm test -- --run

echo ""
echo "Running server tests..."
cd ../server
php artisan test

echo ""
echo "✨ All done! Test environment is ready."
echo ""
echo "Quick commands:"
echo "  Client tests:  cd client && npm test"
echo "  Server tests:  cd server && php artisan test"
echo ""
echo "See TESTING.md for detailed documentation."
