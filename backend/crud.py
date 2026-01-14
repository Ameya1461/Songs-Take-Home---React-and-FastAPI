from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import Song, SongRating

def _format_song_row(song: Song, rating: int | None):
    return {
        "id": song.id,                  
        "song_id": song.song_id,
        "title": song.title,
        "danceability": song.danceability,
        "energy": song.energy,
        "mode": song.mode,
        "acousticness": song.acousticness,
        "tempo": song.tempo,
        "duration_ms": song.duration_ms,
        "num_sections": song.num_sections,
        "num_segments": song.num_segments,
        "latest_rating": rating
    }


def get_songs(db: Session, skip: int, limit: int):
    rows = (
        db.query(Song, SongRating.rating)
        .outerjoin(
            SongRating,
            Song.id == SongRating.song_index
        )
        .order_by(
            Song.id.asc(),
            SongRating.id.desc()   
        )
        .distinct(Song.id)         
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [_format_song_row(song, rating) for song, rating in rows]


def get_songs_by_title(db: Session, title: str):
    rows = (
        db.query(Song, SongRating.rating)
        .outerjoin(
            SongRating,
            Song.id == SongRating.song_index
        )
        .filter(Song.title.ilike(f"%{title}%"))
        .order_by(
            Song.id.asc(),
            SongRating.id.desc()
        )
        .distinct(Song.id)
        .all()
    )

    return [_format_song_row(song, rating) for song, rating in rows]


def add_rating(db: Session, song_index: int, rating: int):
    if rating < 1 or rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 1 and 5"
        )
    
    song = db.get(Song, song_index)
    if not song:
        raise HTTPException(
            status_code=404,
            detail="Song not found"
        )

    new_rating = SongRating(
        song_index=song_index,  
        rating=rating
    )

    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)

    return new_rating
