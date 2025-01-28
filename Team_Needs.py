from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import firebase_admin
from firebase_admin import firestore

nfl_teams = {
    "ARI": "Arizona",
    "ATL": "Atlanta",
    "BAL": "Baltimore",
    "BUF": "Buffalo",
    "CAR": "Carolina",
    "CHI": "Chicago",
    "CIN": "Cincinnati",
    "CLE": "Cleveland",
    "DAL": "Dallas",
    "DEN": "Denver",
    "DET": "Detroit",
    "GB": "Green Bay",
    "HOU": "Houston",
    "IND": "Indianapolis",
    "JAX": "Jacksonville",
    "KC": "Kansas City",
    "LV": "Las Vegas",
    "LAC": "LA Chargers",
    "LAR": "LA Rams",
    "MIA": "Miami",
    "MIN": "Minnesota",
    "NE": "New England",
    "NO": "New Orleans",
    "NYG": "NY Giants",
    "NYJ": "NY Jets",
    "PHI": "Philadelphia",
    "PIT": "Pittsburgh",
    "SF": "San Francisco",
    "SEA": "Seattle",
    "TB": "Tampa Bay",
    "TEN": "Tennessee",
    "WAS": "Washington"
}

# Initialize Firebase
firebase_admin.initialize_app()
db = firestore.client()

# Configure WebDriver
chrome_options = Options()
chrome_options.add_argument("--disable-extensions")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
chrome_options.add_argument("--headless")
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# Open the URL
url = 'https://www.nflmockdraftdatabase.com/team-needs-2025'
driver.get(url)

# Find all sections
sections = driver.find_elements(By.XPATH, '//li[contains(@class, "mock-list-item")]')

for section in sections:
    try:
        # Extract team abbreviation
        team_title_element = section.find_element(By.CSS_SELECTOR, '.pick-number.with-subtitle.medium-pick-number')
        team_abv = team_title_element.text.strip()

        # Extract needs
        needs_element = section.find_element(By.CSS_SELECTOR, '.player-name.player-name-smaller')
        needs_text = needs_element.text.strip()
        needs_list = needs_text.split(", ")

        # Get full team name
        team_name = nfl_teams.get(team_abv, "unknown")

        # Save to Firestore
        if team_name != "unknown" and len(needs_list) >= 7:
            doc_ref = db.collection("Team_Needs").document(team_name)
            doc_ref.set({
                "Need#1": needs_list[0],
                "Need#2": needs_list[1],
                "Need#3": needs_list[2],
                "Need#4": needs_list[3],
                "Need#5": needs_list[4],
                "Need#6": needs_list[5],
                "Need#7": needs_list[6],
            })
    except Exception as e:
        print(f"Error processing section: {e}")

# Close the WebDriver
driver.quit()
