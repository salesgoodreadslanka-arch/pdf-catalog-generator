# 🚀 Auto-Install Python & Node.js via Terminal

## Option 1: Using Winget (Windows Package Manager) - EASIEST

### Install Python:
```powershell
winget install Python.Python.3.12
```

### Install Node.js:
```powershell
winget install OpenJS.NodeJS.LTS
```

### After installation, restart PowerShell and verify:
```powershell
python --version
node --version
npm --version
```

---

## Option 2: Using Chocolatey (if you have it)

### Install Python:
```powershell
choco install python -y
```

### Install Node.js:
```powershell
choco install nodejs-lts -y
```

---

## Option 3: Download via PowerShell (Manual Install)

### Download Python Installer:
```powershell
# Download Python installer
Invoke-WebRequest -Uri "https://www.python.org/ftp/python/3.12.1/python-3.12.1-amd64.exe" -OutFile "$env:TEMP\python-installer.exe"

# Run installer (you'll need to click through the installation)
Start-Process -FilePath "$env:TEMP\python-installer.exe" -Wait
```

### Download Node.js Installer:
```powershell
# Download Node.js installer
Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi" -OutFile "$env:TEMP\node-installer.msi"

# Run installer
Start-Process -FilePath "$env:TEMP\node-installer.msi" -Wait
```

---

## ✅ RECOMMENDED: Try Winget First

**Copy and paste these commands one by one:**

```powershell
# Install Python
winget install Python.Python.3.12

# Install Node.js
winget install OpenJS.NodeJS.LTS

# Close and reopen PowerShell, then verify:
python --version
node --version
```

---

## 🎯 After Installation Complete

Once both are installed, run these commands:

```powershell
# Navigate to your project
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Setup environment
copy .env.example .env
notepad .env
# Add your SPREADSHEET_ID in the .env file, then save and close

# Run backend
python main.py
```

**In a NEW PowerShell window:**
```powershell
# Navigate to frontend
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend

# Install frontend dependencies
npm install

# Run frontend
npm run dev
```

Then open: **http://localhost:3000** in your browser! 🎉
