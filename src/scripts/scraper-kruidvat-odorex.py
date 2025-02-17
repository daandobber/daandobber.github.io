import requests
from bs4 import BeautifulSoup
from datetime import datetime

url = "https://www.kruidvat.nl/odorex-0-perfume-deodorant-roller/p/4350718"
output_file = "src/pages/scrapers.md"  # Zorg dat dit in Astro’s content-map staat

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

    # Check offer
    offer_element = soup.find(class_="promotion-labels")
    offer = "Er is een actie" if offer_element else "Er is geen actie"

    # Check price
    price_decimal = soup.find("div", class_="pricebadge__new-price-decimal")
    price_fractional = soup.find("div", class_="pricebadge__new-price-fractional")

    if price_decimal and price_fractional:
        price = f"{price_decimal.text.strip()}.{price_fractional.text.strip()}"
    else:
        price = "Onbekend"

    return offer, price

def save_to_markdown(offer, price):
    now = datetime.now().strftime("%Y-%m-%d")
    md_content = f"""---
title: "Laatste prijsupdate"
date: "{now}"
price: "{price}"
offer: "{offer}"
---

De prijs van het product is momenteel **€{price}**.

_Status:_ {offer} 🎉
"""
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(md_content)

if __name__ == "__main__":
    offer, price = check_offer_and_price()
    if offer and price:
        save_to_markdown(offer, price)
        print("[INFO] Markdown geüpdatet!")
