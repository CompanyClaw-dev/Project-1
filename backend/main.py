"""
Music Player Backend — FastAPI
Serves songs, handles uploads, manages metadata.
"""

import json
import os
import uuid
import shutil
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI(title="Music Player API", version="1.0.0")

# CORS — allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent
MUSIC_DIR = BASE_DIR / "music"
UPLOADS_DIR = MUSIC_DIR / "uploads"
METADATA_FILE = BASE_DIR / "metadata.json"

# Ensure directories exist
MUSIC_DIR.mkdir(exist_ok=True)
UPLOADS_DIR.mkdir(exist_ok=True)

# Serve static music files (uploads subdir is auto-served via parent mount)
app.mount("/api/music", StaticFiles(directory=str(MUSIC_DIR)), name="music")


def load_metadata() -> list:
    """Load song metadata from JSON file."""
    if METADATA_FILE.exists():
        with open(METADATA_FILE, "r") as f:
            return json.load(f)
    return []


def save_metadata(data: list):
    """Save song metadata to JSON file."""
    with open(METADATA_FILE, "w") as f:
        json.dump(data, f, indent=2)


@app.get("/api/songs")
def get_songs(q: str = Query(None, description="Search query")):
    """Get all songs, optionally filtered by search query."""
    songs = load_metadata()

    if q:
        q_lower = q.lower()
        songs = [
            s for s in songs
            if q_lower in s.get("title", "").lower()
            or q_lower in s.get("artist", "").lower()
        ]

    # Add full URLs for audio and art
    for song in songs:
        song["url"] = f"/api/music/{song['filename']}"
        if song.get("art"):
            song["artUrl"] = f"/api/music/{song['art']}"

    return songs


@app.post("/api/upload")
async def upload_song(
    file: UploadFile = File(...),
    title: str = Query(None),
    artist: str = Query(None),
):
    """Upload a new song file."""
    # Validate file type
    allowed = {".mp3", ".wav", ".ogg", ".m4a", ".flac", ".webm"}
    ext = Path(file.filename).suffix.lower()
    if ext not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Allowed: {allowed}"
        )

    # Save file to uploads/ subdirectory
    song_id = str(uuid.uuid4())[:8]
    safe_name = f"{song_id}_{file.filename}"
    file_path = UPLOADS_DIR / safe_name

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Create metadata entry
    song_title = title or Path(file.filename).stem.replace("_", " ").replace("-", " ").title()
    song_artist = artist or "Unknown Artist"

    new_song = {
        "id": song_id,
        "title": song_title,
        "artist": song_artist,
        "filename": f"uploads/{safe_name}",
        "art": None,
        "duration": None,
    }

    metadata = load_metadata()
    metadata.append(new_song)
    save_metadata(metadata)

    new_song["url"] = f"/api/music/{safe_name}"
    return new_song


@app.delete("/api/songs/{song_id}")
def delete_song(song_id: str):
    """Delete a song by ID."""
    metadata = load_metadata()
    song = next((s for s in metadata if s["id"] == song_id), None)

    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    # Remove file
    file_path = MUSIC_DIR / song["filename"]
    if file_path.exists():
        file_path.unlink()

    # Remove art if exists
    if song.get("art"):
        art_path = MUSIC_DIR / song["art"]
        if art_path.exists():
            art_path.unlink()

    # Update metadata
    metadata = [s for s in metadata if s["id"] != song_id]
    save_metadata(metadata)

    return {"message": "Song deleted", "id": song_id}


@app.get("/api/health")
def health():
    """Health check endpoint."""
    return {"status": "ok", "songs": len(load_metadata())}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
