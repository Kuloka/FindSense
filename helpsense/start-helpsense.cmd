@echo off
setlocal
cd /d "%~dp0"

if exist "node_modules\electron\dist\electron.exe" (
  start "" "node_modules\electron\dist\electron.exe" .
  exit /b 0
)

where node >nul 2>nul
if errorlevel 1 (
  echo helpsense is not installed yet, and Node.js is not available in PATH.
  echo.
  echo Install Node.js 20 or newer, then double-click this file again:
  echo https://nodejs.org/
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not installed or is not available in PATH.
  echo Reinstall Node.js with npm enabled.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\electron" (
  echo Installing helpsense dependencies. This is needed only on the first run...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

call npm run start
if errorlevel 1 (
  echo.
  echo helpsense failed to start.
  pause
  exit /b 1
)
