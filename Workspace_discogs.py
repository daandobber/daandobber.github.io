import os
import requests
import json

# Haal token en gebruikersnaam uit omgevingsvariabelen
# Deze worden ingesteld door GitHub Actions via Secrets
DISC_TOKEN = os.environ.get("DISCOGS_TOKEN")
DISC_USERNAME = os.environ.get("DISCOGS_USERNAME")

# Controleer of de variabelen zijn ingesteld
if not DISC_TOKEN or not DISC_USERNAME:
    raise Exception("DISCOGS_TOKEN en/of DISCOGS_USERNAME omgevingsvariabelen zijn niet ingesteld!")

# Bouw de API-URL
api_url = f"https://api.discogs.com/users/{DISC_USERNAME}/collection/folders/0/releases?token={DISC_TOKEN}"

# Doe de API-aanroep
try:
    response = requests.get(api_url, timeout=30) # Timeout toegevoegd
    response.raise_for_status() # Werpt een error bij status codes 4xx of 5xx
except requests.exceptions.RequestException as e:
    raise Exception(f"Fout bij ophalen Discogs-data: {e}")

# Parse de JSON-data
data = response.json()
releases = data.get("releases", [])

# Zorg dat de output map bestaat (src/data)
output_dir = os.path.join("src", "data") # Gebruik relatief pad
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "cd_collection.json")

# Sla de data op in een JSON-bestand
try:
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({"releases": releases}, f, indent=2, ensure_ascii=False)
    print(f"Discogs-data succesvol opgeslagen in {output_path}.")
except IOError as e:
    raise Exception(f"Fout bij schrijven naar {output_path}: {e}")
