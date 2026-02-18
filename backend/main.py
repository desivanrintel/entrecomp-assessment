import os
import bcrypt  # We use this directly now
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.sql import func
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv
from jose import JWTError, jwt
from datetime import datetime, timedelta

load_dotenv()

# --- SETTINGS ---
SECRET_KEY = os.getenv("SECRET_KEY", "a-very-secret-random-string")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 

# --- DATABASE CONFIG ---
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ONLY ONE BASE DECLARATION
Base = declarative_base()

# --- NEW MODERN SECURITY HELPERS (Direct bcrypt) ---
def get_password_hash(password: str):
    # Bcrypt strictly requires bytes
    pwd_bytes = password.encode('utf-8')
    # Hard truncate to 72 bytes to avoid bcrypt error
    pwd_bytes = pwd_bytes[:72]
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str):
    pwd_bytes = plain_password.encode('utf-8')
    pwd_bytes = pwd_bytes[:72]
    # Check if plain matches hashed
    return bcrypt.checkpw(pwd_bytes, hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- MODELS ---
class DBUser(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)  # New field
    last_name = Column(String)   # New field
    hashed_password = Column(String)
    role = Column(String, default="user")
    assessments = relationship("DBAssessment", back_populates="owner")

class DBAssessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("DBUser", back_populates="assessments")

# Tables are created AFTER models are defined
Base.metadata.create_all(bind=engine)

# --- SCHEMAS ---
class UserCreate(BaseModel):
    email: EmailStr
    first_name: str  # Added
    last_name: str   # Added
    password: str = Field(..., max_length=72)

class UserOut(BaseModel):
    id: int
    email: str
    first_name: str  # Added
    last_name: str   # Added
    role: str
    class Config: from_attributes = True

class AssessmentCreate(BaseModel):
    score: float

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

# --- APP ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    # allow_origin_regex="https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")  # This must match what you put in create_access_token
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Querying by email is now required
        user = db.query(DBUser).filter(DBUser.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# --- ROUTES ---
@app.post("/api/register", response_model=UserOut)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(DBUser).filter(DBUser.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = DBUser(
        email=user.email,
        first_name=user.first_name, # Updated
        last_name=user.last_name,   # Updated
        hashed_password=get_password_hash(user.password),
        role="user" # Usually better to default to "user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm uses 'username' field for the input email
    user = db.query(DBUser).filter(DBUser.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "role": user.role}

@app.post("/api/save")
def save_assessment(data: AssessmentCreate, db: Session = Depends(get_db), current_user: DBUser = Depends(get_current_user)):
    new_entry = DBAssessment(score=data.score, user_id=current_user.id)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return {"status": "success", "assessment_id": new_entry.id}

@app.get("/api/hello")
async def read_root():
    return {"message": "Backend online"}


@app.get("/api/me")
def get_me(current_user: DBUser = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "role": current_user.role
    }

@app.post("/api/change-password")
def change_password(
    request: PasswordChangeRequest, 
    current_user: DBUser = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    # 1. Verify the current password is correct using your helper
    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Current password incorrect")
    
    # 2. Hash and update with the new password using your helper
    current_user.hashed_password = get_password_hash(request.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}