@echo off
setlocal
cd /d "%~dp0"
title Findsense Telegram Login
echo Findsense Telegram API login
echo.
echo This will save telegram-config.json in this folder.
echo.
call npm.cmd run telegram:login
echo.
pause
