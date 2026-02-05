# ✅ Backend Setup Complete!

## 🎉 What's Done

✅ **Python 3.12 installed**  
✅ **All Python dependencies installed** (FastAPI, ReportLab, Google Sheets API, etc.)  
✅ **Environment file created** (`.env`)

---

## ⚠️ Before You Can Run

### 1. Add Your Spreadsheet ID

Edit the `.env` file in the `backend` folder:

```
SPREADSHEET_ID=1hOvDcXwQVeDfgAYmZ3OZHhLBJJKYZGH-rzfnLRDF5DQ
```

Change this to YOUR Google Sheets ID (or keep it if using the same sheet).

### 2. Add Google Credentials

1. Download `credentials.json` from Google Cloud Console
2. Place it in: `C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend\credentials.json`

---

## 🚀 Run the Backend

In the Antigravity terminal, run:

```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
python main.py
```

The backend will start at: **http://localhost:8000**

---

## 📱 Frontend Setup (Node.js)

Node.js is installed but needs PATH refresh. **Two options:**

### Option 1: Use Regular PowerShell (Easier)
1. Open regular PowerShell (not Antigravity terminal)
2. Run:
```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend
npm install
npm run dev
```

### Option 2: Use Batch File
Double-click `START_FRONTEND.bat` in File Explorer

---

## 🎯 Quick Start Commands

**Backend (in Antigravity terminal):**
```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
python main.py
```

**Frontend (in regular PowerShell or double-click START_FRONTEND.bat):**
```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend
npm install
npm run dev
```

Then open: **http://localhost:3000** 🎉
