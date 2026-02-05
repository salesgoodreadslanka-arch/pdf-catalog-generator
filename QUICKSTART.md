# Quick Start Guide - PDF Catalog Generator

## 📍 Finding Your Project Location

Your project is located at:
```
C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator
```

## 🖥️ Opening Terminal and Navigating to Project

### Option 1: Using PowerShell (Recommended for Windows)

1. **Open PowerShell:**
   - Press `Windows Key + X`
   - Click "Windows PowerShell" or "Terminal"

2. **Navigate to project:**
   ```powershell
   cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator
   ```

3. **Verify you're in the right location:**
   ```powershell
   dir
   ```
   You should see: `backend`, `frontend`, and `README.md`

### Option 2: Using File Explorer

1. **Open File Explorer** (Windows Key + E)
2. **Copy this path and paste in address bar:**
   ```
   C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator
   ```
3. **Right-click in the folder** → Select "Open in Terminal"

---

## 🚀 Running the Application

### Step 1: Setup Google Sheets Credentials (REQUIRED FIRST TIME)

1. **Get Google Cloud Service Account credentials:**
   - Go to: https://console.cloud.google.com/
   - Create a project
   - Enable "Google Sheets API"
   - Create Service Account
   - Download `credentials.json`

2. **Place credentials in backend folder:**
   ```powershell
   # You should be in: C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator
   # Copy your downloaded credentials.json to backend folder
   copy "C:\Users\User\Downloads\credentials.json" backend\credentials.json
   ```

3. **Setup environment variables:**
   ```powershell
   cd backend
   copy .env.example .env
   notepad .env
   ```
   
4. **Edit .env file:**
   - Change `SPREADSHEET_ID=1hOvDcXwQVeDfgAYmZ3OZHhLBJJKYZGH-rzfnLRDF5DQ` to your spreadsheet ID
   - Save and close

5. **Share your Google Sheet:**
   - Open your Google Sheet
   - Click "Share"
   - Add the email from `credentials.json` (looks like: `xxx@xxx.iam.gserviceaccount.com`)
   - Give "Viewer" permission

---

### Step 2: Run Backend (Python FastAPI)

```powershell
# Navigate to backend folder
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend

# Install Python dependencies
pip install -r requirements.txt

# Run the backend server
python main.py
```

**Expected output:**
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ **Backend is now running!** Keep this terminal window open.

---

### Step 3: Run Frontend (Next.js) - NEW TERMINAL WINDOW

**Open a NEW PowerShell window** (don't close the backend one!)

```powershell
# Navigate to frontend folder
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend

# Install Node.js dependencies (first time only)
npm install

# Run the development server
npm run dev
```

**Expected output:**
```
- Local:        http://localhost:3000
- Ready in 2.5s
```

✅ **Frontend is now running!**

---

### Step 4: Open in Browser

1. **Open your web browser**
2. **Go to:** http://localhost:3000
3. **You should see the beautiful catalog generator UI!**

---

## ⚠️ Troubleshooting

### "pip is not recognized"
**Solution:** Install Python from https://www.python.org/downloads/
- Make sure to check "Add Python to PATH" during installation

### "npm is not recognized"
**Solution:** Install Node.js from https://nodejs.org/
- Download the LTS version
- Run the installer
- Restart your terminal after installation

### "Cannot find module 'next'"
**Solution:** Make sure you ran `npm install` in the frontend folder

### Backend error: "No module named 'fastapi'"
**Solution:** 
```powershell
cd backend
pip install -r requirements.txt
```

### "Permission denied" for Google Sheets
**Solution:** 
- Make sure you shared the Google Sheet with the service account email
- Check that `credentials.json` is in the `backend` folder

---

## 🎯 Quick Command Reference

### To start both servers:

**Terminal 1 (Backend):**
```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend
python main.py
```

**Terminal 2 (Frontend):**
```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend
npm run dev
```

### To stop servers:
- Press `Ctrl + C` in each terminal window

---

## 📂 Project Structure

```
pdf-catalog-generator/
├── backend/              ← Python FastAPI backend
│   ├── main.py          ← Run this with: python main.py
│   ├── requirements.txt
│   ├── credentials.json ← You need to add this!
│   └── .env            ← Configure your spreadsheet ID here
│
├── frontend/            ← Next.js frontend
│   ├── package.json
│   └── ...             ← Run with: npm run dev
│
└── README.md           ← Full documentation
```

---

## ✅ Checklist Before Running

- [ ] Python installed (check: `python --version`)
- [ ] Node.js installed (check: `node --version`)
- [ ] Google Cloud credentials downloaded
- [ ] `credentials.json` placed in `backend/` folder
- [ ] `.env` file created and configured in `backend/`
- [ ] Google Sheet shared with service account email
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)

---

## 🎉 Once Everything is Running

1. **Backend:** http://localhost:8000 (API server)
2. **Frontend:** http://localhost:3000 (Your beautiful UI)
3. **API Docs:** http://localhost:8000/docs (Swagger UI)

Now you can:
- ✅ Select categories and download category-wise catalogs
- ✅ Select authors and download author-wise catalogs
- ✅ Download full catalog with one click
- ✅ Watch real-time progress bars!
