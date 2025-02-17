import requests
from bs4 import BeautifulSoup
import time
import random

url = "https://www.kruidvat.nl/odorex-0-perfume-deodorant-roller/p/4350718"

def check_offer_and_price():
    print("[INFO] Ophalen van pagina...")
    
    try:
        response = requests.get(
            url, 
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
            timeout=10  # Timeout van 10 seconden
        )
        response.raise_for_status()  # Foutmelding geven bij slechte response
    except requests.exceptions.Timeout:
        print("[ERROR] Timeout! De site reageert niet snel genoeg.")
        return "Fout bij ophalen pagina", "Onbekende prijs"
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] HTTP-fout: {e}")
        return "Fout bij ophalen pagina", "Onbekende prijs"

    print("[INFO] Pagina succesvol opgehaald, starten met parsing...")
    soup = BeautifulSoup(response.text, 'html.parser')

    # Check offer
    offer_element = soup.find(class_="promotion-labels")
    offer = "Er is een actie" if offer_element else "Er is geen actie"
    print(f"[INFO] Actie status: {offer}")

    # Check price
    price_decimal_element = soup.find("div", class_="pricebadge__new-price-decimal")
    price_fractional_element = soup.find("div", class_="pricebadge__new-price-fractional")

    if price_decimal_element and price_fractional_element:
        price_decimal = price_decimal_element.text.strip()
        price_fractional = price_fractional_element.text.strip()
        price = f"{price_decimal}.{price_fractional}"
    else:
        print("[WARNING] Kon de prijs niet vinden. Controleer de HTML-structuur.")
        price = "Prijs niet gevonden"

    print(f"[INFO] Gevonden prijs: {price}")
    return offer, price

if __name__ == "__main__":
    try:
        start_time = time.time()
        current_offer, current_price = check_offer_and_price()
        
        print("\n[RESULTAAT]")
        print(current_offer)
        print(current_price)
        print(f"\n[INFO] Script voltooid in {round(time.time() - start_time, 2)} seconden.")

    except KeyboardInterrupt:
        print("\n[INFO] Script onderbroken door gebruiker. Afsluiten...")
