from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User models
class UserBase(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = False

class UserCreate(UserBase):
    password: str

class User(UserBase):
    pass

class UserInDB(UserBase):
    hashed_password: str

# Mock database - replace with a real database in production
class UserDB:
    def __init__(self):
        self.users: Dict[str, UserInDB] = {
            "johndoe": UserInDB(
                username="johndoe",
                full_name="John Doe",
                email="johndoe@example.com",
                hashed_password=pwd_context.hash("secret"),
                disabled=False,
            ),
            "alice": UserInDB(
                username="alice",
                full_name="Alice Smith",
                email="alice@example.com",
                hashed_password=pwd_context.hash("password"),
                disabled=False,
            ),
        }

    def get_user(self, username: str) -> Optional[UserInDB]:
        if username in self.users:
            return self.users[username]
        return None

    def create_user(self, user: UserCreate) -> UserInDB:
        hashed_password = pwd_context.hash(user.password)
        db_user = UserInDB(
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            disabled=user.disabled,
            hashed_password=hashed_password,
        )
        self.users[user.username] = db_user
        return db_user

    def get_users(self) -> List[User]:
        return [User(**{k: v for k, v in user.__dict__.items() if k != "hashed_password"}) 
                for user in self.users.values()]

    def update_user(self, username: str, user_data: dict) -> Optional[UserInDB]:
        if username not in self.users:
            return None
        
        current_user = self.users[username]
        updated_data = current_user.__dict__.copy()
        
        for key, value in user_data.items():
            if key in updated_data and key != "hashed_password":
                updated_data[key] = value
        
        if "password" in user_data:
            updated_data["hashed_password"] = pwd_context.hash(user_data["password"])
            
        self.users[username] = UserInDB(**updated_data)
        return self.users[username]

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Create a singleton instance
user_db = UserDB()