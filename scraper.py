import requests
from bs4 import BeautifulSoup

base_url = 'https://www.nflmockdraftdatabase.com'
#Imports basic WEbsite to Scrape
res = requests.get(f'{base_url}/mock-drafts/2025')
res.raise_for_status()
initialSoup = BeautifulSoup(res.text, 'html.parser')
#Finds all links that contain new mock drafts
links = initialSoup.find_all('a', class_='link-container')
import firebase_admin
from firebase_admin import firestore

# Application Default credentials are automatically created.
app = firebase_admin.initialize_app()
db = firestore.client()
mockCounter = 1
for link in links:
    href = link.get('href')
    if href:
        mock_url = f"{base_url}{href}"
        print(f"Fetching mock draft from: {mock_url}")
        #pulls data from each mock draft
        mock_res = requests.get(mock_url)
        mock_res.raise_for_status()
        innerSoup = BeautifulSoup(mock_res.text, 'html.parser')
        #Gains Player info from player name tags
        players = innerSoup.find_all(class_='player-name player-name-bold')
        counter = 1
        doc_ref = db.collection("Mock_Drafts").document(f"{mockCounter}MockDraft")
        doc_ref.set({})
        for player in players:
            #Fetches name and outputs it with pick counter
            player_link = player.find('a')
            if player_link and counter < 33:
                player_name = player_link.get_text(strip=True)
                doc_ref.update({f"Pick_{counter}": player_name})
                print(f"Pick {counter}: Player: {player_name}")
                counter += 1
    mockCounter += 1
