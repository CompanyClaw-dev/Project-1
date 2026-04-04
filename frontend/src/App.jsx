import { useState } from "react";
import { PlayerProvider, usePlayer } from "./context/PlayerContext";
import Player from "./components/Player";
import Playlist from "./components/Playlist";
import NowPlaying from "./components/NowPlaying";
import SearchBar from "./components/SearchBar";
import UploadModal from "./components/UploadModal";
import "./App.css";

function AppContent() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const { playlist, loading, error } = usePlayer();

  return (
    <div className="app" id="app">
      {/* Header */}
      <header className="header" id="header">
        <div className="header__brand">
          <div className="header__logo">
            <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <span className="header__title">SoundWave</span>
        </div>

        <div className="header__actions">
          <SearchBar />
          <button
            className="header__upload-btn"
            id="btn-upload"
            onClick={() => setUploadOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
            </svg>
            Upload
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="app__main">
        {error && (
          <div className="error-banner" id="error-banner">
            ⚠ {error} — Make sure the backend is running on port 8000
          </div>
        )}

        <div className="content">
          {/* Left: Now Playing */}
          <div className="content__left">
            {loading ? (
              <div className="loading">
                <div className="loading__spinner"></div>
              </div>
            ) : (
              <NowPlaying />
            )}
          </div>

          {/* Right: Playlist */}
          <div className="content__right">
            <div className="content__right-header">
              <h3>Playlist</h3>
              <span>{playlist.length} songs</span>
            </div>
            <Playlist />
          </div>
        </div>
      </main>

      {/* Bottom Player Bar */}
      <Player />

      {/* Upload Modal */}
      <UploadModal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />

      {/* Keyboard shortcuts hint */}
      <div className="keyboard-hint">
        <kbd>Space</kbd> Play
        <kbd>←→</kbd> Skip
        <kbd>↑↓</kbd> Vol
        <kbd>M</kbd> Mute
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}
