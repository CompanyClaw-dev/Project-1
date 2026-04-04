import { usePlayer } from "../context/PlayerContext";
import { formatTime } from "../utils/formatTime";

export default function Playlist() {
  const { playlist, currentIndex, isPlaying, playSongAtIndex, deleteSong } =
    usePlayer();

  if (playlist.length === 0) {
    return (
      <div className="playlist" id="playlist">
        <div className="playlist__empty">
          <p>No songs yet. Upload some music!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist" id="playlist">
      <ul className="playlist__list">
        {playlist.map((song, index) => {
          const isActive = index === currentIndex;
          return (
            <li
              key={song.id}
              className={`playlist__item ${isActive ? "playlist__item--active" : ""}`}
              id={`playlist-item-${song.id}`}
              onClick={() => playSongAtIndex(index)}
            >
              <div className="playlist__item-left">
                <div className="playlist__item-index">
                  {isActive && isPlaying ? (
                    <div className="playlist__equalizer">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <span className="playlist__item-num">{index + 1}</span>
                  )}
                </div>
                {song.artUrl ? (
                  <img
                    className="playlist__item-art"
                    src={song.artUrl}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <div className="playlist__item-art playlist__item-art--placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                )}
                <div className="playlist__item-info">
                  <span className="playlist__item-title">{song.title}</span>
                  <span className="playlist__item-artist">{song.artist}</span>
                </div>
              </div>
              <div className="playlist__item-right">
                <span className="playlist__item-duration">
                  {song.duration ? formatTime(song.duration) : "—"}
                </span>
                <button
                  className="playlist__item-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${song.title}"?`)) {
                      deleteSong(song.id);
                    }
                  }}
                  title="Delete song"
                  aria-label={`Delete ${song.title}`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
