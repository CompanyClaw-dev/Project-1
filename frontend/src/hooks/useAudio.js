import { useState, useRef, useEffect, useCallback } from "react";

/**
 * useAudio — core audio engine hook
 *
 * Manages the HTML5 Audio element, playback state, time tracking,
 * volume, shuffle, repeat, and playlist navigation.
 */
export function useAudio(playlist = []) {
  const audioRef = useRef(new Audio());

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem("player_volume");
    return saved !== null ? parseFloat(saved) : 0.7;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none"); // none | one | all
  const [shuffleOrder, setShuffleOrder] = useState([]);

  const audio = audioRef.current;

  // Generate shuffle order
  const generateShuffleOrder = useCallback(
    (excludeIndex = -1) => {
      const indices = playlist.map((_, i) => i).filter((i) => i !== excludeIndex);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      if (excludeIndex >= 0) indices.unshift(excludeIndex);
      return indices;
    },
    [playlist]
  );

  // Set volume on audio element
  useEffect(() => {
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, audio]);

  // Load song when index or playlist changes
  useEffect(() => {
    if (playlist.length === 0) return;
    const song = playlist[currentIndex];
    if (!song) return;

    const wasPlaying = isPlaying;
    audio.src = song.url;
    audio.load();

    if (wasPlaying) {
      audio.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, playlist]);

  // Audio event listeners
  useEffect(() => {
    const a = audio;

    const onTimeUpdate = () => setCurrentTime(a.currentTime);
    const onLoadedMetadata = () => setDuration(a.duration);
    const onEnded = () => {
      if (repeatMode === "one") {
        a.currentTime = 0;
        a.play().catch(() => {});
      } else {
        handleNext();
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    a.addEventListener("timeupdate", onTimeUpdate);
    a.addEventListener("loadedmetadata", onLoadedMetadata);
    a.addEventListener("ended", onEnded);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    return () => {
      a.removeEventListener("timeupdate", onTimeUpdate);
      a.removeEventListener("loadedmetadata", onLoadedMetadata);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatMode, isShuffled, shuffleOrder, playlist]);

  // Handlers
  const play = useCallback(() => {
    audio.play().catch(() => {});
  }, [audio]);

  const pause = useCallback(() => {
    audio.pause();
  }, [audio]);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const seek = useCallback(
    (time) => {
      audio.currentTime = time;
      setCurrentTime(time);
    },
    [audio]
  );

  const setVolume = useCallback(
    (v) => {
      const clamped = Math.max(0, Math.min(1, v));
      setVolumeState(clamped);
      localStorage.setItem("player_volume", clamped.toString());
      if (clamped > 0) setIsMuted(false);
    },
    []
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;

    if (isShuffled && shuffleOrder.length > 0) {
      const currentShufflePos = shuffleOrder.indexOf(currentIndex);
      const nextShufflePos = currentShufflePos + 1;

      if (nextShufflePos < shuffleOrder.length) {
        setCurrentIndex(shuffleOrder[nextShufflePos]);
      } else if (repeatMode === "all") {
        const newOrder = generateShuffleOrder();
        setShuffleOrder(newOrder);
        setCurrentIndex(newOrder[0]);
      } else {
        setIsPlaying(false);
      }
    } else {
      const next = currentIndex + 1;
      if (next < playlist.length) {
        setCurrentIndex(next);
      } else if (repeatMode === "all") {
        setCurrentIndex(0);
      } else {
        setIsPlaying(false);
      }
    }
  }, [playlist, currentIndex, isShuffled, shuffleOrder, repeatMode, generateShuffleOrder]);

  const handlePrev = useCallback(() => {
    if (playlist.length === 0) return;

    // If more than 3 seconds in, restart current song
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    if (isShuffled && shuffleOrder.length > 0) {
      const currentShufflePos = shuffleOrder.indexOf(currentIndex);
      const prevShufflePos = currentShufflePos - 1;
      if (prevShufflePos >= 0) {
        setCurrentIndex(shuffleOrder[prevShufflePos]);
      }
    } else {
      const prev = currentIndex - 1;
      if (prev >= 0) {
        setCurrentIndex(prev);
      }
    }
  }, [playlist, currentIndex, audio, isShuffled, shuffleOrder]);

  const playSongAtIndex = useCallback(
    (index) => {
      if (index >= 0 && index < playlist.length) {
        setCurrentIndex(index);
        // Small delay to let src update, then play
        setTimeout(() => {
          audio.play().catch(() => {});
        }, 100);
      }
    },
    [playlist, audio]
  );

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => {
      if (!prev) {
        setShuffleOrder(generateShuffleOrder(currentIndex));
      }
      return !prev;
    });
  }, [currentIndex, generateShuffleOrder]);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "none") return "all";
      if (prev === "all") return "one";
      return "none";
    });
  }, []);

  return {
    // State
    currentIndex,
    currentSong: playlist[currentIndex] || null,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    // Actions
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    next: handleNext,
    prev: handlePrev,
    playSongAtIndex,
    toggleShuffle,
    cycleRepeat,
  };
}
