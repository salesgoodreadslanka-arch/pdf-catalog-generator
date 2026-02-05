# 🚨 INSTALL PYTHON & NODE.JS FIRST

## ❌ Current Issue
You don't have Python or Node.js installed. You need both to run this application.

---

## ✅ Step 1: Install Python (Required for Backend)

### Download Python:
1. **Go to:** https://www.python.org/downloads/
2. **Download:** Python 3.11 or 3.12 (Windows installer)
3. **IMPORTANT:** During installation, CHECK the box that says **"Add Python to PATH"**
4. Click "Install Now"

### Verify Installation:
Open a NEW PowerShell window and run:
```powershell
python --version
```
You should see: `Python 3.11.x` or similar

---

## ✅ Step 2: Install Node.js (Required for Frontend)

### Download Node.js:
1. **Go to:** https://nodejs.org/
2. **Download:** LTS version (Long Term Support)
3. Run the installer
4. Click "Next" through all steps (default settings are fine)

### Verify Installation:
Open a NEW PowerShell window and run:
```powershell
node --version
npm --version
```
You should see version numbers for both

---

## ✅ Step 3: After Installing Both, Run the Application

### Open PowerShell and run these commands:

**For Backend:**
```powershell
# Navigate to backend
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend

# Install Python packages
pip install -r requirements.txt

# Setup environment (first time only)
copy .env.example .env

# Edit .env file to add your spreadsheet ID
notepad .env

# Run the backend
python main.py
```

**For Frontend (in a NEW PowerShell window):**
```powershell
# Navigate to frontend
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend

# Install Node packages (first time only)
npm install

# Run the frontend
npm run dev
```

---

## 🎯 Quick Summary

1. **Install Python** from https://www.python.org/downloads/ ✅ CHECK "Add to PATH"
2. **Install Node.js** from https://nodejs.org/ 
3. **Restart PowerShell** (close and open new window)
4. **Run backend** with `python main.py`
5. **Run frontend** with `npm run dev`
6. **Open browser** to http://localhost:3000

---

## ⚠️ Don't Forget Before Running:

You also need **Google Sheets credentials**:
1. Go to https://console.cloud.google.com/
2. Create a Service Account
3. Download `credentials.json`
4. Place it in the `backend` folder
5. Share your Google Sheet with the service account email

---

## 📞 Need Help?

After installing Python and Node.js, if you still have issues, let me know and I'll help troubleshoot!
