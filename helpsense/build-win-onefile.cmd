@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js/npm is required to build the one-file Windows executable.
  echo Install Node.js from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)

call npm install
if errorlevel 1 pause & exit /b 1

call npm run dist:win
if errorlevel 1 pause & exit /b 1

echo.
echo Done. Look in the release folder for the portable .exe.
pause
