import os
import requests
import json
import sys
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

STEAM_API_KEY = os.environ.get("STEAM_API_KEY")
STEAM_USER_ID = os.environ.get("STEAM_USER_ID")
OUTPUT_DIR = os.path.join("src", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "steam_library.json")
API_BASE_URL = "https://api.steampowered.com"
REQUEST_TIMEOUT = 30
RETRY_ATTEMPTS = 3
RETRY_BACKOFF = 1

def requests_retry_session(
    retries=RETRY_ATTEMPTS, backoff_factor=RETRY_BACKOFF,
    status_forcelist=(500, 502, 503, 504, 429), session=None,
):
    session = session or requests.Session()
    retry = Retry(
        total=retries, read=retries, connect=retries,
        backoff_factor=backoff_factor, status_forcelist=status_forcelist,
        allowed_methods=frozenset(['GET', 'POST']), raise_on_status=False
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

def main():
    if not STEAM_API_KEY:
        print("Fout: STEAM_API_KEY omgevingsvariabele is niet ingesteld!")
        sys.exit(1)
    if not STEAM_USER_ID:
        print("Fout: STEAM_USER_ID omgevingsvariabele is niet ingesteld!")
        sys.exit(1)

    print(f"--- Start Steam Library Fetch (Limited Info) voor gebruiker: {STEAM_USER_ID} ---")
    session = requests_retry_session()

    owned_games_list = []
    try:
        get_owned_url = f"{API_BASE_URL}/IPlayerService/GetOwnedGames/v1/"
        params = {
            "key": STEAM_API_KEY,
            "steamid": STEAM_USER_ID,
            "format": "json",
            "include_played_free_games": 0,
            "include_appinfo": 1
        }
        print(f"Stap 1: Ophalen owned games via {get_owned_url} (met include_appinfo=1)")
        response = session.get(get_owned_url, params=params, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        data = response.json()

        if "response" in data and "games" in data["response"]:
            owned_games_list = data["response"]["games"]
            print(f"  {data['response'].get('game_count', len(owned_games_list))} games gevonden in library response.")
        else:
            print("  Kon geen games vinden in API response. Is het profiel privé of geen games?")

    except requests.exceptions.RequestException as e:
        print(f"  Kritieke Fout bij ophalen Steam library: {e}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"  Kritieke Fout bij parsen Steam library JSON: {e}")
        print(f"  Response Text: {response.text[:500]}...")
        sys.exit(1)

    if not owned_games_list:
        print("  Library is leeg of kon niet worden opgehaald. Stoppen.")
        processed_games = []
    else:
        print("Stap 2: Verwerken van ontvangen data (beperkte info)...")
        processed_games = []
        skipped_no_name = 0

        for game in owned_games_list:
            app_id = game.get("appid")
            name = game.get("name")

            if not app_id or not name:
                skipped_no_name += 1
                continue

            icon_hash = game.get('img_icon_url')
            logo_hash = game.get('img_logo_url')
            icon_url = f"https://media.steampowered.com/steamcommunity/public/images/apps/{app_id}/{icon_hash}.jpg" if icon_hash else None
            logo_url = f"https://media.steampowered.com/steamcommunity/public/images/apps/{app_id}/{logo_hash}.jpg" if logo_hash else None

            game_data = {
                "id": app_id,
                "name": name,
                "image": logo_url,
                "thumbnail": icon_url,
                "release_date": None,
                "developers": [],
                "publishers": [],
                "metacritic_score": None,
                "genres": [],
                "categories": [],
            }
            processed_games.append(game_data)

        if skipped_no_name > 0:
             print(f"  {skipped_no_name} items overgeslagen (ontbrekend ID of naam in response).")
        print(f"  Totaal {len(processed_games)} games verwerkt met basisinformatie.")

    print(f"Stap 3: Opslaan van data naar {OUTPUT_FILE}")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    try:
        output_data = {"games": processed_games}
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"  Steam data (beperkt) succesvol opgeslagen.")
    except IOError as e:
        print(f"  Fout bij schrijven naar {OUTPUT_FILE}: {e}")
        sys.exit(1)

    print(f"--- Steam Library Fetch (Limited Info) Voltooid ---")

if __name__ == "__main__":
    main()
