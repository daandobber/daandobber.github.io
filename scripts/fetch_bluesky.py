# scripts/fetch_bluesky.py
import os
import json
from atproto import Client
from datetime import datetime

# --- Configuratie ---
BLUESKY_HANDLE = os.environ.get("BLUESKY_HANDLE") # Haal handle uit environment variable
BLUESKY_APP_PASSWORD = os.environ.get("BLUESKY_APP_PASSWORD") # Haal app password uit environment variable
NUM_POSTS = 5  # Hoeveel posts wil je ophalen?
OUTPUT_FILE = "src/data/bluesky_posts.json" # Pad waar het JSON-bestand wordt opgeslagen
# --------------------

def fetch_posts():
    if not BLUESKY_HANDLE or not BLUESKY_APP_PASSWORD:
        print("Error: BLUESKY_HANDLE and BLUESKY_APP_PASSWORD environment variables must be set.")
        return None

    try:
        client = Client()
        print(f"Logging in as {BLUESKY_HANDLE}...")
        client.login(BLUESKY_HANDLE, BLUESKY_APP_PASSWORD)
        print("Login successful.")

        print(f"Fetching last {NUM_POSTS} posts for {BLUESKY_HANDLE}...")
        profile_feed = client.app.bsky.feed.get_author_feed({'actor': client.me.handle, 'limit': NUM_POSTS}) # 'client.me.handle' or specific handle
        print(f"Successfully fetched {len(profile_feed.feed)} posts.")

        posts_data = []
        for item in profile_feed.feed:
            # We willen alleen originele posts, geen reposts in deze lijst (optioneel)
            if item.post and item.post.record and hasattr(item.post.record, 'text'):
                 # Basis data extractie
                post_info = {
                    'uri': item.post.uri,
                    'cid': item.post.cid,
                    'author_handle': item.post.author.handle,
                    'author_display_name': item.post.author.display_name,
                    'author_avatar': item.post.author.avatar,
                    'text': item.post.record.text,
                    'created_at': item.post.record.created_at, # ISO 8601 formaat
                    'likes': item.post.like_count or 0,
                    'reposts': item.post.repost_count or 0,
                    'replies': item.post.reply_count or 0,
                    'embeds': None # Placeholder voor afbeeldingen etc.
                }

                # Check voor ingesloten afbeeldingen
                if item.post.embed and hasattr(item.post.embed, 'images') and item.post.embed.images:
                     post_info['embeds'] = {
                          'type': 'images',
                          'images': [{'thumb': img.thumb, 'fullsize': img.fullsize, 'alt': img.alt} for img in item.post.embed.images]
                     }
                # Hier kun je checken voor andere embed types (quotes, external links) indien nodig

                posts_data.append(post_info)


        return posts_data

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def save_posts_to_json(posts):
    if posts is None:
        print("No posts fetched, skipping save.")
        return

    # Zorg dat de output directory bestaat
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(posts, f, ensure_ascii=False, indent=4)
        print(f"Successfully saved {len(posts)} posts to {OUTPUT_FILE}")
    except IOError as e:
        print(f"Error writing to file {OUTPUT_FILE}: {e}")

if __name__ == "__main__":
    fetched_posts = fetch_posts()
    save_posts_to_json(fetched_posts)