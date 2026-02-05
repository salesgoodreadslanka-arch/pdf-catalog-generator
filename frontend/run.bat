@echo off
echo Setting up Portable Node.js Environment...

:: Set the path to the portable node executable
set "NODE_PATH=C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\node_bin\node-v20.11.0-win-x64"

:: Add it to the current session's PATH
set "PATH=%NODE_PATH%;%PATH%"

echo Verifying Node.js...
node --version
:: Use CALL ensures the script doesn't exit after running npm
call npm --version

echo ---------------------------------------------------
echo Installing dependencies (This may take a few minutes)...
echo ---------------------------------------------------
call npm install

echo ---------------------------------------------------
echo Starting Frontend...
echo ---------------------------------------------------
call npm run dev
pause
