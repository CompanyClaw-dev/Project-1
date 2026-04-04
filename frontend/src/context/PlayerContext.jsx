import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAudio } from "../hooks/useAudio";
import { fetchSongs, uploadSong, deleteSong } from "../services/api";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const audio = useAudio(playlist);

  // Load songs from API
  const loadSongs = useCallback(async (query = "") => {
    try {
      setLoading(true);
      setError(null);
      const songs = await fetchSongs(query);
      setPlaylist(songs);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load songs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadSongs(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, loadSongs]);

  // Upload handler
  const handleUpload = useCallback(
    async (file, title, artist) => {
      try {
        const newSong = await uploadSong(file, title, artist);
        // Refresh playlist
        await loadSongs(searchQuery);
        return newSong;
      } catch (err) {
        console.error("Upload failed:", err);
        throw err;
      }
    },
    [loadSongs, searchQuery]
  );

  // Delete handler
  const handleDelete = useCallback(
    async (songId) => {
      try {
        await deleteSong(songId);
        await loadSongs(searchQuery);
      } catch (err) {
        console.error("Delete failed:", err);
        throw err;
      }
    },
    [loadSongs, searchQuery]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture if user is typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          audio.togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          audio.next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          audio.prev();
          break;
        case "ArrowUp":
          e.preventDefault();
          audio.setVolume(audio.volume + 0.05);
          break;
        case "ArrowDown":
          e.preventDefault();
          audio.setVolume(audio.volume - 0.05);
          break;
        case "KeyM":
          e.preventDefault();
          audio.toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [audio]);

  // Save/restore last played song index
  useEffect(() => {
    if (playlist.length > 0) {
      const savedIndex = localStorage.getItem("player_lastIndex");
      if (savedIndex !== null) {
        const idx = parseInt(savedIndex, 10);
        if (idx >= 0 && idx < playlist.length) {
          audio.playSongAtIndex(idx);
        }
      }
    }
    // Only run once when playlist first loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist.length > 0]);

  useEffect(() => {
    localStorage.setItem("player_lastIndex", audio.currentIndex.toString());
  }, [audio.currentIndex]);

  const value = {
    ...audio,
    playlist,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    uploadSong: handleUpload,
    deleteSong: handleDelete,
    refreshSongs: () => loadSongs(searchQuery),
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
