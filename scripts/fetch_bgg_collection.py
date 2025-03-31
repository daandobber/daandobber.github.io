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
# --- BELANGRIJK: Details ophalen is NU NODIG voor correcte expansie detectie ---
FETCH_DETAILS = True # MOET True zijn om expansies betrouwbaar te identificeren
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

    # --- Definitieve Aanpak: Simpele /collection call ---
    # Haal ALLE 'owned' items op, ongeacht subtype in deze call.
    collection_params = {
        "username": BGG_USERNAME,
        "own": "1"
    }
    print("Gebruik alleen 'username' en 'own=1' voor de initiële collectie-oproep.")
    # --------------------------------------------------

    collection_url = f"{API_BASE_URL}/collection"
    print(f"Stap 1: Ophalen lijst van owned items via {collection_url} met params {collection_params}")

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

    game_items = collection_root.findall('./item') # Pak alle items die 'owned' zijn
    print(f"  Collectie bevat {len(game_items)} owned items (basisspellen + expansies).")

    if not game_items:
         print("  Geen items met status 'owned'=1 gevonden. Controleer gebruikersnaam en BGG-instellingen.")
         processed_games = [] # Lege lijst
    else:
        # --- Stap 2: Detail ophalen (MOET AAN STAAN: FETCH_DETAILS = True) ---
        game_ids = [item.get('objectid') for item in game_items if item.get('objectid')]
        detailed_games_data = {}

        if not FETCH_DETAILS:
             print("!!! WAARSCHUWING: FETCH_DETAILS staat op False.")
             print("!!! Expansie detectie en gedetailleerde stats zullen ONBETROUWBAAR of LEEG zijn.")
             # Optioneel: hier stoppen of doorgaan met beperkte data
             # sys.exit(1) # Uncomment om te stoppen als details essentieel zijn

        if FETCH_DETAILS and game_ids:
            print(f"Stap 2: Ophalen details voor {len(game_ids)} spellen in batches van {BATCH_SIZE}...")
            # (Logica voor batch ophalen blijft hetzelfde als in de vorige versie)
            for i in range(0, len(game_ids), BATCH_SIZE):
                batch_ids = game_ids[i:i+BATCH_SIZE]
                ids_str = ",".join(batch_ids)
                details_url = f"{API_BASE_URL}/thing"
                details_params = {"id": ids_str, "stats": "1"} # Haal stats op bij /thing
                current_batch_num = i // BATCH_SIZE + 1
                total_batches = (len(game_ids) + BATCH_SIZE - 1) // BATCH_SIZE
                print(f"  Batch {current_batch_num}/{total_batches}: Ophalen details via {details_url} (met stats=1)...")
                try:
                    details_response = session.get(details_url, params=details_params, timeout=REQUEST_TIMEOUT)
                    if details_response.status_code != 200:
                         print(f"  WAARSCHUWING: Onverwachte status code {details_response.status_code} voor batch {ids_str}.")
                         continue
                    details_root = ET.fromstring(details_response.content)
                    for item_detail_xml in details_root.findall('./item'):
                         game_id_detail = item_detail_xml.get('id')
                         if game_id_detail: detailed_games_data[game_id_detail] = item_detail_xml
                except requests.exceptions.RequestException as e:
                    print(f"  WAARSCHUWING: Fout bij ophalen batch {ids_str}: {e}.")
                except ET.ParseError as e:
                    print(f"  WAARSCHUWING: Fout bij parsen details XML voor batch {ids_str}: {e}.")
                finally:
                     if current_batch_num < total_batches:
                         print(f"    Wachten voor {SLEEP_BETWEEN_BATCHES}s...")
                         time.sleep(SLEEP_BETWEEN_BATCHES)
            print("  Details ophalen voltooid.")


        # --- Stap 3: Verwerken en combineren ---
        print("Stap 3: Verwerken en combineren van data...")
        processed_games = []
        skipped_invalid_type_count = 0
        missing_details_count = 0

        for item in game_items: # Loop door items uit de /collection call
            game_id = item.get('objectid')
            if not game_id: continue

            detailed_item = detailed_games_data.get(game_id) # Zoek de bijbehorende detail data

            # --- Definitieve Expansie Detectie ---
            is_expansion = False # Standaard: geen expansie
            item_type = None
            if detailed_item is not None:
                 item_type = detailed_item.get('type')
                 if item_type == 'boardgameexpansion':
                     is_expansion = True
                 elif item_type != 'boardgame':
                      # Sla items over die geen boardgame of boardgameexpansion zijn volgens /thing
                      # print(f"  Skipping item {game_id} with type '{item_type}' found in /thing data.")
                      skipped_invalid_type_count += 1
                      continue
            elif FETCH_DETAILS:
                 # Details ZOUDEN er moeten zijn, maar ontbreken (bv. API error bij ophalen)
                 # We kunnen hier niet betrouwbaar bepalen of het een expansie is.
                 # Standaard blijft is_expansion = False. Log dit eventueel.
                 missing_details_count += 1
                 # print(f"  Waarschuwing: Ontbrekende detail data voor {game_id}. Kan expansie status niet betrouwbaar bepalen.")
            # -------------------------------------

            # Basis info uit /collection call (kan stats missen)
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
                "categories": [], "mechanics": [],
                "is_expansion": is_expansion, # Gebruik de waarde bepaald o.b.v. /thing data
                "best_with_players": None,
            }
            status_node = item.find('status')
            if status_node is not None:
                 game_data["status"] = { attr: status_node.get(attr) == '1' for attr in status_node.attrib if attr not in ['lastmodified'] }
                 game_data["status"]["lastmodified"] = status_node.get('lastmodified')

            # Haal rating uit /collection stats ALS die er zijn (waren niet opgevraagd in deze versie)
            stats_element_orig = item.find('stats')
            if stats_element_orig:
                rating_node_orig = stats_element_orig.find('rating')
                game_data['rating'] = float(rating_node_orig.get('value', 0.0)) if rating_node_orig is not None and rating_node_orig.get('value') != 'N/A' else None

            # Vul/overschrijf met /thing data
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
                     game_data['average_rating'] = float(get_value(stats_element_detail, 'average', 'value', default=0.0))
                     game_data['weight'] = float(get_value(stats_element_detail, 'averageweight', 'value', default=0.0))
                     # Persoonlijke rating zit niet in /thing, dus die halen we niet hieruit

            if not game_data["playingtime"] and game_data["minplaytime"] and game_data["maxplaytime"]:
                game_data["playingtime"] = game_data["maxplaytime"]

            # Opschonen data types
            for key in ["yearpublished", "minplayers", "maxplayers", "playingtime", "minplaytime", "maxplaytime", "minage", "weight", "rating", "average_rating"]:
                 if game_data[key] is not None:
                      try:
                           if key in ["weight", "rating", "average_rating"]: game_data[key] = float(game_data[key])
                           else: game_data[key] = int(game_data[key])
                      except (ValueError, TypeError): game_data[key] = None

            processed_games.append(game_data)

        if skipped_invalid_type_count > 0: print(f"  {skipped_invalid_type_count} items overgeslagen (geen boardgame/expansion type in /thing data).")
        if missing_details_count > 0: print(f"  {missing_details_count} items misten detail data (mogelijk foute expansie status).")
        print(f"  Totaal {len(processed_games)} spellen verwerkt en toegevoegd aan JSON.")


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
