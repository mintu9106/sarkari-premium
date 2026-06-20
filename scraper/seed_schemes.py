import json
import urllib.request
import urllib.error
import re
import os
import sys
import time
from datetime import datetime

# Set stdout and stderr to UTF-8 to prevent encoding crashes on Windows
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

# Predefined comprehensive list of 112 schemes (Central and State)
SCHEMES_LIST = [
    # Central Schemes (State is null)
    {"name": "Ayushman Bharat Yojana (PM-JAY)", "state": None},
    {"name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)", "state": None},
    {"name": "Pradhan Mantri Awas Yojana - Urban (PMAY-U)", "state": None},
    {"name": "Pradhan Mantri Awas Yojana - Gramin (PMAY-G)", "state": None},
    {"name": "Sukanya Samriddhi Yojana (SSY)", "state": None},
    {"name": "Pradhan Mantri Mudra Yojana (PMMY)", "state": None},
    {"name": "Atal Pension Yojana (APY)", "state": None},
    {"name": "Pradhan Mantri Jan Dhan Yojana (PMJDY)", "state": None},
    {"name": "PM Surya Ghar Muft Bijli Yojana", "state": None},
    {"name": "PM Vishwakarma Scheme", "state": None},
    {"name": "Pradhan Mantri Ujjwala Yojana (PMUY)", "state": None},
    {"name": "Pradhan Mantri Matru Vandana Yojana (PMMVY)", "state": None},
    {"name": "Pradhan Mantri Suraksha Bima Yojana (PMSBY)", "state": None},
    {"name": "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)", "state": None},
    {"name": "PM Kaushal Vikas Yojana (PMKVY)", "state": None},
    {"name": "Stand Up India Scheme", "state": None},
    {"name": "Start Up India Initiative", "state": None},
    {"name": "Jal Jeevan Mission (JJM)", "state": None},
    {"name": "PM Garib Kalyan Anna Yojana (PMGKAY)", "state": None},
    {"name": "PM SVANidhi", "state": None},
    {"name": "Soil Health Card Scheme", "state": None},
    {"name": "PM Krishi Sinchayee Yojana (PMKSY)", "state": None},
    {"name": "Deen Dayal Antyodaya Yojana (DAY-NRLM)", "state": None},
    {"name": "Deendayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)", "state": None},
    {"name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)", "state": None},
    {"name": "National Social Assistance Programme (NSAP)", "state": None},
    {"name": "PM Poshan Shakti Nirman (Mid-day Meal Scheme)", "state": None},
    {"name": "Beti Bachao Beti Padhao (BBBP)", "state": None},
    {"name": "Mahila Samman Savings Certificate (MSSC)", "state": None},
    {"name": "Sovereign Gold Bond (SGB) Scheme", "state": None},
    {"name": "Senior Citizens Savings Scheme (SCSS)", "state": None},
    {"name": "Public Provident Fund (PPF) Scheme", "state": None},
    {"name": "National Savings Certificate (NSC)", "state": None},
    {"name": "Kisan Vikas Patra (KVP)", "state": None},
    {"name": "PM Shram Yogi Maan-dhan (PM-SYM)", "state": None},
    {"name": "PM Kisan Maan-dhan Yojana (PM-KMY)", "state": None},
    {"name": "PM Laghu Vyapari Maan-dhan Yojana (PM-LVMY)", "state": None},
    {"name": "PM Employment Generation Programme (PMEGP)", "state": None},
    {"name": "PM Jan Vikas Karyakram (PMJVK)", "state": None},
    {"name": "PM DevINE", "state": None},
    {"name": "PM Gati Shakti National Master Plan", "state": None},
    {"name": "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)", "state": None},
    {"name": "National Apprenticeship Promotion Scheme (NAPS)", "state": None},
    {"name": "Rashtriya Vayoshri Yojana (RVY)", "state": None},
    {"name": "PM Daksh Yojana", "state": None},
    {"name": "Swachh Bharat Mission (SBM)", "state": None},
    {"name": "AMRUT Scheme", "state": None},
    {"name": "Smart Cities Mission", "state": None},
    {"name": "Sansad Adarsh Gram Yojana (SAGY)", "state": None},
    {"name": "SVAMITVA Scheme", "state": None},
    {"name": "Mission Indradhanush", "state": None},
    {"name": "Rashtriya Bal Swasthya Karyakram (RBSK)", "state": None},
    {"name": "PM National Dialysis Program", "state": None},
    {"name": "Ayushman Bharat Digital Mission (ABDM)", "state": None},
    {"name": "One Nation One Ration Card (ONORC) Scheme", "state": None},
    {"name": "PM-PRANAM Yojana", "state": None},
    {"name": "GOBARdhan Scheme", "state": None},
    {"name": "SATAT Initiative", "state": None},
    {"name": "FAME India Scheme (Phase II)", "state": None},
    {"name": "PM KUSUM Scheme", "state": None},
    {"name": "PM Matsya Sampada Yojana (PMMSY)", "state": None},
    {"name": "Paramparagat Krishi Vikas Yojana (PKVY)", "state": None},
    {"name": "Agriculture Infrastructure Fund (AIF)", "state": None},
    {"name": "PM Formalisation of Micro Food Processing Enterprises (PMFME)", "state": None},
    {"name": "Samagra Shiksha Scheme", "state": None},
    {"name": "PM-SHRI Schools Scheme", "state": None},
    {"name": "PM Research Fellowship (PMRF)", "state": None},
    {"name": "PM Van Dhan Yojana", "state": None},
    {"name": "PM E-Drive Scheme", "state": None},
    {"name": "Bharat-VISTAAR Scheme", "state": None},
    {"name": "Coconut Promotion Scheme", "state": None},
    {"name": "Reservoir Development Scheme", "state": None},

    # State Schemes (West Bengal)
    {"name": "Kanyashree Prakalpa", "state": "West Bengal"},
    {"name": "Rupashree Prakalpa", "state": "West Bengal"},
    {"name": "Sabooj Sathy Scheme", "state": "West Bengal"},
    {"name": "Yuvashree Scheme", "state": "West Bengal"},
    {"name": "Lokkhir Bhandar Scheme", "state": "West Bengal"},
    {"name": "Annapurna Bhandar Scheme", "state": "West Bengal"},
    {"name": "Gatidhara Scheme", "state": "West Bengal"},
    {"name": "Shikshashree Scheme", "state": "West Bengal"},

    # State Schemes (Uttar Pradesh)
    {"name": "Mukhyamantri Kanya Sumangala Yojana", "state": "Uttar Pradesh"},
    {"name": "UP BC Sakhi Yojana", "state": "Uttar Pradesh"},
    {"name": "Mukhyamantri Yuva Swarozgar Yojana", "state": "Uttar Pradesh"},
    {"name": "UP Bhagirathi Scheme", "state": "Uttar Pradesh"},
    {"name": "UP Gopalak Yojana", "state": "Uttar Pradesh"},
    {"name": "UP Divyang Pension Yojana", "state": "Uttar Pradesh"},

    # State Schemes (Bihar)
    {"name": "Bihar Mukhyamantri Udyami Yojana", "state": "Bihar"},
    {"name": "Bihar Mukhyamantri Kanya Utthan Yojana", "state": "Bihar"},
    {"name": "Bihar Student Credit Card Scheme", "state": "Bihar"},
    {"name": "Bihar Har Ghar Gangajal Scheme", "state": "Bihar"},
    {"name": "Bihar Mukhyamantri Vriddhajan Pension Yojana", "state": "Bihar"},

    # State Schemes (Maharashtra)
    {"name": "Maharashtra Mukhyamantri Majhi Ladki Bahin Yojana", "state": "Maharashtra"},
    {"name": "Maharashtra Shiv Bhojan Yojana", "state": "Maharashtra"},
    {"name": "Maharashtra Sanjay Gandhi Niradhar Grant Scheme", "state": "Maharashtra"},
    {"name": "Maharashtra Lek Ladki Yojana", "state": "Maharashtra"},

    # State Schemes (Rajasthan)
    {"name": "Rajasthan Mukhyamantri Chiranjeevi Swasthya Bima Yojana", "state": "Rajasthan"},
    {"name": "Rajasthan Indira Gandhi Urban Employment Guarantee Scheme", "state": "Rajasthan"},
    {"name": "Rajasthan Kalibai Bheel Medhavi Chhatra Scooty Yojana", "state": "Rajasthan"},

    # State Schemes (Madhya Pradesh)
    {"name": "Madhya Pradesh Mukhyamantri Ladli Behna Yojana", "state": "Madhya Pradesh"},
    {"name": "Madhya Pradesh Ladli Laxmi Yojana", "state": "Madhya Pradesh"},
    {"name": "Madhya Pradesh Mukhyamantri Kisan Kalyan Yojana", "state": "Madhya Pradesh"},

    # State Schemes (Karnataka)
    {"name": "Karnataka Gruha Lakshmi Scheme", "state": "Karnataka"},
    {"name": "Karnataka Yuva Nidhi Scheme", "state": "Karnataka"},
    {"name": "Karnataka Gruha Jyothi Scheme", "state": "Karnataka"},
    {"name": "Karnataka Shakti Scheme", "state": "Karnataka"},
    {"name": "Karnataka Anna Bhagya Scheme", "state": "Karnataka"},

    # State Schemes (Telangana)
    {"name": "Telangana Rythu Bandhu Scheme", "state": "Telangana"},
    {"name": "Telangana Dalit Bandhu Scheme", "state": "Telangana"},
    {"name": "Telangana Aasara Pension Scheme", "state": "Telangana"},

    # State Schemes (Tamil Nadu)
    {"name": "Tamil Nadu Pudhumai Penn Scheme", "state": "Tamil Nadu"},
    {"name": "Tamil Nadu Kalaignar Magalir Urimai Thogai Scheme", "state": "Tamil Nadu"},
    {"name": "Tamil Nadu Chief Minister’s Breakfast Scheme", "state": "Tamil Nadu"}
]

