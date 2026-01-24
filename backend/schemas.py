from pydantic import BaseModel
from typing import Optional

class SongTableResponse(BaseModel):
    id: int                 
    song_id: str
    title: str
    danceability: float
    energy: float
    mode: int
    acousticness: float
    tempo: float
    duration_ms: int
    num_sections: int
    num_segments: int
    avg_rating: float | None


class RatingCreate(BaseModel):
    song_index: int
    rating: int
