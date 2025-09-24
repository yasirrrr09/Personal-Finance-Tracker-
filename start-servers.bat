@echo off
echo Starting Personal Finance Tracker+ Servers...
echo.

echo Starting Node.js server...
start "Node.js Server" cmd /k "cd server && npm start"

echo Waiting 5 seconds for Node.js server to start...
timeout /t 5 /nobreak > nul

echo Starting Python API server...
start "Python API Server" cmd /k "cd python-api && python app.py"

echo.
echo Both servers are starting...
echo Node.js server: http://localhost:5000
echo Python API server: http://localhost:5001
echo.
echo Press any key to exit...
pause > nul
