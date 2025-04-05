import os
import requests
import json
import time
import sys
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
SLEEP_PER_GAME = 0.6 # Belangrijk: Pauze tussen API calls PER SPEL om rate limits te voorkomen

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

def get_game_schema(session, app_id, api_key, language="dutch"):
    schema_url = f"{API_BASE_URL}/ISteamUserStats/GetSchemaForGame/v2/"
    params = {"key": api_key, "appid": app_id, "format": "json", "l": language}
    try:
        response = session.get(schema_url, params=params, timeout=REQUEST_TIMEOUT / 2) # Kortere timeout per call
        if response.status_code == 200:
            data = response.json()
            if data and "game" in data and "availableGameStats" in data["game"] and "achievements" in data["game"]["availableGameStats"]:
                 # Maak een dictionary voor snelle lookup op apiname
                 schema_dict = {ach["name"]: ach for ach in data["game"]["availableGameStats"]["achievements"]}
                 return schema_dict
            # Soms geen achievements gedefinieerd
            elif data and "game" in data and "availableGameStats" not in data["game"]:
                 return {} # Lege dict betekent spel gevonden, geen achievements
        # else: print(f"    [Schema] Status {response.status_code} voor appid {app_id}")
    except requests.exceptions.RequestException as e: print(f"    [Schema] Request Error voor appid {app_id}: {e}")
    except json.JSONDecodeError: print(f"    [Schema] JSON Error voor appid {app_id}")
    except Exception as e: print(f"    [Schema] Onverwachte error voor appid {app_id}: {e}")
    return None # None betekent error bij ophalen

def get_player_achievements(session, app_id, steam_id, api_key, language="dutch"):
    ach_url = f"{API_BASE_URL}/ISteamUserStats/GetPlayerAchievements/v1/"
    params = {"key": api_key, "steamid": steam_id, "appid": app_id, "format": "json", "l": language}
    try:
        response = session.get(ach_url, params=params, timeout=REQUEST_TIMEOUT / 2) # Kortere timeout per call
        if response.status_code == 200:
            data = response.json()
            # Check of success true is en achievements bestaan
            if data and data.get("playerstats", {}).get("success") and "achievements" in data.get("playerstats", {}):
                return data["playerstats"]["achievements"] # Lijst van achievements (behaald/niet behaald)
            elif data and not data.get("playerstats", {}).get("success"):
                # print(f"    [PlayerAch] Success=False voor appid {app_id}. Message: {data.get('playerstats', {}).get('message', 'N/A')}")
                return [] # Lege lijst betekent success=false of geen achievements
            else: # Geen achievements in response, maar wel success
                 return [] # Lege lijst
        # else: print(f"    [PlayerAch] Status {response.status_code} voor appid {app_id}")
    except requests.exceptions.RequestException as e: print(f"    [PlayerAch] Request Error voor appid {app_id}: {e}")
    except json.JSONDecodeError: print(f"    [PlayerAch] JSON Error voor appid {app_id}")
    except Exception as e: print(f"    [PlayerAch] Onverwachte error voor appid {app_id}: {e}")
    return None # None betekent error bij ophalen

