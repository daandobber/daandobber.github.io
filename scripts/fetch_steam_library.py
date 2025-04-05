# scripts/fetch_steam_library.py
import os
import requests
import json
import time
import sys
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# --- Configuratie ---
STEAM_API_KEY = os.environ.get("STEAM_API_KEY")
STEAM_USER_ID = os.environ.get("STEAM_USER_ID") # Je 64-bit Steam ID
OUTPUT_DIR = os.path.join("src", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "steam_library.json")
API_BASE_URL = "https://api.steampowered.com"
STORE_API_BASE_URL = "https://store.steampowered.com/api"

REQUEST_TIMEOUT = 30
RETRY_ATTEMPTS = 3
RETRY_BACKOFF = 1
# Voor appdetails, batches van ~100 lijken vaak te werken, maar begin voorzichtiger
APP_DETAILS_BATCH_SIZE = 50
SLEEP_BETWEEN_APP_DETAILS_BATCHES = 2 # Seconden wachttijd

# --- Helper Functie (Retry Session) ---
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

# --- Hoofd Logica ---
def main():
    if not STEAM_API_KEY:
        print("Fout: STEAM_API_KEY omgevingsvariabele is niet ingesteld!")
        sys.exit(1)
    if not STEAM_USER_ID:
        print("Fout: STEAM_USER_ID omgevingsvariabele is niet ingesteld!")
        sys.exit(1)

    print(f"--- Start Steam Library Fetch voor gebruiker: {STEAM_USER_ID} ---")
    session = requests_retry_session()

    # --- Stap 1: Haal lijst van owned AppIDs op ---
    owned_games_list = []
    try:
        get_owned_url = f"{API_BASE_URL}/IPlayerService/GetOwnedGames/v1/"
        params = {
            "key": STEAM_API_KEY,
            "steamid": STEAM_USER_ID,
            "format": "json",
            "include_played_free_games": 0,
             # include_appinfo=1 kan soms basis naam/icoon geven, maar onbetrouwbaar
             # "include_appinfo": 0
        }
        print(f"Stap 1: Ophalen owned games via {get_owned_url}")
        response = session.get(get_owned_url, params=params, timeout=REQUEST_TIMEOUT)
        response.raise_for_status() # Check op HTTP errors na retries
        data = response.json()

        if "response" in data and "games" in data["response"]:
            owned_games_list = data["response"]["games"]
            print(f"  {data['response'].get('game_count', 0)} games gevonden in library.")
        else:
            print("  Kon geen games vinden in API response. Is het profiel privé?")
            # Extra debug info:
            # print(f"  API Response: {data}")

    except requests.exceptions.RequestException as e:
        print(f"  Kritieke Fout bij ophalen Steam library: {e}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"  Kritieke Fout bij parsen Steam library JSON: {e}")
        print(f"  Response Text: {response.text[:500]}...")
        sys.exit(1)

    if not owned_games_list:
        print("  Library is leeg of kon niet worden opgehaald. Stoppen.")
        # Maak een leeg bestand aan
        processed_games = []
        # Ga direct naar opslaan
    else:
        app_ids = [str(game["appid"]) for game in owned_games_list]
        game_playtimes = {str(game["appid"]): game.get("playtime_forever", 0) for game in owned_games_list}

        # --- Stap 2: Haal details op via appdetails API (in batches) ---
        app_details_data = {}
        print(f"Stap 2: Ophalen details voor {len(app_ids)} apps in batches van {APP_DETAILS_BATCH_SIZE}...")

        for i in range(0, len(app_ids), APP_DETAILS_BATCH_SIZE):
            batch_ids = app_ids[i:i+APP_DETAILS_BATCH_SIZE]
            ids_str = ",".join(batch_ids)
            details_url = f"{STORE_API_BASE_URL}/appdetails"
            # 'l=dutch' voor Nederlandse taal, 'cc=NL' kan helpen bij regio-specifieke info
            details_params = {"appids": ids_str, "l": "dutch", "cc": "nl"}
            current_batch_num = i // APP_DETAILS_BATCH_SIZE + 1
            total_batches = (len(app_ids) + APP_DETAILS_BATCH_SIZE - 1) // APP_DETAILS_BATCH_SIZE
            print(f"  Batch {current_batch_num}/{total_batches}: Ophalen via {details_url}...")

            try:
                details_response = session.get(details_url, params=details_params, timeout=REQUEST_TIMEOUT)
                if details_response.status_code != 200:
                    print(f"  WAARSCHUWING: Status code {details_response.status_code} voor appdetails batch {ids_str}.")
                    continue # Ga door met volgende batch

                details_json = details_response.json()
                if details_json is None: # Kan gebeuren bij lege response
                     print(f"  WAARSCHUWING: Lege JSON response voor appdetails batch {ids_str}.")
                     continue

                for app_id_str, result in details_json.items():
                    if result.get("success"):
                        app_details_data[app_id_str] = result.get("data", {})
                    else:
                         # Log appids die geen success=true gaven (bv. geen game, verwijderd, etc.)
                         # print(f"  Info: AppID {app_id_str} gaf geen succesvolle details.")
                         pass

            except requests.exceptions.RequestException as e:
                print(f"  WAARSCHUWING: Fout bij ophalen appdetails batch {ids_str}: {e}.")
            except json.JSONDecodeError as e:
                print(f"  WAARSCHUWING: Fout bij parsen appdetails JSON voor batch {ids_str}: {e}. Response: {details_response.text[:500]}...")
            finally:
                 if current_batch_num < total_batches:
                     print(f"    Wachten voor {SLEEP_BETWEEN_APP_DETAILS_BATCHES}s...")
                     time.sleep(SLEEP_BETWEEN_APP_DETAILS_BATCHES)

        print("  Details ophalen voltooid.")

        # --- Stap 3: Combineer data en filter ongewenste velden ---
        print("Stap 3: Verwerken en combineren van data...")
        processed_games = []
        skipped_missing_details = 0

        for app_id_str in app_ids: # Loop door de IDs uit de OWNED lijst
            details = app_details_data.get(app_id_str)
            # We slaan alleen games op waarvoor we details hebben gevonden
            # EN die van het type 'game' zijn (filtert DLC, videos etc. eruit)
            if details and details.get('type') == 'game':
                # Haal gewenste velden eruit, gebruik .get() voor veiligheid
                genres = [genre.get('description') for genre in details.get('genres', []) if genre.get('description')]
                categories = [cat.get('description') for cat in details.get('categories', []) if cat.get('description')]

                game_data = {
                    "id": int(app_id_str), # Converteer ID naar int
                    "name": details.get('name', 'Unknown Name'),
                    "image": details.get('header_image'),
                    "release_date": details.get('release_date', {}).get('date'), # Komt als string bv "10 Oct, 2019"
                    "developers": details.get('developers', []),
                    "publishers": details.get('publishers', []),
                    "metacritic_score": details.get('metacritic', {}).get('score'),
                    "genres": genres,
                    "categories": categories,
                    # --- SPEELTIJD WORDT HIER **NIET** TOEGEVOEGD ---
                    # "playtime_forever": game_playtimes.get(app_id_str, 0)
                }
                processed_games.append(game_data)
            else:
                skipped_missing_details += 1

        if skipped_missing_details > 0:
             print(f"  {skipped_missing_details} items overgeslagen (geen details gevonden of geen type 'game').")
        print(f"  Totaal {len(processed_games)} games verwerkt en toegevoegd aan JSON.")

    # --- Stap 4: Opslaan als JSON ---
    print(f"Stap 4: Opslaan van data naar {OUTPUT_FILE}")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    try:
        output_data = {"games": processed_games}
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"  Steam data succesvol opgeslagen.")
    except IOError as e:
        print(f"  Fout bij schrijven naar {OUTPUT_FILE}: {e}")
        sys.exit(1)

    print(f"--- Steam Library Fetch Voltooid ---")

if __name__ == "__main__":
    main()
