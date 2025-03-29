import os
import json
from atproto import Client
from datetime import datetime

BLUESKY_HANDLE = os.environ.get("BLUESKY_HANDLE")
BLUESKY_APP_PASSWORD = os.environ.get("BLUESKY_APP_PASSWORD")
NUM_POSTS = 5  # Aantal gewenste originele posts
OUTPUT_FILE = "src/data/bluesky_posts.json"

def fetch_posts():
    if not BLUESKY_HANDLE or not BLUESKY_APP_PASSWORD:
        print("Error: BLUESKY_HANDLE and BLUESKY_APP_PASSWORD environment variables must be set.", file=sys.stderr) 
        return []

    posts_data = []
    try:
        client = Client()
        client.login(BLUESKY_HANDLE, BLUESKY_APP_PASSWORD)

        api_limit = NUM_POSTS * 2
        profile_feed = client.app.bsky.feed.get_author_feed({'actor': client.me.handle, 'limit': api_limit})

        for item in profile_feed.feed:
            if len(posts_data) >= NUM_POSTS:
                break

            if not item.post or not item.post.record:
                continue

            if hasattr(item.post.record, 'reply') and item.post.record.reply:
                continue

            post_info = {
                'uri': item.post.uri,
                'cid': item.post.cid,
                'author_handle': item.post.author.handle,
                'author_display_name': item.post.author.display_name,
                'author_avatar': item.post.author.avatar,
                'text': getattr(item.post.record, 'text', ''),
                'created_at': item.post.record.created_at,
                'likes': item.post.like_count or 0,
                'reposts': item.post.repost_count or 0,
                'replies': item.post.reply_count or 0,
                'embeds': None
            }

            if item.post.embed and hasattr(item.post.embed, 'images') and item.post.embed.images:
                 post_info['embeds'] = {
                      'type': 'images',
                      'images': [{'thumb': img.thumb, 'fullsize': img.fullsize, 'alt': img.alt} for img in item.post.embed.images]
                 }

            posts_data.append(post_info)

        return posts_data[:NUM_POSTS]

    except Exception as e:
        print(f"An error occurred during Bluesky fetch: {e}", file=sys.stderr) 
        return [] 
      
def save_posts_to_json(posts):
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    try:
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(posts if posts is not None else [], f, ensure_ascii=False, indent=4)
    except IOError as e:
         print(f"Error writing to file {OUTPUT_FILE}: {e}", file=sys.stderr)

import sys 

if __name__ == "__main__":
    fetched_posts = fetch_posts()
    save_posts_to_json(fetched_posts)
