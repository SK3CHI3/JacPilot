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

REM Set environment variables
set GEMINI_API_KEY=%GEMINI_API_KEY%
if "%GEMINI_API_KEY%"=="" (
    echo WARNING: GEMINI_API_KEY environment variable is not set
    echo Set it in your .env file or system environment variables
)

REM Start Flask proxy service
echo Starting Gemini Proxy on http://localhost:8001
python gemini_proxy.py

pause

