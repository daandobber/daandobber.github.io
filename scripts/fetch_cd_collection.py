import os
import requests
import json

DISC_TOKEN = os.environ.get("DISC_TOKEN")
DISC_USERNAME = os.environ.get("DISC_USERNAME")

if not DISC_TOKEN or not DISC_USERNAME:
    raise ValueError("Ontbrekende environment variables: DISC_TOKEN en/of DISC_USERNAME")

api_url = f"https://api.discogs.com/users/{DISC_USERNAME}/collection/folders/0/releases?token={DISC_TOKEN}"
response = requests.get(api_url)

if response.status_code != 200:
    raise Exception(f"Fout bij ophalen Discogs-data: {response.status_code} - {response.text}")

data = response.json()
releases = data.get("releases", [])

# Sla de data op in een JSON-bestand (bijvoorbeeld in src/data/)
output = {"releases": releases}
with open("src/data/cd_collection.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print("Discogs-data succesvol opgeslagen.")
