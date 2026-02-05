# Python Backend

FastAPI backend for PDF catalog generation from Google Sheets data.

## Quick Start

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Setup Google Sheets credentials:**
   - Place your `credentials.json` file in this directory
   - Copy `.env.example` to `.env`
   - Update `SPREADSHEET_ID` in `.env`

3. **Run the server:**
```bash
python main.py
```

Server will start at `http://localhost:8000`

## API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

## Project Structure

```
backend/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── credentials.json       # Google service account credentials (not in git)
├── models/
│   └── catalog_request.py # Pydantic models
└── services/
    ├── sheets_service.py  # Google Sheets integration
    └── pdf_service.py     # PDF generation logic
```

## Environment Variables

- `SPREADSHEET_ID`: Your Google Sheets spreadsheet ID
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to credentials.json (default: credentials.json)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)
- `PORT`: Server port (default: 8000)