def main():
    if not STEAM_API_KEY: print("Fout: STEAM_API_KEY niet ingesteld!"); sys.exit(1)
    if not STEAM_USER_ID: print("Fout: STEAM_USER_ID niet ingesteld!"); sys.exit(1)

    print(f"--- Start Steam Library Fetch (Full Achievement Data) voor gebruiker: {STEAM_USER_ID} ---")
    session = requests_retry_session()

    owned_games_list = []
    try:
        get_owned_url = f"{API_BASE_URL}/IPlayerService/GetOwnedGames/v1/"
        params = {"key": STEAM_API_KEY, "steamid": STEAM_USER_ID, "format": "json", "include_played_free_games": 0, "include_appinfo": 1 }
        print(f"Stap 1: Ophalen owned games (incl. appinfo) via {get_owned_url}")
        response = session.get(get_owned_url, params=params, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        data = response.json()
        if "response" in data and "games" in data["response"]:
            owned_games_list = data["response"]["games"]
            print(f"  {data['response'].get('game_count', len(owned_games_list))} games gevonden in library response.")
        else: print("  Kon geen games vinden in API response.")
    except Exception as e: print(f"  Kritieke Fout bij ophalen Steam library: {e}"); sys.exit(1)

    if not owned_games_list:
        print("  Library is leeg of kon niet worden opgehaald. Stoppen.")
        processed_games = []
    else:
        app_ids = [str(game["appid"]) for game in owned_games_list]
        # Bewaar basis game info als fallback
        base_game_info = {str(game["appid"]): {
            "name": game.get("name"),
            "icon_url": f"https://media.steampowered.com/steamcommunity/public/images/apps/{game['appid']}/{game.get('img_icon_url')}.jpg" if game.get('img_icon_url') else None,
            "logo_url": f"https://media.steampowered.com/steamcommunity/public/images/apps/{game['appid']}/{game.get('img_logo_url')}.jpg" if game.get('img_logo_url') else None
            } for game in owned_games_list if game.get("appid")
        }

        app_details_data = {}
        print(f"Stap 2: Ophalen store details voor {len(app_ids)} apps in batches van {APP_DETAILS_BATCH_SIZE}...")
        for i in range(0, len(app_ids), APP_DETAILS_BATCH_SIZE):
            # ... (logica voor appdetails batch ophalen blijft hetzelfde) ...
            batch_ids = app_ids[i:i+APP_DETAILS_BATCH_SIZE]
            ids_str = ",".join(batch_ids)
            details_url = f"{STORE_API_BASE_URL}/appdetails"
            details_params = {"appids": ids_str, "l": "dutch", "cc": "nl"}
            current_batch_num = i // APP_DETAILS_BATCH_SIZE + 1
            total_batches = (len(app_ids) + APP_DETAILS_BATCH_SIZE - 1) // APP_DETAILS_BATCH_SIZE
            print(f"  Batch {current_batch_num}/{total_batches}: Ophalen via {details_url}...")
            try:
                details_response = session.get(details_url, params=details_params, timeout=REQUEST_TIMEOUT)
                if details_response.status_code == 400: print(f"  WAARSCHUWING: Status code 400 (Bad Request) voor appdetails batch {ids_str}.") ; continue
                elif details_response.status_code != 200: print(f"  WAARSCHUWING: Status code {details_response.status_code} voor appdetails batch {ids_str}.") ; continue
                details_json = details_response.json()
                if details_json is None: print(f"  WAARSCHUWING: Lege JSON response voor appdetails batch {ids_str}.") ; continue
                for app_id_str, result in details_json.items():
                    if result.get("success"): app_details_data[app_id_str] = result.get("data", {})
            except Exception as e: print(f"  WAARSCHUWING: Fout bij ophalen/parsen appdetails batch {ids_str}: {e}.")
            finally:
                 if current_batch_num < total_batches: print(f"    Wachten voor {SLEEP_BETWEEN_APP_DETAILS_BATCHES}s..."); time.sleep(SLEEP_BETWEEN_APP_DETAILS_BATCHES)
        print("  Store details ophalen voltooid.")

        print(f"Stap 3: Verwerken per spel (incl. schema & achievements) - Dit kan lang duren!")
        processed_games_dict = {} # Gebruik dict om eventuele dubbele appids te overschrijven
        processed_count = 0

        for app_id_str in app_ids:
            app_id = int(app_id_str)
            processed_count += 1
            print(f"  Verwerken spel {processed_count}/{len(app_ids)}: ID {app_id}...")

            details = app_details_data.get(app_id_str)
            base_info = base_game_info.get(app_id_str, {})

            # Gebruik details indien beschikbaar, anders fallback naar basisinfo
            # Filter direct op type 'game' indien details beschikbaar
            if details and details.get('type') != 'game':
                print(f"    Skipping {app_id}: Geen type 'game' in appdetails.")
                continue

            name = details.get('name') if details else base_info.get('name')
            if not name: # Altijd naam nodig
                print(f"    Skipping {app_id}: Geen naam gevonden.")
                continue

            # Achievement data initialiseren
            achieved_count = 0
            total_achievements = 0
            achievement_percentage = None
            last_achievement_unlock_time = 0 # Gebruik 0 voor sorteren (oudste eerst als geen tijd)
            last_achievement_name = None
            last_achievement_icon = None

            # Haal Schema en Player Achievements op (per spel!)
            schema = get_game_schema(session, app_id, STEAM_API_KEY)
            player_achs = get_player_achievements(session, app_id, STEAM_USER_ID, STEAM_API_KEY)

            if schema is not None and player_achs is not None: # Alleen verwerken als beide calls succesvol waren
                total_achievements = len(schema)
                unlocked_achs = [ach for ach in player_achs if ach.get("achieved") == 1]
                achieved_count = len(unlocked_achs)

                if total_achievements > 0:
                    achievement_percentage = round((achieved_count / total_achievements) * 100, 1)

                if unlocked_achs:
                    # Vind laatste achievement
                    last_ach = max(unlocked_achs, key=lambda x: x.get("unlocktime", 0))
                    last_unlock_time_ts = last_ach.get("unlocktime", 0)
                    if last_unlock_time_ts > 0:
                         last_achievement_unlock_time = last_unlock_time_ts # Bewaar als timestamp
                         last_api_name = last_ach.get("apiname")
                         # Zoek info op in schema
                         if last_api_name and last_api_name in schema:
                             last_achievement_name = schema[last_api_name].get("displayName")
                             last_achievement_icon = schema[last_api_name].get("icon")
            else:
                 print(f"    Waarschuwing: Kon achievement data niet ophalen voor {app_id}.")


            game_data = {
                "id": app_id,
                "name": name,
                "image": details.get('header_image') if details else base_info.get('logo_url'),
                "thumbnail": base_info.get('icon_url'), # Altijd icoon van GetOwnedGames proberen
                "release_date": details.get('release_date', {}).get('date') if details else None,
                "developers": details.get('developers', []) if details else [],
                "publishers": details.get('publishers', []) if details else [],
                "metacritic_score": details.get('metacritic', {}).get('score') if details else None,
                "genres": [g['description'] for g in details.get('genres', []) if g.get('description')] if details else [],
                "categories": [c['description'] for c in details.get('categories', []) if c.get('description')] if details else [],
                "achieved_count": achieved_count,
                "total_achievements": total_achievements,
                "achievement_percentage": achievement_percentage,
                "last_achievement_unlock_time": last_achievement_unlock_time,
                "last_achievement_name": last_achievement_name,
                "last_achievement_icon": last_achievement_icon
            }
            processed_games_dict[app_id_str] = game_data

            # Pauzeer na elke set API calls voor een spel
            time.sleep(SLEEP_PER_GAME)

        print(f"  Verwerking voltooid.")
        final_games_list = list(processed_games_dict.values())

    print(f"Stap 4: Opslaan van data naar {OUTPUT_FILE}")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    try:
        output_data = {"games": final_games_list}
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"  Steam data (uitgebreid) succesvol opgeslagen.")
    except IOError as e: print(f"  Fout bij schrijven naar {OUTPUT_FILE}: {e}"); sys.exit(1)
    except Exception as e: print(f"  Onverwachte fout bij opslaan JSON: {e}"); sys.exit(1)


    print(f"--- Steam Library Fetch (Full Achievement Data) Voltooid ---")

if __name__ == "__main__":
    main()
