import os
import httpx
from dotenv import load_dotenv
from typing import Optional, Dict, Any

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env file")

class SupabaseClient:
    def __init__(self, url: str, key: str):
        self.url = url
        self.key = key
        self.headers = {
            "apikey": key,
            "Content-Type": "application/json"
        }
    
    async def sign_in_with_password(self, email: str, password: str) -> Dict[str, Any]:
        """Sign in a user with email and password"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.url}/auth/v1/token?grant_type=password",
                json={"email": email, "password": password},
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
    
    async def sign_out(self, access_token: str) -> None:
        """Sign out a user"""
        headers = {**self.headers, "Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.url}/auth/v1/logout",
                headers=headers
            )
            response.raise_for_status()
    
    async def get_user(self, access_token: str) -> Optional[Dict[str, Any]]:
        """Get user data from access token"""
        headers = {**self.headers, "Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.url}/auth/v1/user",
                headers=headers
            )
            if response.status_code == 200:
                return response.json()
            return None

# Create a singleton instance
supabase = SupabaseClient(SUPABASE_URL, SUPABASE_KEY)