def load_env():
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

def make_slug(title):
    slug = title.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug)
    return slug

def query_gemini_batch(batch_schemes, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    prompt = f"""
    You are an expert on Indian Government welfare schemes, SEO content editor, and parser.
    Generate a valid JSON array of details for the following {len(batch_schemes)} government schemes:
    {json.dumps(batch_schemes, indent=2)}

    For each scheme, generate a JSON object with the following keys. Return ONLY a valid JSON array, with no other text, markdown formatting or code blocks.
    Keys:
    - "title": The official scheme name (e.g. "Pradhan Mantri Ujjwala Yojana (PMUY)")
    - "department": The conducting ministry/department (e.g. "Ministry of Petroleum and Natural Gas")
    - "category": Must be exactly "Govt Schemes"
    - "state": The state name (e.g. "West Bengal") or null for Central/All-India schemes
    - "district": null
    - "block": null
    - "municipality": null
    - "overview": A concise 2-3 sentence summary of the scheme, its goal, and main benefits.
    - "eligibility": A clear summary of eligibility criteria (e.g. "Families below the poverty line (BPL), SC/ST households, women members of the family.")
    - "age_limit": The age criteria for beneficiaries (e.g. "Minimum 18 years" or "N/A")
    - "salary": Details of financial benefit/welfare (e.g. "Free LPG connection with financial assistance of Rs. 1,600 per connection" or "Rs. 6000 per year")
    - "start_date": "2016-05-01" (The official launch date or a representative date in YYYY-MM-DD format)
    - "end_date": null
    - "exam_date": null
    - "how_to_apply": Step by step application instructions.
    - "apply_link": The official website link for registration/details (e.g. "https://www.pmuy.gov.in")
    - "official_pdf_link": A valid guide/PDF link or null
    - "content": Detailed markdown guide covering benefits, documents required, and step-by-step registration. Use headings like "### Benefits", "### Documents Required", "### How to Apply".
    """
    
    headers = {"Content-Type": "application/json"}
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
    
    try:
        print(f"Querying Gemini API for batch of {len(batch_schemes)} schemes...")
        with urllib.request.urlopen(req, timeout=45) as response:
            res = json.loads(response.read().decode("utf-8"))
            raw_response = res['candidates'][0]['content']['parts'][0]['text'].strip()
            
            if "```json" in raw_response:
                raw_response = raw_response.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_response:
                raw_response = raw_response.split("```")[1].split("```")[0].strip()
                
            return json.loads(raw_response)
    except Exception as e:
        print(f"Gemini batch query failed: {e}")
        return None

def query_deepseek_batch(batch_schemes, api_key):
    url = "https://api.deepseek.com/v1/chat/completions"
    
    prompt = f"""
    You are an expert on Indian Government welfare schemes, SEO content editor, and parser.
    Generate a valid JSON array of details for the following {len(batch_schemes)} government schemes:
    {json.dumps(batch_schemes, indent=2)}

    For each scheme, generate a JSON object with the following keys. Return ONLY a valid JSON array, with no other text, markdown formatting or code blocks.
    Keys:
    - "title": The official scheme name (e.g. "Pradhan Mantri Ujjwala Yojana (PMUY)")
    - "department": The conducting ministry/department (e.g. "Ministry of Petroleum and Natural Gas")
    - "category": Must be exactly "Govt Schemes"
    - "state": The state name (e.g. "West Bengal") or null for Central/All-India schemes
    - "district": null
    - "block": null
    - "municipality": null
    - "overview": A concise 2-3 sentence summary of the scheme, its goal, and main benefits.
    - "eligibility": A clear summary of eligibility criteria (e.g. "Families below the poverty line (BPL), SC/ST households, women members of the family.")
    - "age_limit": The age criteria for beneficiaries (e.g. "Minimum 18 years" or "N/A")
    - "salary": Details of financial benefit/welfare (e.g. "Free LPG connection with financial assistance of Rs. 1,600 per connection" or "Rs. 6000 per year")
    - "start_date": "2016-05-01" (The official launch date or a representative date in YYYY-MM-DD format)
    - "end_date": null
    - "exam_date": null
    - "how_to_apply": Step by step application instructions.
    - "apply_link": The official website link for registration/details (e.g. "https://www.pmuy.gov.in")
    - "official_pdf_link": A valid guide/PDF link or null
    - "content": Detailed markdown guide covering benefits, documents required, and step-by-step registration. Use headings like "### Benefits", "### Documents Required", "### How to Apply".
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
        print(f"Querying DeepSeek API for batch of {len(batch_schemes)} schemes...")
        with urllib.request.urlopen(req, timeout=45) as response:
            res = json.loads(response.read().decode("utf-8"))
            content = res['choices'][0]['message']['content'].strip()
            
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            # If the response is a dictionary containing a key like "schemes", extract the array
            parsed = json.loads(content)
            if isinstance(parsed, dict):
                for k, v in parsed.items():
                    if isinstance(v, list):
                        return v
            return parsed
    except Exception as e:
        print(f"DeepSeek batch query failed: {e}")
        return None

def upsert_to_supabase(scheme, supabase_url, service_key):
    title = scheme.get("title", "")
    slug = make_slug(title)
    
    scheme_data = {
        "id": scheme.get("id", os.urandom(8).hex()),
        "title": title,
        "department": scheme.get("department", ""),
        "category": "Govt Schemes",
        "state": scheme.get("state"),
        "district": None,
        "block": None,
        "municipality": None,
        "overview": scheme.get("overview", ""),
        "eligibility": scheme.get("eligibility"),
        "age_limit": scheme.get("age_limit", "N/A"),
        "salary": scheme.get("salary"),
        "important_dates": {
            "start_date": scheme.get("start_date"),
            "end_date": None,
            "exam_date": None
        },
        "how_to_apply": scheme.get("how_to_apply"),
        "apply_link": scheme.get("apply_link"),
        "official_pdf_link": scheme.get("official_pdf_link"),
        "slug": slug,
        "meta_title": f"{title} 2026: Online Form, Eligibility & Benefits",
        "meta_description": scheme.get("overview", "")[:155],
        "content": scheme.get("content"),
        "updated_at": datetime.utcnow().isoformat() + "Z"
    }

    url = f"{supabase_url}/rest/v1/jobs?on_conflict=slug"
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(scheme_data).encode("utf-8"),
        headers=headers,
        method="POST"
    )

    try:
        with urllib.request.urlopen(req) as response:
            print(f"Successfully uploaded scheme to Supabase: {title} (/gov-schemes/{slug})")
            return scheme_data
    except Exception as e:
        print(f"Supabase upload failed for {title}: {e}")
        return scheme_data

def main():
    env = load_env()
    supabase_url = (env.get("SUPABASE_URL") or os.environ.get("SUPABASE_URL") or "").strip()
    service_key = (env.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or "").strip()
    gemini_key = (env.get("GEMINI_API_KEY") or os.environ.get("GEMINI_API_KEY") or "").strip()
    deepseek_key = (env.get("DEEPSEEK_API_KEY") or os.environ.get("DEEPSEEK_API_KEY") or "").strip()

    local_db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'jobs_db.json')
    
    # Load existing schemes to avoid duplicate requests
    existing_slugs = set()
    local_jobs = []
    if os.path.exists(local_db_path):
        try:
            with open(local_db_path, 'r', encoding='utf-8') as f:
                local_jobs = json.load(f)
                for job in local_jobs:
                    existing_slugs.add(job.get("slug"))
        except Exception as e:
            print(f"Error loading local database: {e}")

    # Filter schemes that aren't already seeded
    schemes_to_process = []
    for scheme in SCHEMES_LIST:
        slug = make_slug(scheme["name"])
        if slug not in existing_slugs:
            schemes_to_process.append(scheme)

    print(f"Total schemes in directory: {len(SCHEMES_LIST)}")
    print(f"Schemes already in database: {len(existing_slugs)}")
    print(f"New schemes to fetch and seed: {len(schemes_to_process)}")

    if not schemes_to_process:
        print("All schemes already seeded. Nothing to do!")
        return

    # Process in batches of 15 schemes to fit within rate limits and single prompt size
    batch_size = 15
    for i in range(0, len(schemes_to_process), batch_size):
        batch = schemes_to_process[i:i+batch_size]
        print(f"\nProcessing Batch {i//batch_size + 1} ({len(batch)} schemes)...")
        
        parsed_batch = None
        
        # Try Gemini first
        if gemini_key:
            parsed_batch = query_gemini_batch(batch, gemini_key)
            if parsed_batch:
                print("Sleeping 10 seconds to respect Gemini API rate limits...")
                time.sleep(10)
        
        # Fallback to DeepSeek if Gemini fails
        if not parsed_batch and deepseek_key:
            print("Gemini batch query failed/unavailable. Falling back to DeepSeek...")
            parsed_batch = query_deepseek_batch(batch, deepseek_key)
            if parsed_batch:
                time.sleep(2)

        if not parsed_batch:
            print("Failed to generate schemes for this batch. Skipping.")
            continue

        # Ensure batch result is a list
        if not isinstance(parsed_batch, list):
            print("Response is not a valid list. Skipping batch.")
            continue

        for scheme_obj in parsed_batch:
            if not isinstance(scheme_obj, dict) or "title" not in scheme_obj:
                continue
                
            # Upsert directly to Supabase if config exists
            uploaded_obj = None
            if supabase_url and service_key:
                uploaded_obj = upsert_to_supabase(scheme_obj, supabase_url, service_key)
            
            # Local update
            if not uploaded_obj:
                slug = make_slug(scheme_obj["title"])
                uploaded_obj = {
                    "id": scheme_obj.get("id", os.urandom(8).hex()),
                    "title": scheme_obj["title"],
                    "department": scheme_obj.get("department", ""),
                    "category": "Govt Schemes",
                    "state": scheme_obj.get("state"),
                    "district": None,
                    "block": None,
                    "municipality": None,
                    "overview": scheme_obj.get("overview", ""),
                    "eligibility": scheme_obj.get("eligibility"),
                    "age_limit": scheme_obj.get("age_limit", "N/A"),
                    "salary": scheme_obj.get("salary"),
                    "important_dates": {
                        "start_date": scheme_obj.get("start_date"),
                        "end_date": None,
                        "exam_date": None
                    },
                    "how_to_apply": scheme_obj.get("how_to_apply"),
                    "apply_link": scheme_obj.get("apply_link"),
                    "official_pdf_link": scheme_obj.get("official_pdf_link"),
                    "slug": slug,
                    "meta_title": f"{scheme_obj['title']} 2026: Online Form, Eligibility & Benefits",
                    "meta_description": scheme_obj.get("overview", "")[:155],
                    "content": scheme_obj.get("content"),
                    "updated_at": datetime.utcnow().isoformat() + "Z"
                }

            # Avoid duplicates in local file
            existing_idx = next((index for (index, d) in enumerate(local_jobs) if d["slug"] == uploaded_obj["slug"]), None)
            if existing_idx is not None:
                local_jobs[existing_idx] = uploaded_obj
            else:
                local_jobs.append(uploaded_obj)

        # Write local database updates on each batch success to prevent data loss
        try:
            with open(local_db_path, 'w', encoding='utf-8') as f:
                json.dump(local_jobs, f, indent=2, ensure_ascii=False)
            print(f"Updated local database file {local_db_path} successfully.")
        except Exception as e:
            print(f"Failed to write updated database back to disk: {e}")

    print("\nSeed schemes process completed successfully!")

if __name__ == "__main__":
    main()
