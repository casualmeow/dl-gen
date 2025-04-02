from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from typing import List, Optional, Dict, Any

from auth import Token, get_current_active_user, authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from users import User, UserCreate, user_db
from supabase_client import supabase
from pydantic import BaseModel, EmailStr

# Models for Supabase authentication
class SupabaseLoginRequest(BaseModel):
    email: EmailStr
    password: str

class SupabaseUserResponse(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None

# Create FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Supabase Authentication Routes
@app.post("/auth/login", response_model=Dict[str, Any])
async def supabase_login(login_data: SupabaseLoginRequest):
    try:
        # Call Supabase to authenticate the user
        auth_data = await supabase.sign_in_with_password(login_data.email, login_data.password)
        return auth_data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/auth/logout")
async def supabase_logout(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization.replace("Bearer ", "")
    try:
        await supabase.sign_out(token)
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/auth/user", response_model=SupabaseUserResponse)
async def supabase_get_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization.replace("Bearer ", "")
    try:
        user_data = await supabase.get_user(token)
        if not user_data:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Map Supabase user to our response type
        return {
            "username": user_data.get("email", "").split("@")[0],
            "email": user_data.get("email"),
            "full_name": user_data.get("user_metadata", {}).get("full_name")
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@app.get("/users", response_model=List[User])
async def read_users(current_user: User = Depends(get_current_active_user)):
    # Only allow authenticated users to see the user list
    return user_db.get_users()

@app.post("/users", response_model=User)
async def create_new_user(user: UserCreate):
    # Check if username already exists
    existing_user = user_db.get_user(user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    # Create new user
    db_user = user_db.create_user(user)
    return db_user

@app.get("/")
async def root():
    return {"message": "Welcome to DL-Gen API. Please use /docs for API documentation"}

@app.get("/ping")
async def ping():
    return {"message": "pong"}

# Protected route example
@app.get("/protected-resource")
async def protected_resource(current_user: User = Depends(get_current_active_user)):
    return {
        "message": f"Hello {current_user.username}, this is a protected resource",
        "user_info": current_user
    }

# File upload endpoint
@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Process the uploaded file here
        # For now, we'll just return a redirect URL
        return {"redirect": "/edit/abc123"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)