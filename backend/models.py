from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime, timezone
from database import Base

class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)

    song_id = Column(String, unique=True, index=True)
    title = Column(String)

    danceability = Column(Float)
    energy = Column(Float)
    key = Column(Integer)
    loudness = Column(Float)
    mode = Column(Integer)
    acousticness = Column(Float)
    instrumentalness = Column(Float)
    liveness = Column(Float)
    valence = Column(Float)
    tempo = Column(Float)
    duration_ms = Column(Integer)
    time_signature = Column(Integer)
    num_bars = Column(Integer)
    num_sections = Column(Integer)
    num_segments = Column(Integer)
    class_label = Column(Integer)

class SongRating(Base):
    __tablename__ = "song_ratings"

    id = Column(Integer, primary_key=True)
    song_index = Column(Integer, ForeignKey("songs.id")) 
    rating = Column(Integer)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))