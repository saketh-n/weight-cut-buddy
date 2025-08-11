#!/bin/bash

# Weight Cut Buddy - Start Script
# This script starts both the FastAPI backend and React frontend

echo "🥊 Starting Weight Cut Buddy..."

# Function to handle cleanup on exit
cleanup() {
    echo -e "\n🛑 Shutting down Weight Cut Buddy..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your OpenAI API key:"
    echo "OPENAI_API_KEY=your_api_key_here"
    exit 1
fi

# Check if Python dependencies are installed
echo "📦 Checking Python dependencies..."
if ! pip list | grep -q fastapi; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
fi

# Check if Node.js dependencies are installed
echo "📦 Checking Node.js dependencies..."
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing Node.js dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Start FastAPI backend with hot reloading
echo "🚀 Starting FastAPI backend with hot reloading on http://localhost:8000..."
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start React frontend
echo "🚀 Starting React frontend on http://localhost:3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Weight Cut Buddy is running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for both processes
wait
