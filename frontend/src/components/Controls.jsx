import { usePlayer } from "../context/PlayerContext";

export default function Controls() {
  const { isPlaying, togglePlay, next, prev, isShuffled, toggleShuffle, repeatMode, cycleRepeat } =
    usePlayer();

  return (
    <div className="controls" id="player-controls">
      {/* Shuffle */}
      <button
        id="btn-shuffle"
        className={`control-btn control-btn--small ${isShuffled ? "control-btn--active" : ""}`}
        onClick={toggleShuffle}
        title="Shuffle"
        aria-label="Toggle shuffle"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
        </svg>
      </button>

      {/* Previous */}
      <button
        id="btn-prev"
        className="control-btn"
        onClick={prev}
        title="Previous"
        aria-label="Previous track"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      {/* Play/Pause */}
      <button
        id="btn-play-pause"
        className="control-btn control-btn--play"
        onClick={togglePlay}
        title={isPlaying ? "Pause" : "Play"}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Next */}
      <button
        id="btn-next"
        className="control-btn"
        onClick={next}
        title="Next"
        aria-label="Next track"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>

      {/* Repeat */}
      <button
        id="btn-repeat"
        className={`control-btn control-btn--small ${repeatMode !== "none" ? "control-btn--active" : ""}`}
        onClick={cycleRepeat}
        title={`Repeat: ${repeatMode}`}
        aria-label={`Repeat mode: ${repeatMode}`}
      >
        {repeatMode === "one" ? (
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
          </svg>
        )}
      </button>
    </div>
  );
}
