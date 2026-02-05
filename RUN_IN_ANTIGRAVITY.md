# 🚀 Run Everything in Antigravity Terminal

## Backend - Run This First

```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
python main.py
```

This will start the backend at **http://localhost:8000**

---

## Frontend - Run in NEW Terminal

Open a second Antigravity terminal and run:

```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
npm install
npm run dev
```

This will start the frontend at **http://localhost:3000**

---

## ⚡ Quick Copy-Paste Commands

**Terminal 1 (Backend):**
```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend ; $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User") ; python main.py
```

**Terminal 2 (Frontend):**
```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend ; $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User") ; npm install ; npm run dev
```

Just copy and paste these into your Antigravity terminals!
