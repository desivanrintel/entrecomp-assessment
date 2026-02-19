import os
import bcrypt  # We use this directly now
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.sql import func
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List

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
    is_active = Column(Boolean, default=False)  # <-- Add this line
    assessments = relationship("DBAssessment", back_populates="owner", cascade="all, delete-orphan")
    detailed_assessments = relationship("DBDetailedAssessment", back_populates="owner", cascade="all, delete-orphan")

class DBAssessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("DBUser", back_populates="assessments")

class DBDetailedAssessment(Base):
    __tablename__ = "detailed_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Area 1: Ideas & Opportunities
    spotting_opportunities = Column(Integer, default=0)
    creativity = Column(Integer, default=0)
    vision = Column(Integer, default=0)
    valuing_ideas = Column(Integer, default=0)
    ethical_thinking = Column(Integer, default=0)

    # Area 2: Resources
    self_awareness = Column(Integer, default=0)
    motivation = Column(Integer, default=0)
    mobilising_resources = Column(Integer, default=0)
    financial_literacy = Column(Integer, default=0)
    mobilising_others = Column(Integer, default=0)

    # Area 3: Into Action
    taking_initiative = Column(Integer, default=0)
    planning_management = Column(Integer, default=0)
    coping_with_ambiguity = Column(Integer, default=0)
    working_with_others = Column(Integer, default=0)
    learning_through_experience = Column(Integer, default=0)

    owner = relationship("DBUser", back_populates="detailed_assessments")

# Don't forget to add the relationship to your DBUser class as well:
# detailed_assessments = relationship("DBDetailedAssessment", back_populates="owner")

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
    confirm_new_password: str # Added field

# Use a specific schema for the user list to avoid sending hashed passwords
class UserManagementOut(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    role: str
    is_active: bool
    assessment_count: int  # New field
    class Config: from_attributes = True

class AssessmentSubmit(BaseModel):
    spotting_opportunities: int
    creativity: int
    vision: int
    valuing_ideas: int
    ethical_thinking: int
    self_awareness: int
    motivation: int
    mobilising_resources: int
    financial_literacy: int
    mobilising_others: int
    taking_initiative: int
    planning_management: int
    coping_with_ambiguity: int
    working_with_others: int
    learning_through_experience: int

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
    user = db.query(DBUser).filter(DBUser.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # Check if the account is disabled
    if not user.is_active:
        raise HTTPException(
            status_code=403, 
            detail="Account disabled. Please contact an administrator for activation."
        )
    
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

@app.get("/api/admin/users", response_model=List[UserManagementOut])
def get_all_users(
    current_user: DBUser = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    users = db.query(DBUser).all()
    
    # Manually attach the count for the response
    for user in users:
        user.assessment_count = len(user.assessments) #
        
    return users

@app.patch("/api/admin/users/{user_id}/toggle-active")
def toggle_user_active(
    user_id: int, 
    current_user: DBUser = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    target_user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    target_user.is_active = not target_user.is_active
    db.commit()
    return {"is_active": target_user.is_active}

@app.delete("/api/admin/users/{user_id}")
def delete_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: DBUser = Depends(get_current_user)
):
    # 1. Security Check: Only admins can delete users
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # 2. Find the user
    user_to_delete = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not user_to_delete:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 3. Prevent self-deletion
    if user_to_delete.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own admin account")

    # 4. Clean up related data (Assessments)
    # This ensures no "orphaned" assessments remain in the database
    db.query(DBAssessment).filter(DBAssessment.user_id == user_id).delete()
    
    # 5. Delete the user and commit
    db.delete(user_to_delete)
    db.commit()
    
    return {"message": f"User {user_to_delete.email} and all their data have been deleted."}

@app.post("/api/assessments/detailed")
def submit_detailed_assessment(
    data: AssessmentSubmit, 
    db: Session = Depends(get_db), 
    current_user: DBUser = Depends(get_current_user)
):
    # Create the new record
    new_result = DBDetailedAssessment(
        user_id=current_user.id,
        # This double asterisk (**) unpacks the dictionary 
        # so 'creativity' in the JSON goes to the 'creativity' column
        **data.dict() 
    )
    
    try:
        db.add(new_result)
        db.commit()
        db.refresh(new_result)
        return {"message": "EntreComp assessment saved", "id": new_result.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/assessments/latest")
def get_latest_assessment(
    db: Session = Depends(get_db), 
    current_user: DBUser = Depends(get_current_user)
):
    # Fetch the most recent detailed assessment for this user
    result = db.query(DBDetailedAssessment)\
        .filter(DBDetailedAssessment.user_id == current_user.id)\
        .order_by(DBDetailedAssessment.created_at.desc())\
        .first()
        
    if not result:
        return {"message": "No assessments found"}
        
    return result

@app.get("/api/admin/users/{user_id}/latest")
def get_user_latest_assessment_admin(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    target_user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    result = db.query(DBDetailedAssessment)\
        .filter(DBDetailedAssessment.user_id == user_id)\
        .order_by(DBDetailedAssessment.created_at.desc())\
        .first()
        
    if not result:
        # Return a specific structure so the frontend knows there's no data
        return {"message": "No assessments found", "no_data": True}
    
    # Convert SQLAlchemy object to a standard Dictionary
    response_data = {c.name: getattr(result, c.name) for c in result.__table__.columns}
    response_data["user_name"] = f"{target_user.first_name} {target_user.last_name}"
    
    return response_data