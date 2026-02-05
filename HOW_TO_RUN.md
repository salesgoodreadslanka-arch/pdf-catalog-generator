# 🚀 How to Run: PDF Catalog Generator (Full Guide)

This guide contains everything you need to run the application in your current environment (Antigravity Terminal).

---

## 🏗️ Architecture Overview

- **Backend (Python)**: Runs on port `8000`. Handles data fetching (Google Sheets) and PDF generation.
- **Frontend (Node.js)**: Runs on port `3000`. User interface for selecting categories and downloading.

---

## ⚡ Step 1: Start the Backend (Python)

1. Open your **Antigravity Terminal**.
2. Copy and paste this **entire command block**:

```powershell
# Navigate to backend and fix path
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Run the server
python main.py
```

**What to expect:**
- If you have `credentials.json`, it connects to Google Sheets.
- If **NOT**, it prints: `Warning: credentials.json not found. Running in MOCK MODE.` (This is fine!)
- Success message: `INFO: Uvicorn running on http://0.0.0.0:8000`

---

## 🎨 Step 2: Start the Frontend (Node.js)

Since your terminal has issues with the system Node.js, we use the **portable version** included in the project.

1. Open a **NEW** terminal (or split the current one).
2. Run the magic script located in the `frontend` folder:

```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend
.\run.bat
```

**What this script does:**
- Authenticates using the portable Node.js.
- Installs dependencies (if missing).
- Starts the development server.
- Success message: `- Local: http://localhost:3000`

---

## 🌐 Step 3: Open the App

1. Open your web browser.
2. Go to: **[http://localhost:3000](http://localhost:3000)**

You can now use the app! 
- In **Mock Mode**, you will see sample data (books by Agatha Christie, etc.).
- The "Download" buttons will generate real PDFs based on that mock data.

---

## 🔑 How to Add Real Data (Switch from Mock to Real)

Currently, the app works in **Demo Mode**. To use your **own Google Sheet**:

1. **Get Credentials:**
   - Go to Google Cloud Console.
   - Create a Service Account & download `credentials.json`.
   - Copy `credentials.json` into: `backend/credentials.json`.

2. **Share Sheet:**
   - Open your Google Sheet.
   - Share it with the `client_email` found inside `credentials.json`.

3. **Configure ID:**
   - Open `backend/.env`.
   - Update `SPREADSHEET_ID` with your sheet's ID.

4. **Restart Backend:**
   - Stop the backend (Ctrl+C).
   - Run the Step 1 command again.
   - Ideally, you will NOT see the "Mock Mode" warning anymore.

---

## 🛠️ Troubleshooting

**"Port already in use"**
- This means the server is already running in another window.
- Close other terminals or find the running process and stop it (Ctrl+C).

**"npm not recognized"**
- **Do not** run `npm run dev` manually.
- **ALWAYS** use `.\run.bat` in the frontend folder.

**"No module named..." (Backend)**
- Run: `pip install -r requirements.txt` (This should be auto-handled, but good to know).
