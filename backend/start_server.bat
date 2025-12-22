@echo off
echo Starting Jaseci Server...
echo.

REM Add Python scripts to PATH
set PATH=%PATH%;C:\Users\vomol\AppData\Roaming\Python\Python313\Scripts

REM Set GEMINI_API_KEY for byLLM integration
REM IMPORTANT: Set this in environment or .env file - DO NOT hardcode keys!
if "%GEMINI_API_KEY%"=="" (
    echo WARNING: GEMINI_API_KEY not set! byLLM features will not work.
    echo Please set GEMINI_API_KEY environment variable or add it to .env file
) else (
    echo Using GEMINI_API_KEY from environment
)

REM Set CORS environment variables (jac_cloud reads these)
set ALLOW_ORIGINS=*
set ALLOW_METHODS=*
set ALLOW_HEADERS=*

REM Start Jaseci server using jac serve
echo Starting Jaseci server on http://localhost:8000
echo CORS enabled for all origins
cd /d %~dp0
jac serve jac/main.jac --host 0.0.0.0 --port 8000

pause

