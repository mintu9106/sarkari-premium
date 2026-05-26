import sys, os
sys.path.insert(0, 'scraper')
from scraper import load_env, check_exists_in_supabase, query_gemini_to_parse, upsert_to_supabase, clean_html, make_slug
import urllib.request
import xml.etree.ElementTree as ET
import time

env = load_env()
supabase_url = env.get('SUPABASE_URL') or os.environ.get('SUPABASE_URL')
service_key = env.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
gemini_key = env.get('GEMINI_API_KEY') or os.environ.get('GEMINI_API_KEY')

print(f"Supabase: {'YES' if supabase_url else 'NO'}")
print(f"Service Key: {'YES' if service_key else 'NO'}")
print(f"Gemini Key: {'YES' if gemini_key else 'NO'}")

# Fetch one feed
print("\n--- Fetching Karmasandhan feed ---")
req = urllib.request.Request('https://www.karmasandhan.com/feed/', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=15) as resp:
    xml_data = resp.read()
root = ET.fromstring(xml_data)
items = root.findall('.//item')
print(f"Found {len(items)} items")

new_count = 0
uploaded = 0
for item in items[:5]:
    title = item.find('title').text
    link = item.find('link').text or ""
    desc = item.find('description').text or ""
    
    print(f"\n> {title}")
    exists = check_exists_in_supabase(title, supabase_url, service_key)
    if exists:
        continue
    
    new_count += 1
    raw_text = f"Title: {title}\nDescription: {desc}\nSource Link: {link}"
    clean_text = clean_html(raw_text)
    
    parsed = query_gemini_to_parse(clean_text, gemini_key, "Latest Jobs")
    if parsed:
        if not parsed.get("apply_link"):
            parsed["apply_link"] = link
        upsert_to_supabase(parsed, supabase_url, service_key)
        uploaded += 1
    
    print("Waiting 12s...")
    time.sleep(12)

print(f"\n=== DONE: {new_count} new items found, {uploaded} uploaded ===")
