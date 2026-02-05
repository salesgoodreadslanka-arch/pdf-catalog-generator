# Docker Deployment Guide for VPS

This guide will help you deploy your PDF Catalog Generator to your VPS (Virtual Private Server) using Docker. Docker makes it easy to run the same application on any computer or server.

## Prerequisites
1.  **A VPS**: (e.g., DigitalOcean, Hetzner, AWS, Linode).
2.  **SSH Access**: You should be able to log in to your VPS using a terminal.
3.  **Project Files**: Upload your project to GitHub (see the previous guide) or use `scp` to upload files directly.

---

## Step 1: Install Docker on your VPS
Most VPS providers use Ubuntu. Run these commands one by one to install Docker:

```bash
# Update package list
sudo apt-get update

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
```

---

## Step 2: Prepare the Files
Clone your repository on the VPS:

```bash
git clone https://github.com/YOUR_USERNAME/pdf-catalog-generator.git
cd pdf-catalog-generator
```

### Important: Add your credentials
Since `credentials.json` and `.env` are ignored by Git, you must create them manually on the server:

1.  **Backend Credentials**:
    ```bash
    nano backend/credentials.json
    ```
    (Paste your Google API JSON content, then press `Ctrl+O`, `Enter`, `Ctrl+X` to save).

2.  **Backend Environment**:
    ```bash
    nano backend/.env
    ```
    (Add your `SPREADSHEET_ID` and other settings).

---

## Step 3: Launch with Docker Compose
From the root folder (`pdf-catalog-generator`), run:

```bash
# Build and start the containers in the background
sudo docker-compose up --build -d
```

### Checking if it's running:
- **Backend**: Open `http://YOUR_VPS_IP:8000/` in your browser. You should see `{"status":"ok"}`.
- **Frontend**: Open `http://YOUR_VPS_IP:3000/` in your browser.

---

## Step 4: Making it Accessible (Public URL)
If you want to use a real domain name (like `catalog.yourdomain.com`), you should look into a "Reverse Proxy" like **Nginx Proxy Manager** or **Caddy**.

### Quick Port Update:
If you need to change the public port, edit `docker-compose.yml`:
- Change `"3000:3000"` to `"80:3000"` to make the frontend accessible on the standard web port (port 80).

---

## Useful Docker Commands
- **Stop everything**: `sudo docker-compose down`
- **View logs**: `sudo docker-compose logs -f`
- **Restart one service**: `sudo docker-compose restart backend`
- **List running containers**: `sudo docker ps`
