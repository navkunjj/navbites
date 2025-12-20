@echo off
echo Stopping all Node.js processes...
taskkill /F /IM node.exe
timeout /t 2
echo.
echo All Node processes stopped!
echo.
echo Starting backend server...
cd server
start cmd /k "node index.js"
timeout /t 3
echo.
echo Starting frontend...
cd ..
start cmd /k "npm start"
echo.
echo Done! Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause
