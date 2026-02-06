
import sys
import os
import asyncio

# Add the current directory to sys.path to import services
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from services.pdf_service import PDFService

async def test_pdf_logic():
    pdf_service = PDFService()
    
    # Mock data with flat and hierarchical categories
    data = [
        ["Code", "Description", "Image", "Price", "Author", "Category"],
        ["P1", "Product 1", "", "100", "Author 1", "Fiction > Mystery"],
        ["P2", "Product 2", "", "200", "Author 2", "Cooking"],
        ["P3", "Product 3", "", "300", "Author 3", "Non-fiction > History"],
        ["P4", "Product 4", "", "400", "Author 4", "Art"],
    ]
    
    # Test analyze_categories
    print("Testing analyze_categories with hierarchical and flat categories...")
    products_by_category, main_categories = pdf_service.analyze_categories(data)
    
    print(f"Main Categories found: {main_categories}")
    print(f"Sub Categories found: {list(products_by_category.keys())}")
    
    # Check if P2 (Cooking) and P4 (Art) are present
    flat_cats_found = any("Cooking" in k for k in products_by_category.keys()) and \
                      any("Art" in k for k in products_by_category.keys())
    
    if flat_cats_found:
        print("SUCCESS: Flat categories correctly identified.")
    else:
        print("FAILURE: Flat categories missing from analysis.")
        return

    # Test filtering
    print("\nTesting with selected_items=['Cooking']...")
    products_by_category, main_categories = pdf_service.analyze_categories(data, selected_items=["Cooking"])
    print(f"Main Categories found: {main_categories}")
    print(f"Keys found: {list(products_by_category.keys())}")
    
    if "Cooking|" in products_by_category:
        print("SUCCESS: Filtering for flat category works.")
    else:
        print("FAILURE: Filtering for flat category failed.")

if __name__ == "__main__":
    asyncio.run(test_pdf_logic())
