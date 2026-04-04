import { useRef, useCallback } from "react";
import { usePlayer } from "../context/PlayerContext";
import { formatTime } from "../utils/formatTime";

export default function ProgressBar() {
  const { currentTime, duration, seek } = usePlayer();
  const barRef = useRef(null);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleClick = useCallback(
    (e) => {
      if (!barRef.current || !duration) return;
      const rect = barRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      seek(pct * duration);
    },
    [duration, seek]
  );

  const handleDrag = useCallback(
    (e) => {
      if (e.buttons !== 1) return; // left mouse only
      handleClick(e);
    },
    [handleClick]
  );

  return (
    <div className="progress-container" id="progress-container">
      <span className="progress-time" id="current-time">
        {formatTime(currentTime)}
      </span>
      <div
        className="progress-bar"
        id="progress-bar"
        ref={barRef}
        onClick={handleClick}
        onMouseMove={handleDrag}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={currentTime}
        tabIndex={0}
      >
        <div className="progress-bar__track">
          <div
            className="progress-bar__fill"
            style={{ width: `${progress}%` }}
          />
          <div
            className="progress-bar__thumb"
            style={{ left: `${progress}%` }}
          />
        </div>
      </div>
      <span className="progress-time" id="total-time">
        {formatTime(duration)}
      </span>
    </div>
  );
}
