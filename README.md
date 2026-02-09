# PDF Catalog Generator

A full-stack application that converts Google Sheets product data into professional PDF catalogs with real-time progress tracking.

## 🌟 Features

- **Category-wise Catalog**: Select specific categories and generate filtered PDF catalogs
- **Author-wise Catalog**: Select specific authors and generate filtered PDF catalogs
- **Full Catalog**: One-click download of complete product catalog
- **Real-time Progress**: Live progress bars showing generation and download status
- **Beautiful UI**: Modern glassmorphism design with animations and gradients
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🏗️ Architecture

### Backend (Python FastAPI)
- **FastAPI** for REST API
- **ReportLab** for PDF generation
- **Google Sheets API** for data fetching
- **Server-Sent Events** for real-time progress tracking

### Frontend (Next.js)
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Axios** for API calls

## 📋 Prerequisites

### Backend
- Python 3.8 or higher
- pip (Python package manager)
- Google Cloud Service Account credentials

### Frontend
- Node.js 18 or higher
- npm or yarn

## 🚀 Setup Instructions

### 1. Google Sheets API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google Sheets API**
4. Create a **Service Account**:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name and click "Create"
   - Grant it "Editor" role
   - Click "Done"
5. Create a key for the service account:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose "JSON" format
   - Download the file and save it as `credentials.json` in the `backend` folder
6. Share your Google Sheet with the service account email (found in credentials.json)

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
copy .env.example .env

# Edit .env file and add your spreadsheet ID
# SPREADSHEET_ID=your_spreadsheet_id_here

# Run the backend server
python main.py
```

The backend will start on `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📊 Google Sheets Format

Your Google Sheets should have the following columns (A-F):

| Column | Name | Description | Example |
|--------|------|-------------|---------|
| A | ISBN/SKU | Product identifier | `978-0-123456-78-9` |
| B | Product Name | Name of the product | `The Great Gatsby` |
| C | Price | Product price | `299` |
| D | Image URL | Product image URL | `https://example.com/image.jpg` |
| E | Author | Author name | `F. Scott Fitzgerald` |
| F | Categories | Categories (comma-separated, use `>` for subcategories) | `Fiction > Classic, Literature` |

### Example Row:
```
978-0-123456-78-9 | The Great Gatsby | 299 | https://example.com/image.jpg | F. Scott Fitzgerald | Fiction > Classic, Literature
```

## 🎨 Usage

1. **Open the application** at `http://localhost:3000`

2. **Category-wise Download**:
   - Search and select categories
   - Click "Download" button
   - Watch real-time progress
   - PDF downloads automatically when complete

3. **Author-wise Download**:
   - Search and select authors
   - Click "Download" button
   - Watch real-time progress
   - PDF downloads automatically when complete

4. **Full Catalog Download**:
   - Simply click "Download Full Catalog"
   - Watch real-time progress
   - Complete catalog downloads automatically

## 🔧 API Endpoints

### GET `/api/data`
Fetch categories and authors from Google Sheets

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [{"name": "Fiction > Mystery", "count": 25}],
    "authors": [{"name": "John Doe", "count": 10}],
    "total_products": 150
  }
}
```

### POST `/api/catalog/generate`
Generate PDF catalog

**Request:**
```json
{
  "catalog_type": "category",
  "selected_items": ["Fiction > Mystery", "Non-Fiction > Biography"]
}
```

**Response:**
```json
{
  "success": true,
  "task_id": "category_1234567890.123",
  "filename": "catalog_categories_20260205_104500.pdf",
  "download_url": "/api/catalog/download/catalog_categories_20260205_104500.pdf"
}
```

### GET `/api/catalog/stream/{task_id}`
Server-Sent Events for real-time progress updates

### GET `/api/catalog/download/{filename}`
Download generated PDF file

## 🎯 Features in Detail

### Real-time Progress Tracking
- Uses Server-Sent Events (SSE) for live updates
- Shows percentage completion (0-100%)
- Displays current status messages
- Color-coded progress bar (blue → purple → green)

### PDF Generation
- Professional layout with 6 columns × 5 rows per page
- Category headers with color coding
- Product images with fallback placeholders
- ISBN, author, and price information
- Automatic pagination for large catalogs

### UI/UX
- Glassmorphism design with backdrop blur
- Animated gradient backgrounds
- Smooth transitions and hover effects
- Responsive grid layout
- Custom scrollbars
- Loading states and error handling

## 🐛 Troubleshooting

### Backend Issues

**Error: "No module named 'google'"**
```bash
pip install google-auth google-api-python-client
```

**Error: "Permission denied" for Google Sheets**
- Make sure you shared the sheet with the service account email
- Check that the service account has "Editor" or "Viewer" permissions

**Error: "CORS policy" in browser console**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Default is `http://localhost:3000`

### Frontend Issues

**Error: "Cannot connect to backend"**
- Make sure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

**npm install fails**
- Try deleting `node_modules` and `package-lock.json`
- Run `npm install` again

## 📦 Production Deployment

### 🚀 Recommended: Railway & Vercel (Fastest)
See our detailed [Railway & Vercel Deployment Guide](RAILWAY_VERCEL_DEPLOY.md) to get live in minutes.

### alternative: Render & Vercel
See the [Original Deployment Guide](DEPLOYMENT_GUIDE.md) for Render instructions.

### Manual/Docker
**Backend (FastAPI)**
```bash
# Install production server
pip install gunicorn

# Run with gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Frontend (Next.js)**
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using FastAPI and Next.js**
