# Quick Start - Copy & Paste These Commands

## Step 1: Open 2 Terminals

You need 2 terminal windows (Antigravity terminal or VS Code terminal)

---

## Step 2: Terminal 1 - Start Backend

**Copy and paste this:**

```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
python main.py
```

✅ **Backend will start at http://localhost:8000**

Keep this terminal running!

---

## Step 3: Terminal 2 - Start Frontend

**Open a NEW terminal and copy & paste this:**

```powershell
cd C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\frontend
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
npm run dev
```

✅ **Frontend will start at http://localhost:3000**

Keep this terminal running too!

---

## Step 4: Open Browser

Go to: **http://localhost:3000**

🎉 **Done! Your PDF Catalog Generator is running!**

---

## To Stop

Press **Ctrl + C** in each terminal window

---

## Troubleshooting

**"npm not found" error?**
- Make sure you ran the `$env:Path` command first
- Or just use the batch file: double-click `START_FRONTEND.bat`

**"python not found" error?**
- Run the `$env:Path` command first
- It refreshes the terminal to see Python

**Port already in use?**
- Make sure you don't have the servers already running
- Close any other terminals that might be running the app
