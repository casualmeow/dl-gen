import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_DATABASE_URL")
key: str = os.environ.get("SUPABASE_DATABASE_KEY")

if not url or not key:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_KEY")

supabase: Client = create_client(url, key)