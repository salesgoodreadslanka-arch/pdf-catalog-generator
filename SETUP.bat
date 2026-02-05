@echo off
echo ========================================
echo   PDF Catalog Generator - Setup
echo ========================================
echo.

echo Step 1: Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found in PATH
    echo Please close this window and open a NEW PowerShell window
    pause
    exit /b 1
)
echo ✓ Python installed successfully!
echo.

echo Step 2: Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found in PATH
    echo Please close this window and open a NEW PowerShell window
    pause
    exit /b 1
)
echo ✓ Node.js installed successfully!
echo.

echo Step 3: Installing Python dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✓ Python dependencies installed!
cd ..
echo.

echo Step 4: Installing Node.js dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo ✓ Node.js dependencies installed!
cd ..
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Setup Google Sheets credentials (see README.md)
echo 2. Edit backend\.env file with your SPREADSHEET_ID
echo 3. Run START_BACKEND.bat to start the backend
echo 4. Run START_FRONTEND.bat to start the frontend
echo.
pause
