@echo off
echo Starting SmartHire Application in Demo Mode
echo ==========================================

REM Set environment variables for demo mode
set NODE_ENV=development

REM Start the backend server in the background
start "Backend Server" cmd /k "cd /d "%~dp0" && npx tsx server/index.ts"

REM Wait a moment for the server to start
timeout /t 3 /nobreak >nul

REM Start the frontend
cd /d "%~dp0client"
npx vite --host