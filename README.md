# 🎧 SoundWave — Web Music Player

A full stack music player with a premium Spotify-inspired dark UI, built with React + Vite (frontend) and FastAPI (backend).

## Features

- **Playback**: Play/Pause, Next/Previous, Seek (progress bar)
- **Playlist**: Song list with album art, active song highlight, animated equalizer
- **Audio Control**: Volume slider, mute toggle
- **Upload**: Drag-and-drop or click-to-upload MP3/WAV/OGG/FLAC files
- **Search**: Filter songs by title or artist
- **Shuffle & Repeat**: Shuffle mode, repeat all, repeat one
- **Keyboard Controls**: Space (play/pause), ←→ (skip), ↑↓ (volume), M (mute)
- **Persistence**: Volume and last played song saved to localStorage

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Vanilla CSS (glassmorphism dark theme) |
| Backend | FastAPI (Python) |
| Storage | Filesystem + JSON metadata |
| Audio | HTML5 `<audio>` element |

## Quick Start

### 1. Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/songs` | List all songs |
| `GET` | `/api/songs?q=term` | Search songs |
| `POST` | `/api/upload` | Upload song file |
| `DELETE` | `/api/songs/{id}` | Delete a song |
| `GET` | `/api/music/{filename}` | Stream audio file |
| `GET` | `/api/health` | Health check |

## Project Structure

```
├── frontend/           # React + Vite
│   └── src/
│       ├── components/ # Player, Playlist, Controls, etc.
│       ├── hooks/      # useAudio (core audio engine)
│       ├── context/    # PlayerContext (global state)
│       ├── services/   # API client
│       └── utils/      # Helpers
│
├── backend/            # FastAPI
│   ├── main.py         # API endpoints
│   ├── music/          # Audio files + album art
│   └── metadata.json   # Song metadata
```
