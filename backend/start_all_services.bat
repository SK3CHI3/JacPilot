@echo off
echo ========================================
echo Starting JacPilot Backend Services
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Install required packages
echo Checking Python dependencies...
pip install flask flask-cors requests >nul 2>&1

echo.
echo Starting services in separate windows...
echo.

REM Start Gemini Proxy (port 8001)
start "Gemini Proxy" cmd /k "cd /d %~dp0helpers && python gemini_proxy.py"

REM Start Supabase Proxy (port 8002)
start "Supabase Proxy" cmd /k "cd /d %~dp0helpers && python supabase_proxy.py"

REM Wait a bit for services to start
timeout /t 3 /nobreak >nul

REM Start Jaseci Server (port 8000)
start "Jaseci Server" cmd /k "cd /d %~dp0 && start_server.bat"

echo.
echo All services started!
echo - Jaseci Server: http://localhost:8000
echo - Gemini Proxy: http://localhost:8001
echo - Supabase Proxy: http://localhost:8002
echo.
echo Press any key to exit this window (services will keep running)...
pause >nul

