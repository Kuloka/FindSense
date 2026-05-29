@echo off
setlocal
cd /d "%~dp0"
title Findsense
set ELECTRON_RUN_AS_NODE=
echo Starting Findsense...
echo.
echo Opening Findsense as a desktop app...
echo.
if exist "node_modules\.bin\electron.cmd" (
  call "node_modules\.bin\electron.cmd" .
) else (
  echo Electron was not found.
  echo Run npm install, then start this file again.
  echo.
  pause
)
pause
