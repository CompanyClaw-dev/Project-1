import { usePlayer } from "../context/PlayerContext";

export default function NowPlaying() {
  const { currentSong, isPlaying } = usePlayer();

  if (!currentSong) {
    return (
      <div className="now-playing" id="now-playing">
        <div className="now-playing__empty">
          <div className="now-playing__icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="64" height="64">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <h2>No song playing</h2>
          <p>Select a song from the playlist to start</p>
        </div>
      </div>
    );
  }

  return (
    <div className="now-playing" id="now-playing">
      <div className={`now-playing__art-container ${isPlaying ? "now-playing__art-container--playing" : ""}`}>
        {currentSong.artUrl ? (
          <img
            className="now-playing__art"
            src={currentSong.artUrl}
            alt={`${currentSong.title} album art`}
            id="now-playing-art"
          />
        ) : (
          <div className="now-playing__art now-playing__art--placeholder" id="now-playing-art">
            <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
      </div>
      <div className="now-playing__info">
        <h2 className="now-playing__title" id="now-playing-title">
          {currentSong.title}
        </h2>
        <p className="now-playing__artist" id="now-playing-artist">
          {currentSong.artist}
        </p>
      </div>
    </div>
  );
}
