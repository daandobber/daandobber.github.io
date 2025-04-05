import os
import requests
import json
import sys
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from datetime import datetime

STEAM_API_KEY = os.environ.get("STEAM_API_KEY")
STEAM_USER_ID = os.environ.get("STEAM_USER_ID")
OUTPUT_DIR = os.path.join("src", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "steam_library.json")
API_BASE_URL = "https://api.steampowered.com"
STORE_API_BASE_URL = "https://store.steampowered.com/api"
REQUEST_TIMEOUT = 30
RETRY_ATTEMPTS = 3
RETRY_BACKOFF = 1
APP_DETAILS_BATCH_SIZE = 50
SLEEP_BETWEEN_APP_DETAILS_BATCHES = 2
MAX_GAMES_TO_PROCESS = 0 # 0 betekent geen limiet

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
    if not STEAM_API_KEY: print("Fout: STEAM_API_KEY niet gevonden!"); sys.exit(1)
    if not STEAM_USER_ID: print("Fout: STEAM_USER_ID niet gevonden!"); sys.exit(1)

    print(f"--- Start Steam Fetch (AppDetails Full) User: {STEAM_USER_ID} ---")
    session = requests_retry_session()

    owned_games_list = []
    try:
        get_owned_url = f"{API_BASE_URL}/IPlayerService/GetOwnedGames/v1/"
        params = {"key": STEAM_API_KEY, "steamid": STEAM_USER_ID, "format": "json", "include_played_free_games": 0, "include_appinfo": 1 }
        print(f"Stap 1: Ophalen owned games via {get_owned_url}")
        response = session.get(get_owned_url, params=params, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        data = response.json()
        if "response" in data and "games" in data["response"]:
            owned_games_list = data["response"]["games"]
            print(f"  {data['response'].get('game_count', len(owned_games_list))} games in library response.")
        else: print("  Kon geen games vinden in API response.")
    except Exception as e: print(f"  Kritieke Fout bij ophalen Steam library: {e}"); sys.exit(1)

    if not owned_games_list:
        print("  Library is leeg. Opslaan lege lijst.")
        processed_games = []
    else:
        app_ids = [str(game["appid"]) for game in owned_games_list if game.get("appid")]
        base_game_info = {str(game["appid"]): {
            "name": game.get("name"),
            "icon_url": f"https://media.steampowered.com/steamcommunity/public/images/apps/{game['appid']}/{game.get('img_icon_url')}.jpg" if game.get('img_icon_url') else None,
            "logo_url": f"https://media.steampowered.com/steamcommunity/public/images/apps/{game['appid']}/{game.get('img_logo_url')}.jpg" if game.get('img_logo_url') else None
            } for game in owned_games_list if game.get("appid")
        }

        # --- Pas Limiet Toe (nu effectief uitgeschakeld met 0) ---
        if MAX_GAMES_TO_PROCESS > 0 and len(app_ids) > MAX_GAMES_TO_PROCESS:
            print(f"  BEPERKING: Ophalen/Verwerken van max {MAX_GAMES_TO_PROCESS} games.")
            app_ids_to_process = app_ids[:MAX_GAMES_TO_PROCESS]
        else:
            app_ids_to_process = app_ids # Verwerk alles
        # --------------------------------------------------------

        app_details_data = {}
        print(f"Stap 2: Ophalen store details voor {len(app_ids_to_process)} apps...")
        for i in range(0, len(app_ids_to_process), APP_DETAILS_BATCH_SIZE):
            batch_ids = app_ids_to_process[i:i+APP_DETAILS_BATCH_SIZE]
            ids_str = ",".join(batch_ids)
            details_url = f"{STORE_API_BASE_URL}/appdetails"
            details_params = {"appids": ids_str} # Zonder taal/regio codes
            current_batch_num = i // APP_DETAILS_BATCH_SIZE + 1
            total_batches = (len(app_ids_to_process) + APP_DETAILS_BATCH_SIZE - 1) // APP_DETAILS_BATCH_SIZE
            print(f"  Batch {current_batch_num}/{total_batches} appdetails...")
            try:
                details_response = session.get(details_url, params=details_params, timeout=REQUEST_TIMEOUT)
                if details_response.status_code != 200: print(f"  Warn: Status {details_response.status_code} appdetails batch."); continue
                details_json = details_response.json()
                if details_json is None: print(f"  Warn: Lege JSON appdetails batch."); continue
                for app_id_str, result in details_json.items():
                    if result.get("success"): app_details_data[app_id_str] = result.get("data", {})
            except Exception as e: print(f"  Warn: Fout appdetails batch {ids_str}: {e}.")
            finally:
                 if current_batch_num < total_batches : time.sleep(SLEEP_BETWEEN_APP_DETAILS_BATCHES)
        print("  Store details ophalen voltooid.")

        print("Stap 3: Verwerken van data...")
        processed_games = []
        skipped_missing_details_or_name = 0

        for app_id_str in app_ids_to_process:
            app_id = int(app_id_str)
            details = app_details_data.get(app_id_str)
            base_info = base_game_info.get(app_id_str, {})
            name = details.get('name') if details else base_info.get('name')
            if not name: skipped_missing_details_or_name +=1; continue
            if details and details.get('type') != 'game': skipped_missing_details_or_name += 1; continue

            game_data = {
                "id": app_id, "name": name,
                "image": details.get('header_image') if details else base_info.get('logo_url'),
                "thumbnail": base_info.get('icon_url'),
                "release_date": details.get('release_date', {}).get('date') if details else None,
                "developers": details.get('developers', []) if details else [],
                "publishers": details.get('publishers', []) if details else [],
                "metacritic_score": details.get('metacritic', {}).get('score') if details else None,
                "genres": [g['description'] for g in details.get('genres', []) if g.get('description')] if details else [],
                "categories": [c['description'] for c in details.get('categories', []) if c.get('description')] if details else [],
                "achieved_count": 0, "total_achievements": 0,
                "achievement_percentage": None, "last_achievement_unlock_time": 0,
                "last_achievement_name": None, "last_achievement_icon": None
            }
            processed_games.append(game_data)

        if skipped_missing_details_or_name > 0:
             print(f"  {skipped_missing_details_or_name} items overgeslagen (geen details/naam of geen game type).")
        print(f"  Totaal {len(processed_games)} games verwerkt voor opslag.")

    print(f"Stap 4: Opslaan van data naar {OUTPUT_FILE}")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    try:
        output_data = {"games": processed_games}
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"  Steam data succesvol opgeslagen.")
    except Exception as e: print(f"  Fout bij opslaan JSON: {e}"); sys.exit(1)

    print(f"--- Steam Fetch (AppDetails Full) Voltooid ---")

if __name__ == "__main__":
    main()