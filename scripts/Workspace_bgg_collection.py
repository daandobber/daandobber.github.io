# fetch_bgg_collection.py
import os
import requests
import xml.etree.ElementTree as ET
import json
import time
import sys # Voor sys.exit bij kritieke fouten
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry # Correcte import pad

# --- Configuratie ---
# Haal je BGG gebruikersnaam uit environment variables (belangrijk voor GitHub Actions/Secrets)
BGG_USERNAME = os.environ.get("BGG_USERNAME")
OUTPUT_DIR = os.path.join("src", "data") # Zorg dat dit pad klopt met je Astro structuur
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "bgg_collection.json")
API_BASE_URL = "https://boardgamegeek.com/xmlapi2"
FETCH_DETAILS = True # Zet op True om details (gewicht, categorieën, etc.) op te halen
FETCH_EXPANSIONS = True # Zet op True om ook uitbreidingen op te halen (worden gemarkeerd)
REQUEST_TIMEOUT = 60 # Seconden timeout voor API requests
RETRY_ATTEMPTS = 5 # Aantal pogingen bij API fouten
RETRY_BACKOFF = 1 # Factor voor exponentiële backoff (wachttijd = {backoff factor} * (2 ** ({number of total retries} - 1)))
BATCH_SIZE = 50 # Aantal game ID's per /thing request
SLEEP_BETWEEN_BATCHES = 5 # Seconden wachttijd tussen /thing batches (wees aardig voor BGG)

# --- Helper Functies ---
def requests_retry_session(
    retries=RETRY_ATTEMPTS,
    backoff_factor=RETRY_BACKOFF,
    status_forcelist=(500, 502, 503, 504, 429), # Retry op server errors en rate limiting
    session=None,
):
    """ Creëert een requests session met automatische retries. """
    session = session or requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
        allowed_methods=frozenset(['GET', 'POST']), # Sta retries toe voor GET
        raise_on_status=False # Belangrijk: Werp geen error direct, laat ons de status checken
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

def get_value(element, tag, attribute=None, default=None):
    """ Helper om veilig waardes uit XML elementen te halen. """
    if element is None:
        return default
    node = element.find(tag)
    if node is not None:
        if attribute:
            return node.get(attribute, default)
        elif node.text is not None: # Controleer expliciet op None ipv alleen truthiness
            return node.text.strip()
        # Soms is er een value attribuut ipv text (bv. numplayers)
        elif 'value' in node.attrib:
             return node.get('value', default)
    return default

def get_list_values(element, tag, attribute='value'):
    """ Helper om lijsten van waardes (zoals categorieën) te halen. """
    if element is None:
        return []
    # Let op: .// zoekt in alle sub-elementen
    return [item.get(attribute) for item in element.findall(f".//{tag}[@{attribute}]") if item.get(attribute)]

def get_best_with_players(poll):
    """ Haalt het 'Best with' aantal spelers uit de poll data. """
    if poll is None:
        return None
    best_votes = -1
    best_numplayers = None
    # Poll structuur: poll > results (per numplayers) > result (per vote category)
    for results in poll.findall("./results"):
        numplayers = results.get('numplayers')
        if not numplayers: continue

        is_plus = numplayers.endswith('+')
        # Verwijder '+' voor interne logica, voeg later eventueel weer toe
        numplayers_clean = numplayers[:-1] if is_plus else numplayers

        try:
           numplayers_int = int(numplayers_clean) # Zorg ervoor dat het een nummer is
           best_result = results.find("./result[@value='Best']")
           if best_result is not None:
               votes = int(best_result.get('numvotes', 0))
               # Neem het aantal spelers met de meeste 'Best' stemmen
               # Geef voorkeur aan lagere spelersaantallen bij gelijkspel
               if votes > best_votes:
                   best_votes = votes
                   best_numplayers = numplayers # Houd originele string (bv "3" of "6+")
               elif votes == best_votes and best_numplayers is not None:
                    current_best_is_plus = best_numplayers.endswith('+')
                    current_best_val = int(best_numplayers[:-1] if current_best_is_plus else best_numplayers)
                    if numplayers_int < current_best_val:
                         best_numplayers = numplayers

        except (ValueError, TypeError):
            print(f"  Waarschuwing: Kon 'numplayers' attribuut niet parsen: {numplayers}")
            continue # Sla ongeldige numplayers over

    # Geef alleen terug als er daadwerkelijk 'Best' stemmen zijn (>0)
    return best_numplayers if best_votes > 0 else None


