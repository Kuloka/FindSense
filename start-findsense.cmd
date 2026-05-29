@echo off
setlocal
cd /d "%~dp0"
title Findsense
echo Starting Findsense...
echo.
echo Opening Findsense as a desktop app...
echo.
if exist "helpsense\node_modules\.bin\electron.cmd" (
  call "helpsense\node_modules\.bin\electron.cmd" .
) else (
  echo Electron was not found. Starting browser server instead.
  echo The server address will be shown below.
  echo Press Ctrl+C to stop the server.
  echo.
  node main.js
)
pause
