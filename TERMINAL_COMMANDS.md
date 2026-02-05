# 🚀 Simple Terminal Commands

## Backend (Python FastAPI)

### In Antigravity Terminal or VS Code Terminal:

```powershell
# Navigate to backend folder
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend

# Refresh PATH (only needed once per terminal session)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Run the backend
python main.py
```

**Expected output:**
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ Backend running at: **http://localhost:8000**

---

## Frontend (Next.js)

### Option 1: In Regular PowerShell or CMD

```powershell
# Navigate to frontend folder
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend

# Install dependencies (first time only)
npm install

# Run development server
npm run dev
```

### Option 2: In Antigravity Terminal (with PATH refresh)

```powershell
# Navigate to frontend folder
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Install dependencies (first time only)
npm install

# Run development server
npm run dev
```

**Expected output:**
```
- Local:        http://localhost:3000
- Ready in 2.5s
```

✅ Frontend running at: **http://localhost:3000**

---

## 📋 Quick Copy-Paste (All-in-One)

### Terminal 1 - Backend:
```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
python main.py
```

### Terminal 2 - Frontend:
```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
npm run dev
```

---

## 🎯 Standard Commands (After PATH is Set)

Once you've run the PATH refresh command, you can use standard commands:

**Backend:**
```bash
cd backend
python main.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🛑 To Stop Servers

Press **Ctrl + C** in each terminal window

---

## 📝 Notes

- You need **2 terminal windows** (one for backend, one for frontend)
- The `$env:Path` command refreshes the PATH in Antigravity terminal
- After refreshing PATH once, you can use `python` and `npm` normally in that terminal session
- If you close the terminal, you'll need to refresh PATH again in the new terminal

---

## ✅ Verify Everything Works

**Check Python:**
```powershell
python --version
# Should show: Python 3.12.1
```

**Check Node/npm:**
```powershell
node --version
npm --version
# Should show version numbers
```

If these don't work, run the PATH refresh command first!
