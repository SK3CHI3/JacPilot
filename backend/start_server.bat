@echo off
echo Starting Jaseci Server...
echo.

REM Add Python scripts to PATH
set PATH=%PATH%;C:\Users\vomol\AppData\Roaming\Python\Python313\Scripts

REM Set GEMINI_API_KEY for byLLM integration
if "%GEMINI_API_KEY%"=="" (
    set GEMINI_API_KEY=AIzaSyCH5gYFaTRPkCvI92Rlp--TgVgdR9aW-C0
    echo Using GEMINI_API_KEY from script
) else (
    echo Using GEMINI_API_KEY from environment
)

REM Set TOKEN_SECRET for JWT authentication
set TOKEN_SECRET=secret

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

