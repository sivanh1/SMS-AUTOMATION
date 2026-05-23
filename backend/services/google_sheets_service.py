import os
import gspread
from google.oauth2.service_account import Credentials

GOOGLE_SCOPE = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)
credentials_path = os.path.join(
    BASE_DIR,
    "credentials.json"
)
credentials = Credentials.from_service_account_file(
    credentials_path,
    scopes=GOOGLE_SCOPE
)

google_client = gspread.authorize(credentials)
def get_sheet_data(sheet_id):
    spreadsheet = google_client.open_by_key(sheet_id)
    worksheet = spreadsheet.sheet1
    records = worksheet.get_all_records()
    return records