import json
from database import SessionLocal, engine, Base
from models import Song

Base.metadata.create_all(bind=engine)

with open("data/playlist.json") as f:
    data = json.load(f)

db = SessionLocal()
size = len(data["id"])

for i in range(size):
    song = Song(
        id=i, 
        song_id=data["id"][str(i)],
        title=data["title"][str(i)],
        danceability=data["danceability"][str(i)],
        energy=data["energy"][str(i)],
        key=data["key"][str(i)],
        loudness=data["loudness"][str(i)],
        mode=data["mode"][str(i)],
        acousticness=data["acousticness"][str(i)],
        instrumentalness=data["instrumentalness"][str(i)],
        liveness=data["liveness"][str(i)],
        valence=data["valence"][str(i)],
        tempo=data["tempo"][str(i)],
        duration_ms=data["duration_ms"][str(i)],
        time_signature=data["time_signature"][str(i)],
        num_bars=data["num_bars"][str(i)],
        num_sections=data["num_sections"][str(i)],
        num_segments=data["num_segments"][str(i)],
        class_label=data["class"][str(i)],
    )
    db.add(song)

db.commit()
db.close()
