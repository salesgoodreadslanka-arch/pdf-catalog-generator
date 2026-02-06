import io
import os
import requests
import tempfile
import shutil
import concurrent.futures
import asyncio
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from typing import List, Dict, Callable, Optional
from datetime import datetime
from PIL import Image as PILImage
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image as RLImage
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT


# Configuration constants
COLS_PER_PAGE = 6
ROWS_PER_PAGE = 5
ITEMS_PER_PAGE = COLS_PER_PAGE * ROWS_PER_PAGE

IMG_WIDTH = 70
IMG_HEIGHT = 85
CELL_WIDTH = 85
CELL_HEIGHT = 135

LEFT_MARGIN = 0.2 * inch
RIGHT_MARGIN = 0.2 * inch
TOP_MARGIN = 0.1 * inch
BOTTOM_MARGIN = 0.1 * inch

BLACK_SQUARE_URL = "https://dummyimage.com/70x85/e0e0e0/000000.png&text=No+Image"

CATEGORY_COLORS = [
    "#2E4053", "#1A5276", "#7D3C98", "#196F3D", "#943126",
    "#9A7D0A", "#6C3483", "#1B4F72", "#78281F", "#4A235A"
]


class PDFService:
    """Service for generating PDF catalogs using Parallel Fetching and Disk-Backed Rendering"""
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self.custom_styles = {}
        self.image_cache = {}  # URL -> Local Temp Path
        self.temp_dir = None
        self.session = self._setup_session()
        self.setup_styles()
    
    def _setup_session(self) -> requests.Session:
        """Setup a robust session with retries and pooling"""
        session = requests.Session()
        retry_strategy = Retry(
            total=5,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["HEAD", "GET", "OPTIONS"]
        )
        adapter = HTTPAdapter(
            pool_connections=20,
            pool_maxsize=20,
            max_retries=retry_strategy
        )
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        })
        return session
    
    def setup_styles(self):
        """Setup custom styles for the catalog"""
        self.custom_styles['title'] = ParagraphStyle(
            'CustomTitle', parent=self.styles['Heading1'], fontSize=16,
            alignment=TA_CENTER, spaceAfter=12, fontName='Helvetica-Bold'
        )
        self.custom_styles['category_header'] = ParagraphStyle(
            'CategoryHeader', parent=self.styles['Normal'], fontSize=9,
            alignment=TA_RIGHT, textColor=colors.white, fontName='Helvetica-Bold',
            spaceAfter=2, leading=10
        )
        self.custom_styles['product_name'] = ParagraphStyle(
            'ProductName', parent=self.styles['Normal'], fontSize=7,
            alignment=TA_LEFT, fontName='Helvetica-Bold', spaceAfter=0,
            leading=8, wordWrap='CJK'
        )
        self.custom_styles['isbn'] = ParagraphStyle(
            'ISBN', parent=self.styles['Normal'], fontSize=6, alignment=TA_LEFT,
            textColor=colors.grey, spaceAfter=0, leading=7
        )
        self.custom_styles['author'] = ParagraphStyle(
            'Author', parent=self.styles['Normal'], fontSize=6, alignment=TA_LEFT,
            textColor=colors.darkgrey, spaceAfter=0, leading=7
        )
        self.custom_styles['price'] = ParagraphStyle(
            'Price', parent=self.styles['Normal'], fontSize=6, alignment=TA_LEFT,
            textColor=colors.red, spaceAfter=0, leading=7
        )
        self.custom_styles['cover_list'] = ParagraphStyle(
            'CoverList', parent=self.styles['Normal'], fontSize=12,
            leftIndent=30, spaceAfter=3
        )
        self.custom_styles['main_cat_title'] = ParagraphStyle(
            'MainCatTitle', parent=self.styles['Heading1'], fontSize=18,
            alignment=TA_CENTER, spaceAfter=12, fontName='Helvetica-Bold'
        )
        self.custom_styles['subcat_count'] = ParagraphStyle(
            'SubcatCount', parent=self.styles['Heading2'], fontSize=14,
            alignment=TA_CENTER, spaceAfter=20, fontName='Helvetica-Bold'
        )
    
    def get_color_for_category(self, category_name: str) -> str:
        """Get consistent color for a category"""
        hash_val = 0
        for char in category_name:
            hash_val = (hash_val * 31 + ord(char)) & 0xFFFFFFFF
        return CATEGORY_COLORS[hash_val % len(CATEGORY_COLORS)]
    
    def fetch_image_sync(self, url: str) -> Optional[str]:
        """Fetch, resize (8x HiDPI), and save image to disk with session-based retries."""
        if not url or str(url).strip() == "": return None
        if url in self.image_cache: return self.image_cache[url]
        
        try:
            response = self.session.get(url, timeout=(5, 15))
            if response.status_code == 200:
                img_io = io.BytesIO(response.content)
                with PILImage.open(img_io) as img:
                    if img.mode != 'RGB': img = img.convert('RGB')
                    # 8x High DPI Target
                    t_w, t_h = IMG_WIDTH * 8, IMG_HEIGHT * 8
                    img = img.resize((t_w, t_h), PILImage.Resampling.LANCZOS)
                    
                    # Store on disk to save RAM
                    fd, path = tempfile.mkstemp(suffix='.jpg', dir=self.temp_dir)
                    os.close(fd)
                    img.save(path, format='JPEG', quality=95, optimize=True)
                    self.image_cache[url] = path
                    return path
        except Exception as e:
            print(f"Fetch failed for {url[:50]}: {e}")
            
        return None

    def get_placeholder_path(self) -> str:
        """Get or create placeholder image path"""
        if BLACK_SQUARE_URL in self.image_cache: return self.image_cache[BLACK_SQUARE_URL]
        img = PILImage.new('RGB', (IMG_WIDTH * 8, IMG_HEIGHT * 8), color='#f0f0f0')
        fd, path = tempfile.mkstemp(suffix='.jpg', dir=self.temp_dir)
        os.close(fd)
        img.save(path, format='JPEG', quality=90)
        self.image_cache[BLACK_SQUARE_URL] = path
        return path

    def truncate_text_for_cell(self, text: str, max_length: int, max_lines: int = 2) -> str:
        """Truncate text to fit in cell"""
        if not text: return ""
        words = str(text).split()
        res = []
        cur_len = 0
        for w in words:
            if cur_len + len(w) + 1 <= max_length:
                res.append(w)
                cur_len += len(w) + 1
            else: break
        result = " ".join(res)
        return result if len(result) <= max_length else result[:max_length-3] + "..."

    def analyze_categories(self, data: List[List], selected_items: Optional[List[str]] = None) -> tuple:
        """Organize products by category hierarchy, respecting selected_items filtering"""
        main_categories = set()
        products_by_category = {}
        for i, row in enumerate(data[1:], 1):
            if len(row) < 6: continue
            try:
                cat_cell = str(row[5]).strip()
                if not cat_cell: continue
                for cat in [c.strip() for c in cat_cell.split(',')]:
                    # FILTER: Only process this category if it's in the selected list
                    if selected_items and cat not in selected_items:
                        continue
                        
                    if ">" in cat:
                        parts = [p.strip() for p in cat.split('>')]
                        if len(parts) >= 2:
                            m_cat, s_cat = parts[0], parts[1]
                    else:
                        m_cat, s_cat = cat, ""
                    
                    key = f"{m_cat}|{s_cat}"
                    main_categories.add(m_cat)
                    if key not in products_by_category:
                        products_by_category[key] = {'main_category': m_cat, 'sub_category': s_cat, 'products': []}
                    products_by_category[key]['products'].append({
                        'sku': str(row[0]).strip(), 'name': str(row[1]).strip(),
                        'price': str(row[2]).strip(), 'img_url': str(row[3]).strip(),
                        'author': str(row[4]).strip(), 'index': i
                    })
            except: continue
        return products_by_category, main_categories

    async def generate_catalog(self, data: List[List[str]], output_path: str, catalog_type: str = "category",
                               selected_items: Optional[List[str]] = None,
                               progress_callback: Optional[Callable[[int, str], None]] = None,
                               check_cancel: Optional[Callable[[], bool]] = None):
        """Speed-optimized PDF Generation"""
        if progress_callback: progress_callback(5, "Initializing speed-optimized engine...")
        
        # Prepare Temp
        self.temp_dir = tempfile.mkdtemp(prefix='pdf_gen_')
        self.image_cache = {}
        
        try:
            # 1. PRE-FETCH IMAGES IN PARALLEL
            unique_urls = set()
            for row in data[1:]:
                if len(row) > 3 and str(row[3]).strip().startswith('http'):
                    unique_urls.add(str(row[3]).strip().split(',')[0].strip())
            
            if progress_callback: progress_callback(10, f"Fetching {len(unique_urls)} images in parallel...")
            
            with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
                futures = {executor.submit(self.fetch_image_sync, url): url for url in unique_urls}
                done_count = 0
                for f in concurrent.futures.as_completed(futures):
                    await asyncio.sleep(0) # Yield to event loop
                    if check_cancel and check_cancel():
                        executor.shutdown(wait=False)
                        raise Exception("Generation cancelled")
                    done_count += 1
                    if done_count % 5 == 0 or done_count == len(unique_urls):
                        perc = 10 + int((done_count / max(1, len(unique_urls))) * 25) # 10-35%
                        if progress_callback: progress_callback(perc, f"Fetched {done_count}/{len(unique_urls)} images")

            # 2. PREPARE DATA & COUNTS
            if catalog_type == 'author':
                # Group by Author
                author_map = {}
                for row in data[1:]:
                    if len(row) < 5: continue
                    auth = str(row[4]).strip() or "Unknown Author"
                    if auth not in author_map: author_map[auth] = []
                    author_map[auth].append({
                        'sku': str(row[0]).strip(), 'name': str(row[1]).strip(),
                        'price': str(row[2]).strip(), 'img_url': str(row[3]).strip(), 'author': auth
                    })
                sorted_keys = sorted(author_map.keys())
                total_items = sum(len(items) for items in author_map.values())
            else:
                # Category path
                cat_data, main_cats = self.analyze_categories(data, selected_items)
                sorted_main = sorted(list(main_cats))
                total_items = sum(len(info['products']) for info in cat_data.values())

            # 3. BUILD STORY
            doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=RIGHT_MARGIN,
                                   leftMargin=LEFT_MARGIN, topMargin=TOP_MARGIN, bottomMargin=BOTTOM_MARGIN)
            story = []
            story.append(Paragraph("PRODUCT CATALOG", self.custom_styles['title']))
            story.append(Spacer(1, 20))
            
            cur_items = 0
            def update_progress(inc=1):
                nonlocal cur_items
                cur_items += inc
                if progress_callback:
                    p = 35 + int((cur_items / max(1, total_items)) * 60) # 35-95%
                    progress_callback(p, f"Building pages ({cur_items}/{total_items})")

            if catalog_type == 'author':
                story.append(Paragraph(f"Authors ({len(sorted_keys)})", self.styles['Heading2']))
                for a in sorted_keys:
                    story.append(Paragraph(f"• {a} ({len(author_map[a])} items)", self.custom_styles['cover_list']))
                story.append(PageBreak())
                
                for idx, auth in enumerate(sorted_keys):
                    if idx > 0: story.append(PageBreak())
                    
                    items = author_map[auth]
                    rows_data = []
                    cur_r = []
                    for item in items:
                        await asyncio.sleep(0) # Yield
                        if check_cancel and check_cancel(): raise Exception("Cancelled")
                        cur_r.append(self._create_product_cell(item))
                        update_progress()
                        if len(cur_r) == COLS_PER_PAGE:
                            rows_data.append(cur_r); cur_r = []
                    if cur_r:
                        while len(cur_r) < COLS_PER_PAGE: cur_r.append("")
                        rows_data.append(cur_r)
                    
                    if rows_data: 
                        # Use repeating header for Author
                        self._add_product_table(story, rows_data, header_text=auth.upper(), header_color="#2E4053")
            else:
                story.append(Paragraph(f"Categories ({len(sorted_main)})", self.styles['Heading2']))
                for c in sorted_main: story.append(Paragraph(f"• {c}", self.custom_styles['cover_list']))
                story.append(PageBreak())
                
                for m_idx, m_cat in enumerate(sorted_main):
                    if m_idx > 0: story.append(PageBreak())
                    story.append(Paragraph(m_cat.upper(), self.custom_styles['main_cat_title']))
                    story.append(Spacer(1, 20))
                    
                    # Filter subcats for this m_cat
                    subs = [k for k in cat_data.keys() if cat_data[k]['main_category'] == m_cat]
                    for sub_idx, sub_key in enumerate(sorted(subs)):
                        sub_info = cat_data[sub_key]
                        if sub_idx > 0: story.append(PageBreak())
                        
                        rows_data = []
                        cur_r = []
                        for product in sub_info['products']:
                            await asyncio.sleep(0) # Yield
                            if check_cancel and check_cancel(): raise Exception("Cancelled")
                            cur_r.append(self._create_product_cell(product))
                            update_progress()
                            if len(cur_r) == COLS_PER_PAGE:
                                rows_data.append(cur_r); cur_r = []
                        if cur_r:
                            while len(cur_r) < COLS_PER_PAGE: cur_r.append("")
                            rows_data.append(cur_r)
                        
                        if rows_data: 
                            color = self.get_color_for_category(m_cat)
                            if sub_info['sub_category']:
                                header_txt = f"{m_cat} > {sub_info['sub_category']}"
                            else:
                                header_txt = m_cat
                            # Use repeating header for Category
                            self._add_product_table(story, rows_data, header_text=header_txt, header_color=color)

            # 3. BUILD PDF
            if progress_callback: progress_callback(95, "Finalizing high-quality PDF...")
            doc.build(story)
            if progress_callback: progress_callback(100, "Catalog Ready!")

        finally:
            # CLEANUP
            if self.temp_dir and os.path.exists(self.temp_dir):
                shutil.rmtree(self.temp_dir)
            self.image_cache = {}

    def _add_product_table(self, story, table_data, header_text=None, header_color=None):
        """Helper to add product table with optional repeating header"""
        data = []
        repeat_rows = 0
        
        if header_text and header_color:
            header_row = [[Paragraph(header_text, self.custom_styles['category_header'])]]
            # Add 5 empty cells to fill the row
            header_row[0].extend([""] * (COLS_PER_PAGE - 1))
            data.append(header_row[0])
            repeat_rows = 1
            
        data.extend(table_data)
        
        t = Table(data, colWidths=[CELL_WIDTH]*COLS_PER_PAGE, 
                  rowHeights=[20 if repeat_rows and i == 0 else CELL_HEIGHT for i in range(len(data))],
                  repeatRows=repeat_rows)
        
        styles = [
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('LEFTPADDING', (0,0), (-1,-1), 2),
        ]
        
        if repeat_rows:
            styles.append(('BACKGROUND', (0,0), (-1,0), colors.HexColor(header_color)))
            styles.append(('SPAN', (0,0), (-1,0)))
            styles.append(('VALIGN', (0,0), (-1,0), 'MIDDLE'))
            styles.append(('ALIGN', (0,0), (-1,0), 'RIGHT'))
            
        t.setStyle(TableStyle(styles))
        story.append(t)

    def _create_product_cell(self, p):
        cell = []
        img_url = str(p.get('img_url', '')).split(',')[0].strip()
        path = self.image_cache.get(img_url) if img_url.startswith('http') else None
        if not path or not os.path.exists(path): path = self.get_placeholder_path()
        try:
            cell.append(RLImage(path, width=IMG_WIDTH, height=IMG_HEIGHT))
        except: cell.append(Paragraph("[Img Error]", self.styles['Normal']))
        
        name = self.truncate_text_for_cell(p.get('name', ''), 30)
        cell.append(Paragraph(name, self.custom_styles['product_name']))
        cell.append(Paragraph(f"ISBN: {p.get('sku', '-')}", self.custom_styles['isbn']))
        auth = p.get('author', '')
        if auth: cell.append(Paragraph(auth[:25], self.custom_styles['author']))
        cell.append(Paragraph(f"Rs. {p.get('price', '0')} /=", self.custom_styles['price']))
        return cell
