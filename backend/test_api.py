from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_get_songs():
    res = client.get("/songs?limit=10")

    assert res.status_code == 200

    data = res.json()
    assert isinstance(data, list)
    assert len(data) == 10

    song = data[0]
    assert "id" in song
    assert "song_id" in song
    assert "title" in song
    assert "latest_rating" in song

def test_search_songs():
    res = client.get("/songs/search?title=a")

    assert res.status_code == 200
    assert isinstance(res.json(), list)

def test_search_songs_missing_query_param():
    res = client.get("/songs/search")

    assert res.status_code == 422

def test_rate_song_success():
    res = client.post(
        "/rate",
        json={"song_index": 0, "rating": 5}
    )

    assert res.status_code == 200

    data = res.json()
    assert data["song_index"] == 0
    assert data["rating"] == 5

def test_rate_song_invalid_rating():
    res = client.post(
        "/rate",
        json={"song_index": 0, "rating": 10}
    )

    assert res.status_code == 400
    assert res.json()["detail"] == "Rating must be between 1 and 5"

def test_rate_song_invalid_song_index():
    res = client.post(
        "/rate",
        json={"song_index": 999999, "rating": 5}
    )

    assert res.status_code == 404
    assert res.json()["detail"] == "Song not found"
