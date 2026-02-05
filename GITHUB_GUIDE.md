# GitHub Upload Guide

Follow these exact steps to upload your project to GitHub.

## Step 1: Open your Terminal
Open your terminal and make sure you are in the root folder of your project:
`C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator`

---

## Step 2: Initialize Git
Run these commands one by one:

```powershell
# Initialize git in this folder
git init

# Add all files (it will respect the .gitignore I created)
git add .

# Create your first commit
git commit -m "Initial commit: Super-Fast PDF Engine with Docker support"
```

---

## Step 3: Create Repository on GitHub
1. Go to [https://github.com/new](https://github.com/new).
2. Repository name: `pdf-catalog-generator`.
3. Description (optional): `Professional PDF Catalog Generator with FastAPI and Next.js`.
4. Keep it **Public** (or Private if you prefer).
5. **CRITICAL**: Do **NOT** check "Add a README", "Add .gitignore", or "Choose a license". We already have these files.
6. Click **Create repository**.

---

## Step 4: Link and Push
After clicking Create, GitHub will show you some code. Copy and run the following (replace `YOUR_USERNAME` with your actual GitHub name):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/pdf-catalog-generator.git
git branch -M main
git push -u origin main
```

---

## ⚠️ Security Reminder
I have already set up `.gitignore` files for you. This means:
1. Your **API Credentials** (`credentials.json`) will **NOT** be uploaded.
2. Your **Environment Variables** (`.env`) will **NOT** be uploaded.

This is correct and safe. When you deploy to your VPS, you will manually create these two files there as explained in the [DOCKER_DEPLOY_GUIDE.md](./DOCKER_DEPLOY_GUIDE.md).
