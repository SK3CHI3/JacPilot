@echo off
echo Starting Jaseci Server...
echo.

REM Add Python scripts to PATH
set PATH=%PATH%;C:\Users\vomol\AppData\Roaming\Python\Python313\Scripts

REM Start Jaseci server using jac serve
echo Starting Jaseci server on http://localhost:8000
cd /d %~dp0
jac serve jac/main.jac --host 0.0.0.0 --port 8000

pause

