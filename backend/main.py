from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
import asyncio
from datetime import datetime
import json

from services.sheets_service import SheetsService
from services.pdf_service import PDFService
from models.catalog_request import CatalogRequest, CatalogType

# Custom exception for cancellation
class CancelledTask(Exception):
    pass

# Load environment variables
load_dotenv()

app = FastAPI(
    title="PDF Catalog Generator API",
    description="Generate professional PDF catalogs from Google Sheets data",
    version="1.0.0"
)

# CORS middleware
frontend_url = os.getenv("FRONTEND_URL", "*")
if frontend_url == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [
        frontend_url,
        "http://localhost:3000",
        "http://localhost:3001",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=frontend_url != "*",
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
sheets_service = SheetsService()
pdf_service = PDFService()

# Store for progress tracking and cancellation
progress_store: Dict[str, Dict[str, Any]] = {}
cancellation_tokens: Dict[str, bool] = {}


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "PDF Catalog Generator API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }


@app.get("/api/data")
async def get_sheet_data():
    """
    Fetch all data from Google Sheets
    Returns categories, authors, and product counts
    """
    try:
        data = await sheets_service.get_sheet_data()
        
        # Extract unique categories and authors
        categories = sheets_service.extract_categories(data)
        authors = sheets_service.extract_authors(data)
        
        return {
            "success": True,
            "data": {
                "categories": categories,
                "authors": authors,
                "total_products": len(data) - 1  # Exclude header
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/catalog/generate")
async def generate_catalog(request: CatalogRequest, background_tasks: BackgroundTasks):
    """
    Generate PDF catalog based on request type
    Supports: category-wise, author-wise, or full catalog
    """
    try:
        # Generate unique task ID
        task_id = f"{request.catalog_type.value}_{datetime.now().timestamp()}"
        
        # Initialize progress and cancellation token
        progress_store[task_id] = {
            "progress": 0,
            "status": "starting",
            "message": "Initializing catalog generation..."
        }
        cancellation_tokens[task_id] = False
        
        # Check cancel callback
        def check_cancel():
            if cancellation_tokens.get(task_id, False):
                return True
            return False
            
        # Prepare filename based on request type
        if request.catalog_type == CatalogType.CATEGORY:
            filename = f"catalog_categories_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        elif request.catalog_type == CatalogType.AUTHOR:
            filename = f"catalog_authors_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        else:
            filename = f"catalog_full_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

        async def run_generation():
            try:
                # Get sheet data
                data = await sheets_service.get_sheet_data()
                
                # Filter data based on request type
                if request.catalog_type == CatalogType.CATEGORY:
                    if not request.selected_items:
                        raise Exception("No categories selected")
                    filtered_data = sheets_service.filter_by_categories(data, request.selected_items)
                elif request.catalog_type == CatalogType.AUTHOR:
                    if not request.selected_items:
                        raise Exception("No authors selected")
                    filtered_data = sheets_service.filter_by_authors(data, request.selected_items)
                else:  # FULL
                    filtered_data = data
                
                # Generate PDF with progress callback
                def progress_callback(progress: int, message: str):
                    print(f"[{task_id}] {progress}%: {message}")  # Console log for visibility
                    progress_store[task_id] = {
                        "progress": progress,
                        "status": "generating",
                        "message": message
                    }
                
                output_path = os.path.join("output", filename)
                os.makedirs("output", exist_ok=True)
                
                # Generate PDF
                await pdf_service.generate_catalog(
                    filtered_data,
                    output_path,
                    catalog_type=request.catalog_type.value,
                    selected_items=request.selected_items,
                    progress_callback=progress_callback,
                    check_cancel=check_cancel
                )
                
                # Update progress to complete
                progress_store[task_id] = {
                    "progress": 100,
                    "status": "complete",
                    "message": "Catalog generated successfully",
                    "file_path": output_path
                }
            except Exception as e:
                print(f"[{task_id}] Error: {e}")
                progress_store[task_id] = {
                    "progress": 0,
                    "status": "error",
                    "message": str(e)
                }

        # Start generation in background
        background_tasks.add_task(run_generation)
        
        return {
            "success": True,
            "task_id": task_id,
            "filename": filename
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

    except Exception as e:
        if task_id in progress_store:
            progress_store[task_id] = {
                "progress": 0,
                "status": "error",
                "message": str(e)
            }
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup token
        if task_id in cancellation_tokens:
            cancellation_tokens.pop(task_id, None)


@app.post("/api/catalog/cancel/{task_id}")
async def cancel_task(task_id: str):
    """Cancel a running generation task"""
    if task_id in progress_store:
        cancellation_tokens[task_id] = True
        progress_store[task_id]["message"] = "Cancelling..."
        return {"success": True, "message": "Cancellation requested"}
    raise HTTPException(status_code=404, detail="Task not found")


@app.get("/api/catalog/progress/{task_id}")
async def get_progress(task_id: str):
    """Get progress for a specific catalog generation task"""
    if task_id not in progress_store:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return progress_store[task_id]


@app.get("/api/catalog/download/{filename}")
async def download_catalog(filename: str):
    """Download generated PDF catalog"""
    file_path = os.path.join("output", filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=filename,
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )


@app.get("/api/catalog/stream/{task_id}")
async def stream_progress(task_id: str):
    """
    Server-Sent Events endpoint for real-time progress updates
    """
    async def event_generator():
        while True:
            if task_id in progress_store:
                progress_data = progress_store[task_id]
                yield f"data: {json.dumps(progress_data)}\n\n"
                
                # Stop streaming if complete or error
                if progress_data["status"] in ["complete", "error"]:
                    break
            
            await asyncio.sleep(0.5)  # Update every 500ms
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
