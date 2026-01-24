from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import crud
from schemas import SongTableResponse, RatingCreate
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Songs Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                    "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/songs", response_model=list[SongTableResponse])
def read_songs(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    return crud.get_songs(db, skip, limit)

@app.get("/songs/search", response_model=list[SongTableResponse])
def search_songs(
    title: str,
    db: Session = Depends(get_db)
):
    return crud.get_songs_by_title(db, title)

@app.post("/rate")
def rate_song(
    payload: RatingCreate,
    db: Session = Depends(get_db)
):
    return crud.add_rating(db, payload.song_index, payload.rating)
