@echo off
REM Weight Cut Buddy - Start Script for Windows
REM This script starts both the FastAPI backend and React frontend

echo 🥊 Starting Weight Cut Buddy...

REM Check if .env file exists
if not exist ".env" (
    echo ❌ Error: .env file not found!
    echo Please create a .env file with your OpenAI API key:
    echo OPENAI_API_KEY=your_api_key_here
    pause
    exit /b 1
)

REM Check and install Python dependencies
echo 📦 Checking Python dependencies...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Installing Python dependencies...
    pip install -r requirements.txt
)

REM Check and install Node.js dependencies
echo 📦 Checking Node.js dependencies...
if not exist "frontend\node_modules" (
    echo Installing Node.js dependencies...
    cd frontend
    npm install
    cd ..
)

echo 🚀 Starting FastAPI backend on http://localhost:8000...
cd backend
start /b python main.py
cd ..

echo Waiting for backend to start...
timeout /t 3 >nul

echo 🚀 Starting React frontend on http://localhost:3000...
cd frontend
start npm start
cd ..

echo.
echo ✅ Weight Cut Buddy is running!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📖 API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop...
pause >nul
