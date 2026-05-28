import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
import re
import os
import sys
import time
from datetime import datetime

# Set stdout and stderr to UTF-8 to prevent encoding crashes on Windows
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Local Ollama endpoint fallback
OLLAMA_URL = "http://localhost:11434/api/generate"

def load_env():
    """
    Parses Next.js .env.local file in parent directory to load credentials.
    """
    env_vars = {}
    paths = [
        os.path.join(os.getcwd(), '.env.local'),
        os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
    ]
    for env_path in paths:
        if os.path.exists(env_path):
            try:
                with open(env_path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith('#') and '=' in line:
                            k, v = line.split('=', 1)
                            env_vars[k.strip()] = v.strip()
                break
            except Exception as e:
                print(f"Error loading env from {env_path}: {e}")
    return env_vars

def clean_html(raw_html):
    """
    Removes HTML tags and returns clean text block for AI parsing.
    """
    clean_r = re.compile('<.*?>')
    text = re.sub(clean_r, '', raw_html)
    # Remove excessive spaces and linebreaks
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def query_gemini_to_parse(raw_text, api_key, category_hint=None):
    """
    Queries Gemini Flash to parse and structure raw job text into JSON.
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    category_note = ""
    if category_hint:
        category_note = f"\nNote: The source content comes from the '{category_hint}' category feed. If 'Latest Jobs', classify 'category' as one of 'Central Govt Jobs', 'State-wise Jobs', or 'District-wise Jobs'. If 'Admit Cards', classify as 'Admit Cards'. If 'Results', classify as 'Results'."

    prompt = f"""
    You are an expert government exams portal content writer, SEO specialist, and editor.
    Convert the following raw government exam / job alert text into a highly structured JSON object.
    Ensure the overview is written in a professional, engaging, yet natural human-like tone.
    Generate a detailed markdown content block in the 'content' field.
    
    RULES FOR CONTENT GENERATION BASED ON CATEGORY:
    1. If the category is 'Central Govt Jobs', 'State-wise Jobs', or 'District-wise Jobs', include an Application Fee table, exam schedules/timelines table, post qualifications, age limits, and step-by-step how to apply instructions.
    2. If the category is 'Admit Cards' or 'Results', DO NOT include any Application Fee details, Age Limit details, or How to Apply sections/headings in the markdown. Focus exclusively on exam day guidelines, timelines/schedules, verification documents, and cut-off or download updates.

    {category_note}

    CRITICAL RULES FOR STATE & DISTRICT EXTRACTION:
    1. Carefully look at the title, department, and description to see if this is related to a specific Indian state (e.g. West Bengal, Bihar, Uttar Pradesh, Rajasthan, Maharashtra, etc.) or a specific district/block/municipality.
    2. If it is a state-level recruitment, set "state" to the full official name of the State (e.g. "West Bengal", "Bihar") and "category" to "State-wise Jobs".
    3. If it is a district-level or block/municipality-level recruitment (e.g. Patna District, Kolkata Municipal Corporation, Chinhat Block, Danapur Block), set "state" to the state name, "district" to the district name (e.g. "Patna", "Kolkata", "Lucknow"), and if applicable, set "block" (e.g. "Danapur", "Chinhat") or "municipality" (e.g. "Kolkata MC"). Also set "category" to "District-wise Jobs".
    4. For central/national level jobs (e.g., UPSC Civil Services, SSC CGL, RRB, IBPS), set "state", "district", "block", and "municipality" to null, and set "category" to "Central Govt Jobs".
    
    Raw Job Text:
    ---
    {raw_text}
    ---
    
    Output must be a valid raw JSON object ONLY, with no markdown formatting or extra text. Use the following keys:
    {{
      "title": "Standardized concise title (e.g. UPSC CSE 2026, SSC CGL 2026 Admit Card, or BPSC 69th Result). Ensure this title is clean, uniform, and does not contain clickbait phrases like 'Direct Link' or 'Out Now' so that we can deduplicate identical postings.",
      "department": "Name of recruitment body (e.g. Union Public Service Commission, West Bengal Municipal Service Commission)",
      "category": "Must be exactly one of: 'Central Govt Jobs', 'State-wise Jobs', 'District-wise Jobs', 'Admit Cards', 'Results'",
      "state": "State name if applicable (or null)",
      "district": "District name if applicable (or null)",
      "block": "Block subdivision if applicable (or null)",
      "municipality": "Municipality name if applicable (or null)",
      "overview": "Professional human-written summary explaining the job role / admit card release / result announcement",
      "eligibility": "Clear details about qualification or download eligibility (can be string or array of criteria objects)",
      "age_limit": "Minimum and maximum age limits if applicable (e.g., 18 to 30 years or null)",
      "salary": "Detailed pay scale or monthly salary range if applicable (or null)",
      "start_date": "YYYY-MM-DD format (or null)",
      "end_date": "YYYY-MM-DD format (or null)",
      "exam_date": "YYYY-MM-DD format (or null)",
      "how_to_apply": "Step-by-step instructions for submitting application, downloading admit card, or checking result",
      "apply_link": "Direct URL to official government apply / download / check portal (ending in .gov.in, .nic.in, .edu.in, .org, or specific official board domain). NEVER use third-party domains (like jobrasta.com, freejobalert.com, indgovtjobs.in, karmasandhan.com) - if not found, set to null.",
      "official_pdf_link": "Direct URL to official PDF notification on government servers (or null). NEVER use third-party domains.",
      "content": "Rich markdown content including a table for fees details, a table for important schedules/dates, and vacancy lists."
    }}
    """
    
    headers = {
        "Content-Type": "application/json"
    }
    
    body = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            print(f"Sending raw job text to Gemini API (attempt {attempt + 1}/{max_retries})...")
            with urllib.request.urlopen(req, timeout=30) as response:
                res = json.loads(response.read().decode("utf-8"))
                raw_response = res['candidates'][0]['content']['parts'][0]['text'].strip()
                
                if "```json" in raw_response:
                    raw_response = raw_response.split("```json")[1].split("```")[0].strip()
                elif "```" in raw_response:
                    raw_response = raw_response.split("```")[1].split("```")[0].strip()
                    
                return json.loads(raw_response)
        except urllib.error.HTTPError as e:
            try:
                err_body = e.read().decode("utf-8")
                print(f"HTTP Error {e.code}: {e.reason}\nResponse Body: {err_body}")
            except Exception as read_err:
                print(f"HTTP Error {e.code}: {e.reason} (Failed to read body: {read_err})")
            if e.code == 429:
                # If it's a daily/minute quota limit exhaustion, fail immediately to allow fast fallback
                if 'err_body' in locals() and any(word in err_body.lower() for word in ['quota', 'limit', 'exhausted']):
                    print("Gemini free tier quota exhausted. Skipping retries to trigger fallback...")
                    return None
                wait_time = 30 * (attempt + 1)  # 30s, 60s, 90s
                print(f"Waiting {wait_time}s before retry...")
                time.sleep(wait_time)
                # Rebuild the request object (it gets consumed after first use)
                req = urllib.request.Request(
                    url,
                    data=json.dumps(body).encode("utf-8"),
                    headers=headers,
                    method="POST"
                )
                continue
            else:
                return None
        except Exception as e:
            print(f"Gemini parsing failed: {e}")
            return None
    print(f"All {max_retries} retries exhausted for Gemini API.")
    return None

def query_groq_to_parse(raw_text, api_key, category_hint=None):
    """
    Queries Groq Llama-3-70b model to parse raw text (free fallback with high limits).
    """
    url = "https://api.groq.com/openai/v1/chat/completions"
    
    category_note = ""
    if category_hint:
        category_note = f"\nNote: The source content comes from the '{category_hint}' category feed. If 'Latest Jobs', classify 'category' as one of 'Central Govt Jobs', 'State-wise Jobs', or 'District-wise Jobs'. If 'Admit Cards', classify as 'Admit Cards'. If 'Results', classify as 'Results'."

    prompt = f"""
    You are an expert government exams portal content writer, SEO specialist, and editor.
    Convert the following raw government exam / job alert text into a highly structured JSON object.
    Ensure the overview is written in a professional, engaging, yet natural human-like tone.
    Generate a detailed markdown content block in the 'content' field.
    
    RULES FOR CONTENT GENERATION BASED ON CATEGORY:
    1. If the category is 'Central Govt Jobs', 'State-wise Jobs', or 'District-wise Jobs', include an Application Fee table, exam schedules/timelines table, post qualifications, age limits, and step-by-step how to apply instructions.
    2. If the category is 'Admit Cards' or 'Results', DO NOT include any Application Fee details, Age Limit details, or How to Apply sections/headings in the markdown. Focus exclusively on exam day guidelines, timelines/schedules, verification documents, and cut-off or download updates.

    {category_note}

    CRITICAL RULES FOR STATE & DISTRICT EXTRACTION:
    1. Carefully look at the title, department, and description to see if this is related to a specific Indian state (e.g. West Bengal, Bihar, Uttar Pradesh, Rajasthan, Maharashtra, etc.) or a specific district/block/municipality.
    2. If it is a state-level recruitment, set "state" to the full official name of the State (e.g. "West Bengal", "Bihar") and "category" to "State-wise Jobs".
    3. If it is a district-level or block/municipality-level recruitment (e.g. Patna District, Kolkata Municipal Corporation, Chinhat Block, Danapur Block), set "state" to the state name, "district" to the district name (e.g. "Patna", "Kolkata", "Lucknow"), and if applicable, set "block" (e.g. "Danapur", "Chinhat") or "municipality" (e.g. "Kolkata MC"). Also set "category" to "District-wise Jobs".
    4. For central/national level jobs (e.g., UPSC Civil Services, SSC CGL, RRB, IBPS), set "state", "district", "block", and "municipality" to null, and set "category" to "Central Govt Jobs".
    
    Raw Job Text:
    ---
    {raw_text}
    ---
    
    Output must be a valid raw JSON object ONLY, with no markdown formatting or extra text. Use the following keys:
    {{
      "title": "Standardized concise title (e.g. UPSC CSE 2026, SSC CGL 2026 Admit Card, or BPSC 69th Result). Ensure this title is clean, uniform, and does not contain clickbait phrases like 'Direct Link' or 'Out Now' so that we can deduplicate identical postings.",
      "department": "Name of recruitment body (e.g. Union Public Service Commission, West Bengal Municipal Service Commission)",
      "category": "Must be exactly one of: 'Central Govt Jobs', 'State-wise Jobs', 'District-wise Jobs', 'Admit Cards', 'Results'",
      "state": "State name if applicable (or null)",
      "district": "District name if applicable (or null)",
      "block": "Block subdivision if applicable (or null)",
      "municipality": "Municipality name if applicable (or null)",
      "overview": "Professional human-written summary explaining the job role / admit card release / result announcement",
      "eligibility": "Clear details about qualification or download eligibility",
      "age_limit": "Minimum and maximum age limits if applicable (e.g., 18 to 30 years or null)",
      "salary": "Detailed pay scale or monthly salary range if applicable (or null)",
      "start_date": "YYYY-MM-DD format (or null)",
      "end_date": "YYYY-MM-DD format (or null)",
      "exam_date": "YYYY-MM-DD format (or null)",
      "how_to_apply": "Step-by-step instructions for submitting application, downloading admit card, or checking result",
      "apply_link": "Direct URL to official government apply / download / check portal (ending in .gov.in, .nic.in, .edu.in, .org, or specific official board domain). NEVER use third-party domains (like jobrasta.com, freejobalert.com, indgovtjobs.in, karmasandhan.com) - if not found, set to null.",
      "official_pdf_link": "Direct URL to official PDF notification on government servers (or null). NEVER use third-party domains.",
      "content": "Rich markdown content including a table for fees details, a table for important schedules/dates, and vacancy lists."
    }}
    """
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    body = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1,
        "response_format": {"type": "json_object"}
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    try:
        print("Querying Groq API (llama-3.3-70b-versatile)...")
        with urllib.request.urlopen(req, timeout=30) as response:
            res = json.loads(response.read().decode("utf-8"))
            content = res['choices'][0]['message']['content'].strip()
            return json.loads(content)
    except Exception as e:
        print(f"Groq parsing failed: {e}")
        return None

def query_deepseek_to_parse(raw_text, api_key, category_hint=None):
    """
    Queries DeepSeek-V3 model to parse raw text (OpenAI-compatible endpoint).
    """
    url = "https://api.deepseek.com/v1/chat/completions"
    
    category_note = ""
    if category_hint:
        category_note = f"\nNote: The source content comes from the '{category_hint}' category feed. If 'Latest Jobs', classify 'category' as one of 'Central Govt Jobs', 'State-wise Jobs', or 'District-wise Jobs'. If 'Admit Cards', classify as 'Admit Cards'. If 'Results', classify as 'Results'."

    prompt = f"""
    You are an expert government exams portal content writer, SEO specialist, and editor.
    Convert the following raw government exam / job alert text into a highly structured JSON object.
    Ensure the overview is written in a professional, engaging, yet natural human-like tone.
    Generate a detailed markdown content block in the 'content' field.
    
    RULES FOR CONTENT GENERATION BASED ON CATEGORY:
    1. If the category is 'Central Govt Jobs', 'State-wise Jobs', or 'District-wise Jobs', include an Application Fee table, exam schedules/timelines table, post qualifications, age limits, and step-by-step how to apply instructions.
    2. If the category is 'Admit Cards' or 'Results', DO NOT include any Application Fee details, Age Limit details, or How to Apply sections/headings in the markdown. Focus exclusively on exam day guidelines, timelines/schedules, verification documents, and cut-off or download updates.

    {category_note}

    CRITICAL RULES FOR STATE & DISTRICT EXTRACTION:
    1. Carefully look at the title, department, and description to see if this is related to a specific Indian state (e.g. West Bengal, Bihar, Uttar Pradesh, Rajasthan, Maharashtra, etc.) or a specific district/block/municipality.
    2. If it is a state-level recruitment, set "state" to the full official name of the State (e.g. "West Bengal", "Bihar") and "category" to "State-wise Jobs".
    3. If it is a district-level or block/municipality-level recruitment (e.g. Patna District, Kolkata Municipal Corporation, Chinhat Block, Danapur Block), set "state" to the state name, "district" to the district name (e.g. "Patna", "Kolkata", "Lucknow"), and if applicable, set "block" (e.g. "Danapur", "Chinhat") or "municipality" (e.g. "Kolkata MC"). Also set "category" to "District-wise Jobs".
    4. For central/national level jobs (e.g., UPSC Civil Services, SSC CGL, RRB, IBPS), set "state", "district", "block", and "municipality" to null, and set "category" to "Central Govt Jobs".
    
    Raw Job Text:
    ---
    {raw_text}
    ---
    
    Output must be a valid raw JSON object ONLY, with no markdown formatting or extra text. Use the following keys:
    {{
      "title": "Standardized concise title (e.g. UPSC CSE 2026, SSC CGL 2026 Admit Card, or BPSC 69th Result). Ensure this title is clean, uniform, and does not contain clickbait phrases like 'Direct Link' or 'Out Now' so that we can deduplicate identical postings.",
      "department": "Name of recruitment body (e.g. Union Public Service Commission, West Bengal Municipal Service Commission)",
      "category": "Must be exactly one of: 'Central Govt Jobs', 'State-wise Jobs', 'District-wise Jobs', 'Admit Cards', 'Results'",
      "state": "State name if applicable (or null)",
      "district": "District name if applicable (or null)",
      "block": "Block subdivision if applicable (or null)",
      "municipality": "Municipality name if applicable (or null)",
      "overview": "Professional human-written summary explaining the job role / admit card release / result announcement",
      "eligibility": "Clear details about qualification or download eligibility",
      "age_limit": "Minimum and maximum age limits if applicable (e.g., 18 to 30 years or null)",
      "salary": "Detailed pay scale or monthly salary range if applicable (or null)",
      "start_date": "YYYY-MM-DD format (or null)",
      "end_date": "YYYY-MM-DD format (or null)",
      "exam_date": "YYYY-MM-DD format (or null)",
      "how_to_apply": "Step-by-step instructions for submitting application, downloading admit card, or checking result",
      "apply_link": "Direct URL to official government apply / download / check portal (ending in .gov.in, .nic.in, .edu.in, .org, or specific official board domain). NEVER use third-party domains (like jobrasta.com, freejobalert.com, indgovtjobs.in, karmasandhan.com) - if not found, set to null.",
      "official_pdf_link": "Direct URL to official PDF notification on government servers (or null). NEVER use third-party domains.",
      "content": "Rich markdown content including a table for fees details, a table for important schedules/dates, and vacancy lists."
    }}
    """
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    body = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1,
        "response_format": {"type": "json_object"}
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    
    try:
        print("Querying DeepSeek API (deepseek-chat)...")
        with urllib.request.urlopen(req, timeout=30) as response:
            res = json.loads(response.read().decode("utf-8"))
            content = res['choices'][0]['message']['content'].strip()
            return json.loads(content)
    except Exception as e:
        print(f"DeepSeek parsing failed: {e}")
        return None

def query_ollama_to_parse(raw_text, category_hint=None):
    """
    Queries local Llama3 to parse raw text (offline fallback).
    """
    prompt = f"""
    Convert the following raw government job/exam notification text into a structured JSON object.
    Output must be valid raw JSON only. Use keys: title, department, category, state, district, block, municipality, overview, eligibility, age_limit, salary, start_date, end_date, exam_date, how_to_apply, apply_link, official_pdf_link, content.
    Category hint: {category_hint}
    
    Raw Job Text:
    {raw_text}
    """
    data = {
        "model": "llama3:8b",
        "prompt": prompt,
        "stream": False
    }
    req = urllib.request.Request(
        OLLAMA_URL,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        print("Sending to local Llama3 via Ollama...")
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode("utf-8"))
            raw_res = res.get("response", "").strip()
            if "```json" in raw_res:
                raw_res = raw_res.split("```json")[1].split("```")[0].strip()
            return json.loads(raw_res)
    except Exception as e:
        print(f"Ollama fallback parsing failed: {e}")
        return None

def make_slug(title):
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug)
    return slug.strip('-')

def MathRandomId():
    import random
    import string
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))

def check_exists_in_supabase(title, supabase_url, service_key):
    """
    Checks if a job with a similar title/slug already exists in Supabase.
    Returns True if exists (should skip), False if new.
    """
    slug = make_slug(title)
    # Search by slug prefix (first 30 chars) to catch similar titles
    search_slug = slug[:40]
    query_url = f"{supabase_url}/rest/v1/jobs?slug=ilike.{search_slug}%25&select=slug&limit=1"
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}"
    }
    req = urllib.request.Request(query_url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            if data and len(data) > 0:
                print(f"  → Already exists in DB (slug: {data[0]['slug']}). Skipping.")
                return True
    except Exception as e:
        print(f"  → Supabase check failed: {e}. Will process anyway.")
    return False

def upsert_to_supabase(parsed_job, supabase_url, service_key):
    """
    Upserts the parsed job to Supabase database.
    """
    title = parsed_job.get("title", "")
    slug = make_slug(title)
    
    # Structure job details
    job_data = {
        "id": parsed_job.get("id", MathRandomId()),
        "title": title,
        "department": parsed_job.get("department", ""),
        "category": parsed_job.get("category", "Central Govt Jobs"),
        "state": parsed_job.get("state"),
        "district": parsed_job.get("district"),
        "block": parsed_job.get("block"),
        "municipality": parsed_job.get("municipality"),
        "overview": parsed_job.get("overview", ""),
        "eligibility": json.dumps(parsed_job.get("eligibility")) if isinstance(parsed_job.get("eligibility"), (list, dict)) else parsed_job.get("eligibility"),
        "age_limit": parsed_job.get("age_limit"),
        "salary": parsed_job.get("salary"),
        "important_dates": {
            "start_date": parsed_job.get("start_date"),
            "end_date": parsed_job.get("end_date"),
            "exam_date": parsed_job.get("exam_date")
        },
        "how_to_apply": parsed_job.get("how_to_apply"),
        "apply_link": parsed_job.get("apply_link"),
        "official_pdf_link": parsed_job.get("official_pdf_link"),
        "slug": slug,
        "meta_title": (
            f"{title} Admit Card: Download Link, Exam Schedule" if parsed_job.get("category") == "Admit Cards"
            else f"{title} Result: Cut-Off Marks, Selection Merit List" if parsed_job.get("category") == "Results"
            else f"{title} Notification: Apply Online, Dates, Eligibility"
        ),
        "meta_description": parsed_job.get("overview", "")[:155],
        "content": parsed_job.get("content"),
        "updated_at": datetime.utcnow().isoformat() + "Z"
    }

    url = f"{supabase_url}/rest/v1/jobs?on_conflict=slug"
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"  # Acts as UPSERT on postgrest
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(job_data).encode("utf-8"),
        headers=headers,
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as response:
            print(f"Successfully uploaded job to Supabase: {title} (/jobs/{slug})")
            return True
    except Exception as e:
        print(f"Supabase write failed: {e}")
        return False

def clean_official_link(url):
    """
    Strips third-party blog links (like JobRasta, FreeJobAlert) to prevent leakage
    and only returns official government portal links.
    """
    if not url:
        return None
    url_str = str(url).strip()
    bad_domains = ["jobrasta.com", "freejobalert.com", "karmasandhan.com", "indgovtjobs.in"]
    for domain in bad_domains:
        if domain in url_str.lower():
            return None
    return url_str

def scrape_job_feed():
    """
    Fetches the Job RSS feeds, cleans contents, and writes structured posts to Supabase.
    """
    # Try .env.local first (local dev), then fall back to os.environ (GitHub Actions)
    env = load_env()
    supabase_url = env.get("SUPABASE_URL") or env.get("NEXT_PUBLIC_SUPABASE_URL") or os.environ.get("SUPABASE_URL")
    service_key = env.get("SUPABASE_SERVICE_ROLE_KEY") or env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    gemini_key = env.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    groq_key = env.get("GROQ_API_KEY") or os.environ.get("GROQ_API_KEY")
    deepseek_key = env.get("DEEPSEEK_API_KEY") or os.environ.get("DEEPSEEK_API_KEY")

    print(f"Supabase URL configured: {'Yes' if supabase_url else 'NO!'}")
    print(f"Service Key configured: {'Yes' if service_key else 'NO!'}")
    print(f"Gemini API Key configured: {'Yes' if gemini_key else 'NO!'}")
    print(f"Groq API Key configured: {'Yes' if groq_key else 'NO!'}")
    print(f"DeepSeek API Key configured: {'Yes' if deepseek_key else 'NO!'}")

    if not supabase_url or not service_key:
        print("Error: Supabase URL and Service key not configured.")
        print("Checked .env.local file AND os.environ - neither has the credentials.")
        return

    # Define feeds to scrape from multiple popular websites
    feeds = [
        # 1. JobRasta Latest Jobs
        {
            "url": "https://jobrasta.com/category/latest-jobs/feed/",
            "source_name": "JobRasta Jobs",
            "hint": "Latest Jobs",
            "default_cat": "Central Govt Jobs",
            "limit": 8
        },
        # 2. JobRasta Admit Cards
        {
            "url": "https://jobrasta.com/category/admit-card/feed/",
            "source_name": "JobRasta Admit Cards",
            "hint": "Admit Cards",
            "default_cat": "Admit Cards",
            "limit": 5
        },
        # 3. JobRasta Results
        {
            "url": "https://jobrasta.com/category/results/feed/",
            "source_name": "JobRasta Results",
            "hint": "Results",
            "default_cat": "Results",
            "limit": 5
        },
        # 4. IndGovtJobs (Highly reliable all-India/state jobs portal)
        {
            "url": "https://www.indgovtjobs.in/feeds/posts/default?alt=rss",
            "source_name": "IndGovtJobs",
            "hint": "Latest Jobs",
            "default_cat": "Central Govt Jobs",
            "limit": 8
        },
        # 5. Karmasandhan (state/district focused portal)
        {
            "url": "https://www.karmasandhan.com/feed/",
            "source_name": "Karmasandhan",
            "hint": "Latest Jobs",
            "default_cat": "Central Govt Jobs",
            "limit": 5
        },
        # 6. FreeJobAlert
        {
            "url": "https://www.freejobalert.com/feed/",
            "source_name": "FreeJobAlert",
            "hint": "Latest Jobs",
            "default_cat": "Central Govt Jobs",
            "limit": 5
        }
    ]

    for feed_info in feeds:
        feed_url = feed_info["url"]
        source_name = feed_info["source_name"]
        category_hint = feed_info["hint"]
        default_cat = feed_info["default_cat"]
        item_limit = feed_info["limit"]

        print(f"\n==========================================")
        print(f"Fetching from RSS Feed ({source_name}): {feed_url}...")
        
        try:
            req = urllib.request.Request(
                feed_url,
                headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                xml_data = response.read()
        except Exception as e:
            print(f"Failed to fetch RSS feed {source_name}: {e}")
            continue

        try:
            root = ET.fromstring(xml_data)
            # Support both RSS standard item lists and Atom feed entry lists
            items = root.findall('.//item')
            if not items:
                # Atom format fallback (used by Blogger sites like IndGovtJobs)
                items = root.findall('.//{http://www.w3.org/2005/Atom}entry')
                is_atom = True
            else:
                is_atom = False

            print(f"Found {len(items)} items in feed. Parsing top {item_limit} items...")
            
            for item in items[:item_limit]:
                # Extract fields based on XML format
                if is_atom:
                    title_elem = item.find('{http://www.w3.org/2005/Atom}title')
                    title = title_elem.text if title_elem is not None else ""
                    
                    link_elem = item.find('{http://www.w3.org/2005/Atom}link[@rel="alternate"]')
                    if link_elem is None:
                        link_elem = item.find('{http://www.w3.org/2005/Atom}link')
                    link = link_elem.attrib.get('href', '') if link_elem is not None else ""
                    
                    content_elem = item.find('{http://www.w3.org/2005/Atom}content')
                    if content_elem is None:
                        content_elem = item.find('{http://www.w3.org/2005/Atom}summary')
                    description = content_elem.text if content_elem is not None else ""
                else:
                    title_elem = item.find('title')
                    title = title_elem.text if title_elem is not None else ""
                    
                    link_elem = item.find('link')
                    link = link_elem.text if link_elem is not None else ""
                    
                    desc_elem = item.find('description')
                    description = desc_elem.text if desc_elem is not None else ""
                
                if not title:
                    continue

                raw_text = f"Title: {title}\nDescription: {description}\nSource Link: {link}"
                clean_text = clean_html(raw_text)

                print(f"\nProcessing item: {title}")
                
                # Skip if already in database (saves Gemini API quota!)
                if check_exists_in_supabase(title, supabase_url, service_key):
                    continue
                
                parsed_job = None
                if gemini_key:
                    parsed_job = query_gemini_to_parse(clean_text, gemini_key, category_hint)
                    # Longer delay to avoid hitting free API rate limits (15 RPM)
                    print("Sleeping 12 seconds to respect Gemini API rate limits...")
                    time.sleep(12)
                
                # Fallback to DeepSeek if Gemini failed or is not available
                if not parsed_job and deepseek_key:
                    print("Gemini failed/unavailable. Falling back to DeepSeek...")
                    time.sleep(2)
                    parsed_job = query_deepseek_to_parse(clean_text, deepseek_key, category_hint)
                
                # Fallback to Groq if both failed or are not available
                if not parsed_job and groq_key:
                    print("Gemini/DeepSeek failed/unavailable. Falling back to Groq Llama-3...")
                    # Sleep 4 seconds to respect Groq requests-per-minute (RPM) limits
                    time.sleep(4)
                    parsed_job = query_groq_to_parse(clean_text, groq_key, category_hint)
                
                # Offline fallback to local Ollama
                if not parsed_job and not gemini_key and not deepseek_key and not groq_key:
                    parsed_job = query_ollama_to_parse(clean_text, category_hint)

                if parsed_job:
                    # Validate categories
                    valid_categories = ['Central Govt Jobs', 'State-wise Jobs', 'District-wise Jobs', 'Admit Cards', 'Results']
                    if parsed_job.get("category") not in valid_categories:
                        if category_hint == "Latest Jobs":
                            # Default fallback based on parsed data state/district
                            if parsed_job.get("district"):
                                parsed_job["category"] = "District-wise Jobs"
                            elif parsed_job.get("state"):
                                parsed_job["category"] = "State-wise Jobs"
                            else:
                                parsed_job["category"] = "Central Govt Jobs"
                        else:
                            parsed_job["category"] = default_cat

                    # Clean links to filter out any third-party blogs
                    parsed_job["apply_link"] = clean_official_link(parsed_job.get("apply_link"))
                    parsed_job["official_pdf_link"] = clean_official_link(parsed_job.get("official_pdf_link"))

                    # Add default apply links only if the feed RSS source link is not a third-party domain
                    if not parsed_job.get("apply_link"):
                        cleaned_feed_link = clean_official_link(link)
                        if cleaned_feed_link:
                            parsed_job["apply_link"] = cleaned_feed_link

                    # Upload directly to Supabase
                    upsert_to_supabase(parsed_job, supabase_url, service_key)
                else:
                    print(f"Skipping notice parsing for: {title}")
                    
        except Exception as e:
            print(f"Error parsing RSS XML: {e}")

if __name__ == "__main__":
    scrape_job_feed()
