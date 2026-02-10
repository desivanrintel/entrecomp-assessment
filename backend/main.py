import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Allow Next.js to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
async def read_root():
    return {"message": "Hello from FastAPI v2!"}