# 🔑 What is `credentials.json`?

`credentials.json` is like a **digital key** that gives your Python application permission to read your Google Sheet.

Without it, Google blocks your app from accessing the data because it doesn't know who is asking for it.

---

## 🚀 How to Get It (Step-by-Step)

### 1. Create a Google Cloud Project
1. Go to: **[Google Cloud Console](https://console.cloud.google.com/)**
2. Click the specific project dropdown at the top left.
3. Click **"New Project"**.
4. Name it `PDF-Catalog` and click **Create**.

### 2. Enable Google Sheets API
1. In the search bar at the top, type **"Google Sheets API"**.
2. Click on "Google Sheets API" in the results.
3. Click the **Enable** button.

### 3. Create a Service Account (The "Robot" User)
1. In the search bar, type **"Credentials"** and select **"Credentials (API Manager)"**.
2. Click **"+ CREATE CREDENTIALS"** (top of screen).
3. Select **"Service Account"**.
4. Give it a name (e.g., `catalog-reader`).
5. Click **Create and Continue**.
6. Click **Done** (you don't need to grant special roles for this).

### 4. Download the Key (`credentials.json`)
1. You will see your new service account in the list (it looks like an email address: `catalog-reader@...`).
2. Click on the **pencil icon** (Edit) or click the email address.
3. Go to the **KEYS** tab (top menu inside the service account details).
4. Click **ADD KEY** -> **Create new key**.
5. Select **JSON** and click **Create**.
6. A file will automatically download to your computer.

---

## 🛠️ How to Use It with Your App

### 1. Rename and Move
1. Find the downloaded file (it will have a long name like `project-12345-abcde.json`).
2. **Rename it** to exactly: `credentials.json`
3. **Move it** into your backend folder:
   ```
   C:\Users\User\.gemini\antigravity\scratch\pdf-catalog-generator\backend
   ```

### 2. Share Your Sheet
1. Open the `credentials.json` file with Notepad.
2. Find the `"client_email"` line (e.g., `catalog-reader@pdf-catalog.iam.gserviceaccount.com`).
3. **Copy that email address.**
4. Go to your **Google Sheet** (the one with your products).
5. Click the big green **Share** button.
6. **Paste the email** and click Send.

### 3. Update Project Settings
1. Make sure your `backend/.env` file has your Spreadsheet ID.
2. Restart the backend terminal.

✅ **Now your app will pull REAL data from YOUR sheet!**
