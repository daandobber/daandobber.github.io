import requests
from bs4 import BeautifulSoup
from datetime import datetime
import json

url = "https://www.kruidvat.nl/odorex-0-perfume-deodorant-roller/p/4350718"
output_file = "src/data/kruidvat.json"  # JSON-bestand opslaan

def check_offer_and_price():
    try:
        response = requests.get(
            url, 
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
            timeout=10
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] HTTP-fout: {e}")
        return None, None

    soup = BeautifulSoup(response.text, 'html.parser')

    # Check offer (promotie zoeken in "promotion-list")
    promotion_box = soup.find("div", class_="promotion-list")
    if promotion_box:
        offer_title = promotion_box.find("h3", class_="promotion-box__title")
        offer_text = promotion_box.find("h5", class_="promotion-box__information-text")
        if offer_title and offer_text:
            offer = f"{offer_title.text.strip()} - {offer_text.text.strip()}"
        else:
            offer = "Geen actie"
    else:
        offer = "Geen actie"

    # Check price
    price_decimal = soup.find("div", class_="pricebadge__new-price-decimal")
    price_fractional = soup.find("div", class_="pricebadge__new-price-fractional")

    if price_decimal and price_fractional:
        price = f"{price_decimal.text.strip()}.{price_fractional.text.strip()}"
    else:
        price = "Onbekend"

    return offer, price

def save_to_json(offer, price):
    today = datetime.today().strftime("%Y-%m-%d")  # Huidige datum
    data = {
        "title": "Laatste prijsupdate",
        "articleDate": today,
        "description": "De laatste prijsupdate van Kruidvat Odorex",
        "price": price,
        "offer": offer
    }

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    offer, price = check_offer_and_price()
    if offer and price:
        save_to_json(offer, price)
        print("[INFO] JSON geüpdatet!")
