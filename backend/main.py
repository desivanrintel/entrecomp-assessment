import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# --- DATABASE CONFIGURATION ---
DATABASE_URL = os.getenv("DATABASE_URL")

# Fix for Neon/Render postgresql:// requirement
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- DATABASE MODELS ---
class DBAssessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    score = Column(Float)

# Create tables in Neon automatically
Base.metadata.create_all(bind=engine)

# --- PYDANTIC SCHEMAS (For Validation) ---
class AssessmentCreate(BaseModel):
    username: str
    score: float

# --- APP INITIALIZATION ---
app = FastAPI()

# --- CORS MIDDLEWARE ---
# This keeps your existing frontend_url but adds the regex for Vercel flexibility
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_origin_regex="https://.*\.vercel\.app",  # Matches all Vercel previews
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DEPENDENCY ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ROUTES ---
@app.get("/api/hello")
async def read_root():
    return {"message": "Hello from FastAPI v2 connected to Neon!"}

@app.post("/api/save")
def save_assessment(data: AssessmentCreate, db: Session = Depends(get_db)):
    try:
        new_entry = DBAssessment(username=data.username, score=data.score)
        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)
        return {"status": "success", "id": new_entry.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/results")
def get_results(db: Session = Depends(get_db)):
    results = db.query(DBAssessment).all()
    return results