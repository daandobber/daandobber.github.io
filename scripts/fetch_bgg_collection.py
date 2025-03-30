# fetch_bgg_collection.py
import os
import requests
import xml.etree.ElementTree as ET
import json
import time
import sys
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# --- Configuratie ---
BGG_USERNAME = os.environ.get("BGG_USERNAME")
OUTPUT_DIR = os.path.join("src", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "bgg_collection.json")
API_BASE_URL = "https://boardgamegeek.com/xmlapi2"
# --- TEST: Details en Expansies tijdelijk uitgezet voor de collection call ---
FETCH_DETAILS = True # Laten we nog steeds proberen details op te halen ALS we IDs vinden
# FETCH_EXPANSIONS = True # Deze heeft nu geen effect op de params hieronder
# ----------------------------------------------------------------------------
REQUEST_TIMEOUT = 60
RETRY_ATTEMPTS = 5
RETRY_BACKOFF = 1
BATCH_SIZE = 50
SLEEP_BETWEEN_BATCHES = 5

# --- Helper Functies ---
# (Deze functies blijven hetzelfde als voorheen)
def requests_retry_session(
    retries=RETRY_ATTEMPTS,
    backoff_factor=RETRY_BACKOFF,
    status_forcelist=(500, 502, 503, 504, 429),
    session=None,
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

def get_value(element, tag, attribute=None, default=None):
    if element is None: return default
    node = element.find(tag)
    if node is not None:
        if attribute: return node.get(attribute, default)
        elif node.text is not None: return node.text.strip()
        elif 'value' in node.attrib: return node.get('value', default)
    return default

def get_list_values(element, tag, attribute='value'):
    if element is None: return []
    return [item.get(attribute) for item in element.findall(f".//{tag}[@{attribute}]") if item.get(attribute)]

def get_best_with_players(poll):
    if poll is None: return None
    best_votes = -1
    best_numplayers = None
    for results in poll.findall("./results"):
        numplayers = results.get('numplayers')
        if not numplayers: continue
        is_plus = numplayers.endswith('+')
        numplayers_clean = numplayers[:-1] if is_plus else numplayers
        try:
           numplayers_int = int(numplayers_clean)
           best_result = results.find("./result[@value='Best']")
           if best_result is not None:
               votes = int(best_result.get('numvotes', 0))
               if votes > best_votes:
                   best_votes = votes
                   best_numplayers = numplayers
               elif votes == best_votes and best_numplayers is not None:
                    current_best_is_plus = best_numplayers.endswith('+')
                    current_best_val = int(best_numplayers[:-1] if current_best_is_plus else best_numplayers)
                    if numplayers_int < current_best_val:
                         best_numplayers = numplayers
        except (ValueError, TypeError):
            print(f"  Waarschuwing: Kon 'numplayers' attribuut niet parsen: {numplayers}")
            continue
    return best_numplayers if best_votes > 0 else None

# --- Hoofd Logica ---
def main():
    if not BGG_USERNAME:
        print("Fout: BGG_USERNAME omgevingsvariabele is niet ingesteld!")
        sys.exit(1)

    print(f"--- Start BGG Collectie Fetch voor gebruiker: {BGG_USERNAME} ---")

    # --- BELANGRIJKE AANPASSING VOOR TESTEN ---
    # We gebruiken nu alleen 'username' en 'own=1' om de API call te versimpelen.
    # 'stats=1' en 'subtype=' zijn weggelaten uit deze eerste call.
    collection_params = {
        "username": BGG_USERNAME,
        "own": "1"
    }
    print("TEST: Gebruik alleen 'username' en 'own=1' parameters voor collectie-oproep.")
    # -----------------------------------------

    collection_url = f"{API_BASE_URL}/collection"
    print(f"Stap 1: Ophalen collectie via {collection_url} met params {collection_params}")

    session = requests_retry_session()
    collection_root = None
    try:
        response = session.get(collection_url, params=collection_params, timeout=REQUEST_TIMEOUT)
        retry_count = 0
        while response.status_code == 202 and retry_count < 10:
             wait_time = 5 + retry_count * 2
             print(f"  BGG genereert collectie data, wachten ({wait_time}s)... (Poging {retry_count + 1})")
             time.sleep(wait_time)
             response = session.get(collection_url, params=collection_params, timeout=REQUEST_TIMEOUT)
             retry_count += 1

        if response.status_code != 200:
             print(f"  Fout: Onverwachte status code {response.status_code} na retries. Response:")
             print(f"  {response.text[:500]}...")
             try:
                 error_root = ET.fromstring(response.content)
                 error_message = error_root.findtext('.//message') or error_root.findtext('.//error/message')
                 if error_message: print(f"  BGG Error Message: {error_message}")
             except ET.ParseError: pass
             sys.exit(1)

        collection_root = ET.fromstring(response.content)

    except requests.exceptions.RequestException as e:
        print(f"  Kritieke Fout bij ophalen BGG collectie: {e}")
        sys.exit(1)
    except ET.ParseError as e:
         print(f"  Kritieke Fout bij parsen BGG collectie XML: {e}\n  Response:\n{response.text[:500]}...")
         sys.exit(1)

    # --- LET OP: We filteren hier nu zelf op subtype als we expansies *niet* willen ---
    # Want de subtype filter is uit de API call gehaald.
    # Als je FETCH_EXPANSIONS=False zou zetten, zou je hier moeten filteren.
    # Voor nu (FETCH_EXPANSIONS=True) pakken we alles wat de API call teruggeeft.
    game_items = collection_root.findall('./item') # Pak alle items
    print(f"  Collectie (met alleen own=1 filter) bevat {len(game_items)} items.")

    if not game_items:
         print("  Geen items gevonden in de collectie met own=1. Controleer gebruikersnaam en BGG-instellingen (status Own? Privacy?).")
         processed_games = [] # Lege lijst
    else:
        # --- Stap 2: Detail ophalen (indien FETCH_DETAILS == True) ---
        # Deze logica blijft hetzelfde, maar gebruikt nu de IDs die we hopelijk wél hebben gevonden.
        game_ids = [item.get('objectid') for item in game_items if item.get('objectid')]
        detailed_games_data = {}

        if FETCH_DETAILS and game_ids:
            print(f"Stap 2: Ophalen details voor {len(game_ids)} spellen in batches van {BATCH_SIZE}...")
            for i in range(0, len(game_ids), BATCH_SIZE):
                batch_ids = game_ids[i:i+BATCH_SIZE]
                ids_str = ",".join(batch_ids)
                details_url = f"{API_BASE_URL}/thing"
                # We voegen stats=1 HIER toe, bij de /thing call
                details_params = {"id": ids_str, "stats": "1"}
                current_batch_num = i // BATCH_SIZE + 1
                total_batches = (len(game_ids) + BATCH_SIZE - 1) // BATCH_SIZE
                print(f"  Batch {current_batch_num}/{total_batches}: Ophalen details via {details_url} (met stats=1)...")

                try:
                    details_response = session.get(details_url, params=details_params, timeout=REQUEST_TIMEOUT)
                    if details_response.status_code != 200:
                         print(f"  WAARSCHUWING: Onverwachte status code {details_response.status_code} voor batch {ids_str}. Response:")
                         print(f"  {details_response.text[:500]}...")
                         continue
                    details_root = ET.fromstring(details_response.content)
                    for item in details_root.findall('./item'):
                         game_id = item.get('id')
                         if game_id: detailed_games_data[game_id] = item
                except requests.exceptions.RequestException as e:
                    print(f"  WAARSCHUWING: Fout bij ophalen batch {ids_str}: {e}.")
                except ET.ParseError as e:
                    print(f"  WAARSCHUWING: Fout bij parsen details XML voor batch {ids_str}: {e}. Response: {details_response.text[:500]}...")
                finally:
                     if current_batch_num < total_batches:
                         print(f"    Wachten voor {SLEEP_BETWEEN_BATCHES}s...")
                         time.sleep(SLEEP_BETWEEN_BATCHES)
            print("  Details ophalen voltooid.")
        elif not FETCH_DETAILS:
            print("Stap 2: Details ophalen overgeslagen (FETCH_DETAILS is False).")

        # --- Stap 3: Verwerken en combineren ---
        # Deze logica blijft grotendeels hetzelfde
        print("Stap 3: Verwerken en combineren van data...")
        processed_games = []
        skipped_count = 0
        for item in game_items:
            game_id = item.get('objectid')
            # We halen subtype nu uit de <item> tag zelf, want het zat niet in de params
            subtype = item.get('subtype')
            if not game_id:
                skipped_count += 1; continue

            is_expansion = (subtype == 'boardgameexpansion')
            detailed_item = detailed_games_data.get(game_id)

            if detailed_item is not None:
                 item_type = detailed_item.get('type')
                 if item_type not in ['boardgame', 'boardgameexpansion']:
                      skipped_count += 1; continue
                 is_expansion = (item_type == 'boardgameexpansion')
            elif FETCH_DETAILS and not detailed_item:
                 pass

            # Basis info uit /collection call (stats ontbreken hier nu!)
            game_data = {
                "id": game_id,
                "name": get_value(item, 'name', default="Unknown Name"),
                "yearpublished": get_value(item, 'yearpublished', default=None),
                "image": get_value(item, 'image', default=None),
                "thumbnail": get_value(item, 'thumbnail', default=None),
                "status": {}, "numplays": int(get_value(item, 'numplays', default=0)),
                "minplayers": None, "maxplayers": None, "playingtime": None,
                "minplaytime": None, "maxplaytime": None, "minage": None,
                "weight": None, "rating": None, "average_rating": None,
                "categories": [], "mechanics": [], "is_expansion": is_expansion,
                "best_with_players": None,
            }
            status_node = item.find('status')
            if status_node is not None:
                 game_data["status"] = { attr: status_node.get(attr) == '1' for attr in status_node.attrib if attr not in ['lastmodified'] }
                 game_data["status"]["lastmodified"] = status_node.get('lastmodified')

            # Vul stats nu primair uit /thing data (als FETCH_DETAILS=True)
            if detailed_item:
                game_data.update({
                     "name": get_value(detailed_item.find('./name[@type="primary"]'), 'value', default=game_data['name']),
                     "yearpublished": get_value(detailed_item, 'yearpublished', 'value', default=game_data['yearpublished']),
                     "image": get_value(detailed_item, 'image', default=game_data['image']),
                     "thumbnail": get_value(detailed_item, 'thumbnail', default=game_data['thumbnail']),
                     "minplayers": int(get_value(detailed_item, 'minplayers', 'value', default=0)),
                     "maxplayers": int(get_value(detailed_item, 'maxplayers', 'value', default=0)),
                     "playingtime": int(get_value(detailed_item, 'playingtime', 'value', default=0)),
                     "minplaytime": int(get_value(detailed_item, 'minplaytime', 'value', default=0)),
                     "maxplaytime": int(get_value(detailed_item, 'maxplaytime', 'value', default=0)),
                     "minage": int(get_value(detailed_item, 'minage', 'value', default=0)),
                })
                game_data['categories'] = get_list_values(detailed_item, 'link[@type="boardgamecategory"]', 'value')
                game_data['mechanics'] = get_list_values(detailed_item, 'link[@type="boardgamemechanic"]', 'value')
                poll = detailed_item.find('./poll[@name="suggested_numplayers"]')
                if poll: game_data['best_with_players'] = get_best_with_players(poll)

                stats_element_detail = detailed_item.find('statistics/ratings')
                if stats_element_detail:
                     # Eigen rating zit NIET in /thing API stats, die komt alleen uit /collection?stats=1
                     # We halen alleen average rating en weight uit /thing
                     game_data['average_rating'] = float(get_value(stats_element_detail, 'average', 'value', default=0.0))
                     game_data['weight'] = float(get_value(stats_element_detail, 'averageweight', 'value', default=0.0))
                     # Probeer persoonlijke rating uit de oorspronkelijke /collection item te halen (als stats daar aan stonden)
                     stats_element_orig = item.find('stats')
                     if stats_element_orig:
                         rating_node_orig = stats_element_orig.find('rating')
                         game_data['rating'] = float(rating_node_orig.get('value', 0.0)) if rating_node_orig is not None and rating_node_orig.get('value') != 'N/A' else None

            if not game_data["playingtime"] and game_data["minplaytime"] and game_data["maxplaytime"]:
                game_data["playingtime"] = game_data["maxplaytime"]

            for key in ["yearpublished", "minplayers", "maxplayers", "playingtime", "minplaytime", "maxplaytime", "minage", "weight", "rating", "average_rating"]:
                 if game_data[key] is not None:
                      try:
                           if key in ["weight", "rating", "average_rating"]: game_data[key] = float(game_data[key])
                           else: game_data[key] = int(game_data[key])
                      except (ValueError, TypeError): game_data[key] = None

            processed_games.append(game_data)

        if skipped_count > 0: print(f"  {skipped_count} items overgeslagen.")
        print(f"  Totaal {len(processed_games)} spellen verwerkt.")

    # --- Stap 4: Opslaan als JSON ---
    print(f"Stap 4: Opslaan van data naar {OUTPUT_FILE}")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    try:
        output_data = {"games": processed_games}
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"  BGG-data succesvol opgeslagen.")
    except IOError as e:
        print(f"  Fout bij schrijven naar {OUTPUT_FILE}: {e}")
        sys.exit(1)

    print(f"--- BGG Collectie Fetch Voltooid ---")

if __name__ == "__main__":
    main()
