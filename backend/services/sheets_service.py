import os
import json
from typing import List, Dict, Any, Set
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

load_dotenv()


class SheetsService:
    """Service for interacting with Google Sheets API"""
    
    def __init__(self):
        self.spreadsheet_id = os.getenv("SPREADSHEET_ID")
        self.credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "credentials.json")
        self.service = None
        self._initialize_service()
    
    def _initialize_service(self):
        """Initialize Google Sheets API service"""
        try:
            # Check if credentials are provided in an environment variable as a JSON string
            creds_json = os.getenv("GOOGLE_CREDENTIALS_JSON")
            
            if creds_json:
                # Load credentials from JSON string
                creds_info = json.loads(creds_json)
                credentials = service_account.Credentials.from_service_account_info(
                    creds_info,
                    scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
                )
                print("Using credentials from GOOGLE_CREDENTIALS_JSON environment variable.")
            elif os.path.exists(self.credentials_path):
                # Fallback to local file
                credentials = service_account.Credentials.from_service_account_file(
                    self.credentials_path,
                    scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
                )
                print(f"Using credentials from {self.credentials_path}.")
            else:
                print(f"Warning: No credentials found (variable or file). Running in MOCK MODE.")
                self.mock_mode = True
                return

            self.service = build('sheets', 'v4', credentials=credentials)
            self.mock_mode = False
        except Exception as e:
            print(f"Error initializing Google Sheets service: {e}. Running in MOCK MODE.")
            self.mock_mode = True

    async def get_sheet_data(self, range_name: str = "A:F") -> List[List[str]]:
        """
        Fetch data from Google Sheets
        
        Args:
            range_name: Range to fetch (default: A:F for columns A through F)
            
        Returns:
            List of rows, each row is a list of cell values
        """
        if self.mock_mode:
            # Return sample data for demonstration
            return [
                ["Code", "Description", "Image", "Price", "Author", "Category"],
                ["P001", "Sample Mystery Book", "https://via.placeholder.com/150", "$19.99", "Agatha Christie", "Fiction > Mystery"],
                ["P002", "Python Programming", "https://via.placeholder.com/150", "$29.99", "Guido van Rossum", "Computers > Programming"],
                ["P003", "Space Adventure", "https://via.placeholder.com/150", "$15.99", "Isaac Asimov", "Fiction > Sci-Fi"],
                ["P004", "History of Rome", "https://via.placeholder.com/150", "$24.99", "Mary Beard", "Non-Fiction > History"],
                ["P005", "Delicious Recipes", "https://via.placeholder.com/150", "$35.00", "Gordon Ramsay", "Cooking"],
                ["P006", "The Great Gatsby", "https://via.placeholder.com/150", "$12.99", "F. Scott Fitzgerald", "Fiction > Classic"],
                ["P007", "Quantum Physics", "https://via.placeholder.com/150", "$45.00", "Stephen Hawking", "Science > Physics"],
                ["P008", "Modern Art", "https://via.placeholder.com/150", "$55.00", "Banksy", "Arts > Modern"],
            ]

        try:
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.spreadsheet_id,
                range=range_name
            ).execute()
            
            values = result.get('values', [])
            
            if not values:
                return []
            
            # Ensure all rows have 6 columns (pad with empty strings if needed)
            normalized_data = []
            for row in values:
                if len(row) < 6:
                    row.extend([''] * (6 - len(row)))
                normalized_data.append(row)
            
            return normalized_data
            
        except HttpError as e:
            print(f"Error fetching sheet data: {e}")
            raise
    
    def extract_categories(self, data: List[List[str]]) -> List[Dict[str, Any]]:
        """
        Extract unique categories from sheet data
        
        Returns:
            List of category dictionaries with name and product count
        """
        categories_dict: Dict[str, int] = {}
        
        # Skip header row
        for row in data[1:]:
            if len(row) > 5 and row[5]:
                category_cell = str(row[5]).strip()
                
                # Split by comma for multiple categories
                categories = [cat.strip() for cat in category_cell.split(',')]
                
                for category in categories:
                    if category:
                        # Count products per category
                        if category in categories_dict:
                            categories_dict[category] += 1
                        else:
                            categories_dict[category] = 1
        
        # Convert to list of dicts and sort
        categories_list = [
            {"name": cat, "count": count}
            for cat, count in sorted(categories_dict.items())
        ]
        
        return categories_list
    
    def extract_authors(self, data: List[List[str]]) -> List[Dict[str, Any]]:
        """
        Extract unique authors from sheet data
        
        Returns:
            List of author dictionaries with name and product count
        """
        authors_dict: Dict[str, int] = {}
        
        # Skip header row
        for row in data[1:]:
            if len(row) > 4 and row[4]:
                author = str(row[4]).strip()
                
                if author:
                    if author in authors_dict:
                        authors_dict[author] += 1
                    else:
                        authors_dict[author] = 1
        
        # Convert to list of dicts and sort
        authors_list = [
            {"name": author, "count": count}
            for author, count in sorted(authors_dict.items())
        ]
        
        return authors_list
    
    def filter_by_categories(
        self,
        data: List[List[str]],
        selected_categories: List[str]
    ) -> List[List[str]]:
        """
        Filter data by selected categories
        
        Args:
            data: Full sheet data
            selected_categories: List of category names to include
            
        Returns:
            Filtered data containing only products in selected categories
        """
        filtered_data = [data[0]]  # Include header
        
        for row in data[1:]:
            if len(row) > 5 and row[5]:
                category_cell = str(row[5]).strip()
                categories = [cat.strip() for cat in category_cell.split(',')]
                
                # Check if any selected category matches
                if any(cat in selected_categories for cat in categories):
                    filtered_data.append(row)
        
        return filtered_data
    
    def filter_by_authors(
        self,
        data: List[List[str]],
        selected_authors: List[str]
    ) -> List[List[str]]:
        """
        Filter data by selected authors
        
        Args:
            data: Full sheet data
            selected_authors: List of author names to include
            
        Returns:
            Filtered data containing only products by selected authors
        """
        filtered_data = [data[0]]  # Include header
        
        for row in data[1:]:
            if len(row) > 4 and row[4]:
                author = str(row[4]).strip()
                
                if author in selected_authors:
                    filtered_data.append(row)
        
        return filtered_data
