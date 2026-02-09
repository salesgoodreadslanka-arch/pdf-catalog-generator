# 🚀 Deploy to Railway (Backend) & Vercel (Frontend)

This guide provides step-by-step instructions to get your PDF Catalog Generator live on the web.

---

## 📋 Prerequisites
1.  **GitHub Account**: Your code must be pushed to a GitHub repository.
2.  **Railway Account**: [railway.app](https://railway.app/) (Sign up with GitHub).
3.  **Vercel Account**: [vercel.com](https://vercel.com/) (Sign up with GitHub).

---

## 1️⃣ Step 1: Push to GitHub
If you haven't already, push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pdf-catalog.git
git push -u origin main
```

---

## 2️⃣ Step 2: Deploy Backend to Railway
Railway is excellent for hosting Python APIs.

1.  Log in to **Railway**.
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select your repository.
4.  Click **"Add Variables"** and add the following:
    *   `SPREADSHEET_ID`: (Your Google Sheet ID)
    *   `FRONTEND_URL`: `*` (We'll update this later)
    *   `PORT`: `8000`
5.  **Important: Root Directory**:
    *   Go to **Settings** -> **General**.
    *   Set **Root Directory** to `backend`.
6.  **Secret Files & Credentials**:
    *   **Secure Method (Recommended)**: Copy the entire content of your `backend/credentials.json` file.
    *   In **Railway**, go to **Variables** and add a new variable:
        *   **Name**: `GOOGLE_CREDENTIALS_JSON`
        *   **Value**: Paste the entire JSON content here (it should look like `{"type": "service_account", ...}`).
    *   Your code is now updated to read this securely without needing to push the file to GitHub.
7.  Railway will automatically detect the `Procfile` or `main.py` and deploy.
8.  **Copy your Public Domain**: Once deployed, go to **Settings** -> **Public Networking** -> **Generate Domain**. It will look like `https://backend-production-xxxx.up.railway.app`.

---

## 3️⃣ Step 3: Deploy Frontend to Vercel
Vercel is the best home for Next.js apps.

1.  Log in to **Vercel**.
2.  Click **"Add New"** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Edit Project Settings**:
    *   **Root Directory**: Click "Edit" and select the `frontend` folder.
5.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Your Railway Backend URL (e.g., `https://backend-production-xxxx.up.railway.app`).
6.  Click **"Deploy"**.
7.  Wait for the build to finish. Vercel will give you a domain (e.g., `https://pdf-catalog-frontend.vercel.app`).

---

## 4️⃣ Step 4: Final Connection (Security)
1.  Go back to your **Railway Backend Project**.
2.  Go to **Variables**.
3.  Update `FRONTEND_URL` from `*` to your **Vercel URL** (e.g., `https://pdf-catalog-frontend.vercel.app`).
4.  Railway will redeploy.

---

## 🎉 Success!
Your application is now live! 
- **Frontend**: Accessible via Vercel URL.
- **Backend**: Powering the API via Railway.