# --- Hoofd Logica ---
def main():
    if not BGG_USERNAME:
        print("Fout: BGG_USERNAME omgevingsvariabele is niet ingesteld!")
        sys.exit(1) # Stop het script met een error code

    print(f"--- Start BGG Collectie Fetch voor gebruiker: {BGG_USERNAME} ---")

    collection_params = {
        "username": BGG_USERNAME,
        "own": "1", # Alleen spellen die je bezit
        "stats": "1" # Haal statistieken op (rating, weight, etc.)
    }
    if not FETCH_EXPANSIONS:
         # Alleen toevoegen als we GEEN expansies willen ophalen in de eerste call
         collection_params["excludesubtype"] = "boardgameexpansion"
         print("Expansies worden uitgesloten in de initiële collectie-oproep.")
    else:
         # Als we wel expansies willen, halen we zowel boardgame als expansion op
         collection_params["subtype"] = "boardgame,boardgameexpansion"
         print("Zowel basisspellen als expansies worden opgehaald.")


    collection_url = f"{API_BASE_URL}/collection"
    print(f"Stap 1: Ophalen collectie via {collection_url} met params {collection_params}")

    session = requests_retry_session()
    collection_root = None
    try:
        response = session.get(collection_url, params=collection_params, timeout=REQUEST_TIMEOUT)

        retry_count = 0
        # BGG stuurt 202 Accepted terug als de data nog gegenereerd wordt. Wacht dan.
        while response.status_code == 202 and retry_count < 10: # Verhoogd aantal pogingen voor 202
             wait_time = 5 + retry_count * 2 # Wacht steeds iets langer
             print(f"  BGG genereert collectie data, wachten ({wait_time}s)... (Poging {retry_count + 1})")
             time.sleep(wait_time)
             response = session.get(collection_url, params=collection_params, timeout=REQUEST_TIMEOUT)
             retry_count += 1

        if response.status_code != 200:
             print(f"  Fout: Onverwachte status code {response.status_code} na retries. Response:")
             print(f"  {response.text[:500]}...") # Log deel van response
             # Check voor specifieke BGG error messages
             try:
                 error_root = ET.fromstring(response.content)
                 error_message = error_root.findtext('.//message') or error_root.findtext('.//error/message')
                 if error_message:
                      print(f"  BGG Error Message: {error_message}")
             except ET.ParseError:
                  pass # Geen XML error message
             sys.exit(1) # Stop script bij falen

        collection_root = ET.fromstring(response.content)

    except requests.exceptions.RequestException as e:
        print(f"  Kritieke Fout bij ophalen BGG collectie: {e}")
        sys.exit(1)
    except ET.ParseError as e:
         print(f"  Kritieke Fout bij parsen BGG collectie XML: {e}\n  Response:\n{response.text[:500]}...")
         sys.exit(1)

    game_items = collection_root.findall('./item')
    print(f"  Collectie bevat {len(game_items)} items (basisspellen en/of expansies).")

    if not game_items:
         print("  Geen items gevonden in de collectie. Controleer gebruikersnaam en BGG-instellingen.")
         # Maak toch een leeg JSON bestand aan
         processed_games = []
    else:
        # --- Stap 2: Detail ophalen (indien FETCH_DETAILS == True) ---
        game_ids = [item.get('objectid') for item in game_items if item.get('objectid')]
        detailed_games_data = {}

        if FETCH_DETAILS and game_ids:
            print(f"Stap 2: Ophalen details voor {len(game_ids)} spellen in batches van {BATCH_SIZE}...")
            for i in range(0, len(game_ids), BATCH_SIZE):
                batch_ids = game_ids[i:i+BATCH_SIZE]
                ids_str = ",".join(batch_ids)
                details_url = f"{API_BASE_URL}/thing"
                details_params = {"id": ids_str, "stats": "1"}
                current_batch_num = i // BATCH_SIZE + 1
                total_batches = (len(game_ids) + BATCH_SIZE - 1) // BATCH_SIZE
                print(f"  Batch {current_batch_num}/{total_batches}: Ophalen details via {details_url}...")

                try:
                    details_response = session.get(details_url, params=details_params, timeout=REQUEST_TIMEOUT)
                    if details_response.status_code != 200:
                         print(f"  WAARSCHUWING: Onverwachte status code {details_response.status_code} voor batch {ids_str}. Response:")
                         print(f"  {details_response.text[:500]}...")
                         # Ga door, mogelijk is deel van de data wel OK in andere batches
                         continue

                    details_root = ET.fromstring(details_response.content)

                    for item in details_root.findall('./item'): # type check doen we later
                         game_id = item.get('id')
                         if game_id:
                              detailed_games_data[game_id] = item # Sla het hele 'item' element op

                except requests.exceptions.RequestException as e:
                    print(f"  WAARSCHUWING: Fout bij ophalen batch {ids_str}: {e}. Deze spellen missen mogelijk details.")
                    # Ga door met volgende batch
                except ET.ParseError as e:
                    print(f"  WAARSCHUWING: Fout bij parsen details XML voor batch {ids_str}: {e}. Response: {details_response.text[:500]}...")
                    # Ga door met volgende batch
                finally:
                     if current_batch_num < total_batches:
                         print(f"    Wachten voor {SLEEP_BETWEEN_BATCHES}s...")
                         time.sleep(SLEEP_BETWEEN_BATCHES) # Pauzeer tussen batches

            print("  Details ophalen voltooid.")
        elif not FETCH_DETAILS:
            print("Stap 2: Details ophalen overgeslagen (FETCH_DETAILS is False).")

        # --- Stap 3: Verwerken en combineren ---
        print("Stap 3: Verwerken en combineren van data...")
        processed_games = []
        skipped_count = 0
        for item in game_items:
            game_id = item.get('objectid')
            subtype = item.get('subtype') # Haal subtype uit collection item

            if not game_id:
                skipped_count += 1
                continue

            # Bepaal of dit item een expansie is
            # We vertrouwen primair op subtype uit /collection als we expansies ophalen.
            # Anders checken we type uit /thing data als die is opgehaald.
            is_expansion = (subtype == 'boardgameexpansion')

            detailed_item = detailed_games_data.get(game_id)

            # Als we details hebben opgehaald, kunnen we de 'type' checken als fallback/bevestiging
            # en alleen items van type 'boardgame' of 'boardgameexpansion' meenemen.
            if detailed_item is not None:
                 item_type = detailed_item.get('type')
                 if item_type not in ['boardgame', 'boardgameexpansion']:
                      # print(f"  Skipping item {game_id} with type '{item_type}' found in /thing data.")
                      skipped_count += 1
                      continue
                 # Update is_expansion gebaseerd op /thing data indien nodig
                 is_expansion = (item_type == 'boardgameexpansion')
            elif FETCH_DETAILS and not detailed_item:
                 # Als we details *wilden* ophalen maar ze niet hebben voor dit ID,
                 # kunnen we besluiten het item over te slaan of door te gaan met beperkte data.
                 # print(f"  Waarschuwing: Geen detail data gevonden voor {game_id}, doorgaan met basis info.")
                 pass # We gaan door met basis info uit /collection


            # Basis info uit /collection call
            game_data = {
                "id": game_id,
                "name": get_value(item, 'name', default="Unknown Name"),
                "yearpublished": get_value(item, 'yearpublished', default=None),
                "image": get_value(item, 'image', default=None),
                "thumbnail": get_value(item, 'thumbnail', default=None),
                "status": {}, # Komt uit <status> tag
                "numplays": int(get_value(item, 'numplays', default=0)),
                # Velden die uit <stats> of details komen:
                "minplayers": None,
                "maxplayers": None,
                "playingtime": None,
                "minplaytime": None,
                "maxplaytime": None,
                "minage": None,
                "weight": None, # Complexity/Average Weight
                "rating": None, # Jouw rating
                "average_rating": None, # BGG average rating
                "categories": [],
                "mechanics": [],
                "is_expansion": is_expansion,
                "best_with_players": None,
            }

            # Vul status velden
            status_node = item.find('status')
            if status_node is not None:
                 game_data["status"] = {
                     attr: status_node.get(attr) == '1'
                     for attr in status_node.attrib
                     if attr not in ['lastmodified'] # Sla lastmodified apart op
                 }
                 game_data["status"]["lastmodified"] = status_node.get('lastmodified')


            # Vul stats uit /collection data indien aanwezig
            stats_element = item.find('stats')
            if stats_element is not None:
                 # Rating info - let op: rating kan ontbreken in <stats> als niet gerate
                 rating_node = stats_element.find('rating')
                 game_data['rating'] = float(rating_node.get('value', 0.0)) if rating_node is not None and rating_node.get('value') != 'N/A' else None
                 game_data['average_rating'] = float(get_value(stats_element.find('rating/average'), 'value', default=0.0) or 0.0)
                 game_data['weight'] = float(get_value(stats_element.find('rating/averageweight'), 'value', default=0.0) or 0.0)
                 # Player & time info
                 game_data.update({
                     "minplayers": int(stats_element.get('minplayers', 0)),
                     "maxplayers": int(stats_element.get('maxplayers', 0)),
                     "playingtime": int(stats_element.get('playingtime', 0)),
                     "minplaytime": int(stats_element.get('minplaytime', 0)),
                     "maxplaytime": int(stats_element.get('maxplaytime', 0)),
                     "minage": int(get_value(stats_element.find('minage'), 'value', default=0)),
                 })

            # Haal extra details/overschrijvingen uit de /thing data als die beschikbaar is
            if detailed_item:
                # Overschrijf basisdata met de (vaak completere) /thing data
                game_data.update({
                     "name": get_value(detailed_item.find('./name[@type="primary"]'), 'value', default=game_data['name']),
                     "yearpublished": get_value(detailed_item, 'yearpublished', 'value', default=game_data['yearpublished']),
                     "image": get_value(detailed_item, 'image', default=game_data['image']),
                     "thumbnail": get_value(detailed_item, 'thumbnail', default=game_data['thumbnail']),
                     "minplayers": int(get_value(detailed_item, 'minplayers', 'value', default=game_data['minplayers'] or 0)),
                     "maxplayers": int(get_value(detailed_item, 'maxplayers', 'value', default=game_data['maxplayers'] or 0)),
                     "playingtime": int(get_value(detailed_item, 'playingtime', 'value', default=game_data['playingtime'] or 0)),
                     "minplaytime": int(get_value(detailed_item, 'minplaytime', 'value', default=game_data['minplaytime'] or 0)),
                     "maxplaytime": int(get_value(detailed_item, 'maxplaytime', 'value', default=game_data['maxplaytime'] or 0)),
                     "minage": int(get_value(detailed_item, 'minage', 'value', default=game_data['minage'] or 0)),
                })

                # Haal lijsten van links (categorieën, mechanics, etc.)
                game_data['categories'] = get_list_values(detailed_item, 'link[@type="boardgamecategory"]', 'value')
                game_data['mechanics'] = get_list_values(detailed_item, 'link[@type="boardgamemechanic"]', 'value')

                # Haal 'best with' data uit de poll
                poll = detailed_item.find('./poll[@name="suggested_numplayers"]')
                if poll:
                    game_data['best_with_players'] = get_best_with_players(poll)

                # Update stats als die uit /thing completer zijn (bv. weight, average rating)
                stats_element_detail = detailed_item.find('statistics/ratings')
                if stats_element_detail:
                     game_data['average_rating'] = float(get_value(stats_element_detail, 'average', 'value', default=game_data['average_rating'] or 0.0))
                     game_data['weight'] = float(get_value(stats_element_detail, 'averageweight', 'value', default=game_data['weight'] or 0.0))

            # Fallback als playingtime 0 is, maar min/max wel bestaan
            if not game_data["playingtime"] and game_data["minplaytime"] and game_data["maxplaytime"]:
                game_data["playingtime"] = game_data["maxplaytime"] # Of gemiddelde? (max is veiliger)


            # Converteer None naar null voor JSON en zorg dat nummers nummers zijn
            for key in ["yearpublished", "minplayers", "maxplayers", "playingtime", "minplaytime", "maxplaytime", "minage", "weight", "rating", "average_rating"]:
                 if game_data[key] is not None:
                      try:
                           if key in ["weight", "rating", "average_rating"]:
                                game_data[key] = float(game_data[key])
                           else:
                                game_data[key] = int(game_data[key])
                      except (ValueError, TypeError):
                           # print(f"  Waarschuwing: Kon waarde voor '{key}' ({game_data[key]}) niet converteren naar nummer voor game {game_id}.")
                           game_data[key] = None # Zet op null bij conversieprobleem

            processed_games.append(game_data)

        if skipped_count > 0:
             print(f"  {skipped_count} items overgeslagen (ontbrekend ID of onjuist type).")
        print(f"  Totaal {len(processed_games)} spellen verwerkt.")


    # --- Stap 4: Opslaan als JSON ---
    print(f"Stap 4: Opslaan van data naar {OUTPUT_FILE}")
    os.makedirs(OUTPUT_DIR, exist_ok=True) # Zorg dat de map bestaat
    try:
        output_data = {"games": processed_games} # Volg de structuur {"games": [...]}
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=2, ensure_ascii=False)
        print(f"  BGG-data succesvol opgeslagen.")
    except IOError as e:
        print(f"  Fout bij schrijven naar {OUTPUT_FILE}: {e}")
        sys.exit(1)

    print(f"--- BGG Collectie Fetch Voltooid ---")

if __name__ == "__main__":
    main()