@echo off
echo Loading Jac files...
echo.

REM Add Python scripts to PATH
set PATH=%PATH%;C:\Users\vomol\AppData\Roaming\Python\Python313\Scripts

REM Load main Jac file
echo Loading main.jac...
jsctl jac build jac/main.jac

echo.
echo Done! Jac files loaded.
pause




