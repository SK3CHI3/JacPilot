@echo off
echo Starting Gemini Proxy Service...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Flask is installed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installing Flask and flask-cors...
    pip install flask flask-cors requests
)

REM Navigate to helpers directory
cd helpers

REM Set GEMINI_API_KEY - use environment variable
REM IMPORTANT: Set this in environment or .env file - DO NOT hardcode keys!
if "%GEMINI_API_KEY%"=="" (
    echo ERROR: GEMINI_API_KEY not set! Please set it in environment or .env file
    pause
    exit /b 1
) else (
    echo Using GEMINI_API_KEY from environment
)

REM Start Flask proxy service
echo Starting Gemini Proxy on http://localhost:8001
python gemini_proxy.py

pause

