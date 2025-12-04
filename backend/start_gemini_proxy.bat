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

REM Set GEMINI_API_KEY - use environment variable or default
if "%GEMINI_API_KEY%"=="" (
    set GEMINI_API_KEY=AIzaSyCH5gYFaTRPkCvI92Rlp--TgVgdR9aW-C0
    echo Using GEMINI_API_KEY from script
) else (
    echo Using GEMINI_API_KEY from environment
)

REM Start Flask proxy service
echo Starting Gemini Proxy on http://localhost:8001
python gemini_proxy.py

pause

