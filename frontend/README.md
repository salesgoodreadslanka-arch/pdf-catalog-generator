# Next.js Frontend

Modern web interface for the PDF Catalog Generator.

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Setup environment:**
```bash
# Copy .env.local if not already present
# Make sure NEXT_PUBLIC_API_URL points to your backend
```

3. **Run development server:**
```bash
npm run dev
```

Open `http://localhost:3000` in your browser

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page
│   └── globals.css        # Global styles
├── components/
│   ├── CategorySelector.tsx  # Category selection component
│   ├── AuthorSelector.tsx    # Author selection component
│   ├── DownloadButton.tsx    # Download button with progress
│   └── ProgressBar.tsx       # Progress bar component
├── lib/
│   └── api.ts             # API client
├── package.json
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Technologies

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - HTTP client
