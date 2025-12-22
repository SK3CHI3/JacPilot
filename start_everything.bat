@echo off
echo ========================================
echo Starting JacPilot - All Services
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "backend\start_all_services.bat" (
    echo ERROR: Please run this from the JacPilot root directory
    pause
    exit /b 1
)

echo Step 1: Starting Backend Services...
echo This will open 3 windows (Gemini Proxy, Supabase Proxy, Jaseci Server)
echo.
cd backend
call start_all_services.bat
cd ..

echo.
echo Step 2: Starting Frontend...
echo Opening new window for frontend...
start "JacPilot Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo All services starting!
echo ========================================
echo.
echo Backend Services:
echo   - Jaseci Server: http://localhost:8000
echo   - Gemini Proxy: http://localhost:8001
echo   - Supabase Proxy: http://localhost:8002
echo.
echo Frontend:
echo   - React App: http://localhost:5173
echo.
echo Check the windows that opened for startup status.
echo Press any key to exit this window (services will keep running)...
pause >nul

