from enum import Enum
from pydantic import BaseModel
from typing import List, Optional


class CatalogType(str, Enum):
    """Type of catalog to generate"""
    CATEGORY = "category"
    AUTHOR = "author"
    FULL = "full"


class CatalogRequest(BaseModel):
    """Request model for catalog generation"""
    catalog_type: CatalogType
    selected_items: Optional[List[str]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "catalog_type": "category",
                "selected_items": ["Fiction > Mystery", "Non-Fiction > Biography"]
            }
        }
