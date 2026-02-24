# 🐳 Docker Deployment Guide — VPS

Deploy your PDF Catalog Generator to any VPS using Docker Compose.

---

## Prerequisites
- A VPS running Ubuntu (e.g., Hetzner, DigitalOcean, AWS Lightsail)
- SSH access to the VPS
- Your code pushed to GitHub

---

## Step 1: Install Docker on VPS

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

---

## Step 2: Clone Your Repo

```bash
git clone https://github.com/salesgoodreadslanka-arch/pdf-catalog-generator.git
cd pdf-catalog-generator
```

---

## Step 3: Create the `.env` File

Create a `.env` file in the project root (next to `docker-compose.yml`):

```bash
nano .env
```

Paste the following (fill in your values):

```env
# Google Sheets
SPREADSHEET_ID=your_spreadsheet_id_here

# Google Credentials — paste the ENTIRE contents of credentials.json as one line
GOOGLE_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key":"..."}

# CORS — set to your domain once you have one, or * to allow all
FRONTEND_URL=*

# Frontend API URL — use your VPS IP or domain
NEXT_PUBLIC_API_URL=http://YOUR_VPS_IP:8000
```

> ⚠️ **Note**: The `GOOGLE_CREDENTIALS_JSON` value must be the **entire JSON content** of your `credentials.json` file on a **single line** (no line breaks).

Press `Ctrl+O`, `Enter`, `Ctrl+X` to save.

---

## Step 4: Launch with Docker Compose

```bash
sudo docker-compose up --build -d
```

### Verify it's running:
- **Backend**: `http://YOUR_VPS_IP:8000/` → should return `{"status":"ok"}`
- **Frontend**: `http://YOUR_VPS_IP:3000/` → should show the UI with data

---

## Step 5: (Optional) Use a Domain Name

If you have a domain (e.g., `catalog.goodreads.lk`), use **Nginx** as a reverse proxy:

```bash
sudo apt-get install -y nginx
```

Create config at `/etc/nginx/sites-available/catalog`:

```nginx
server {
    listen 80;
    server_name catalog.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/catalog /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

Then update your `.env`:
```env
FRONTEND_URL=https://catalog.yourdomain.com
NEXT_PUBLIC_API_URL=https://catalog.yourdomain.com
```

And redeploy: `sudo docker-compose up --build -d`

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `sudo docker-compose up -d` | Start all containers |
| `sudo docker-compose down` | Stop all containers |
| `sudo docker-compose logs -f` | View live logs |
| `sudo docker-compose restart backend` | Restart backend only |
| `sudo docker-compose pull && sudo docker-compose up --build -d` | Update after git pull |
| `sudo docker ps` | List running containers |

---

## Updating the App

When you make code changes:

```bash
git pull
sudo docker-compose up --build -d
```

That's it! 🚀
