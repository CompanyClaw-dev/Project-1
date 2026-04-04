import { usePlayer } from "../context/PlayerContext";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import VolumeControl from "./VolumeControl";

export default function Player() {
  const { currentSong } = usePlayer();

  return (
    <div className="player" id="player-bar">
      {/* Left: Song info */}
      <div className="player__song-info" id="player-song-info">
        {currentSong?.artUrl ? (
          <img
            className="player__art"
            src={currentSong.artUrl}
            alt=""
            id="player-art"
          />
        ) : (
          <div className="player__art player__art--placeholder" id="player-art">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
        <div className="player__text">
          <span className="player__title" id="player-title">
            {currentSong?.title || "No song selected"}
          </span>
          <span className="player__artist" id="player-artist">
            {currentSong?.artist || "—"}
          </span>
        </div>
      </div>

      {/* Center: Controls + Progress */}
      <div className="player__center">
        <Controls />
        <ProgressBar />
      </div>

      {/* Right: Volume */}
      <div className="player__right">
        <VolumeControl />
      </div>
    </div>
  );
}
