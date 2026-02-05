# 🚀 Deployment Guide: Go Live!

This guide will help you put your PDF Catalog Generator on the internet so anyone can use it.

We will use **Render** for the Backend (Python) and **Vercel** for the Frontend (Next.js). Both have excellent free tiers.

---

## 🛠️ Prerequisites

1.  **GitHub Account**: You need to upload your code to GitHub.
2.  **Render Account**: [render.com](https://render.com) (Log in with GitHub).
3.  **Vercel Account**: [vercel.com](https://vercel.com) (Log in with GitHub).

---

## 📦 Step 1: Push Code to GitHub

1.  Create a **New Repository** on GitHub (e.g., `pdf-catalog`).
2.  Open your project terminal (`C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator`).
3.  Run these commands to upload your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pdf-catalog.git
git push -u origin main
```
*(Replace `YOUR_USERNAME` with your actual GitHub username)*

---

## 🐍 Step 2: Deploy Backend (Render)

1.  Go to **Render Dashboard** -> Click **"New +"** -> **"Web Service"**.
2.  Connect your GitHub repository.
3.  **Configuration:**
    *   **Name:** `pdf-catalog-backend`
    *   **Root Directory:** `backend` (Important!)
    *   **Runtime:** Python 3
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4.  **Environment Variables** (Scroll down to "Environment Variables"):
    *   `SPREADSHEET_ID`: (Your Google Sheet ID)
    *   `FRONTEND_URL`: `*` (We will update this later to the real frontend URL, use `*` for now)
5.  **Secret Files** (Scroll to "Secret Files"):
    *   Click "Add Secret File".
    *   **Filename:** `credentials.json`
    *   **Content:** Open your local `backend/credentials.json`, copy everything, and paste it here.
6.  Click **"Create Web Service"**.

**✅ Wait for it to build. Once done, copy the "Onrender URL" (e.g., `https://pdf-catalog-backend.onrender.com`).**

---

## ⚛️ Step 3: Deploy Frontend (Vercel)

1.  Go to **Vercel Dashboard** -> Click **"Add New..."** -> **"Project"**.
2.  Import your GitHub repository.
3.  **Configuration:**
    *   **Framework Preset:** Next.js (Should be auto-detected).
    *   **Root Directory:** Edit this and select `frontend`.
4.  **Environment Variables:**
    *   Name: `NEXT_PUBLIC_API_URL`
    *   Value: The **Backend URL** you copied from Render (e.g., `https://pdf-catalog-backend.onrender.com`).
    *   *(Note: Do NOT add a trailing slash `/` at the end)*
5.  Click **"Deploy"**.

**✅ Wait for it to build. Vercel will give you a live URL (e.g., `https://pdf-catalog-frontend.vercel.app`).**

---

## 🔗 Step 4: Final Connection (CORS)

1.  Go back to **Render** (Backend).
2.  Go to **Environment Variables**.
3.  Edit `FRONTEND_URL` and change `*` to your **Vercel Frontend URL** (e.g., `https://pdf-catalog-frontend.vercel.app`).
    *   *This ensures only your frontend can talk to your backend (Security).*
4.  Render will automatically restart the server.

---

## 🎉 You are Live!

Open your Vercel URL. Your application is now running on the web!
