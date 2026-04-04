const API_BASE = "http://localhost:8000";

/**
 * Fetch all songs from the backend
 * @param {string} [query] - Optional search query
 * @returns {Promise<Array>}
 */
export async function fetchSongs(query = "") {
  const url = query
    ? `${API_BASE}/api/songs?q=${encodeURIComponent(query)}`
    : `${API_BASE}/api/songs`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch songs: ${res.status}`);
  const songs = await res.json();
  // Resolve relative URLs to absolute
  return songs.map((s) => ({
    ...s,
    url: s.url?.startsWith("http") ? s.url : `${API_BASE}${s.url}`,
    artUrl: s.artUrl?.startsWith("http") ? s.artUrl : s.artUrl ? `${API_BASE}${s.artUrl}` : null,
  }));
}

/**
 * Upload a song file
 * @param {File} file
 * @param {string} [title]
 * @param {string} [artist]
 * @returns {Promise<Object>}
 */
export async function uploadSong(file, title, artist) {
  const formData = new FormData();
  formData.append("file", file);

  let url = `${API_BASE}/api/upload`;
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (artist) params.set("artist", artist);
  if (params.toString()) url += `?${params}`;

  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const song = await res.json();
  return {
    ...song,
    url: song.url?.startsWith("http") ? song.url : `${API_BASE}${song.url}`,
    artUrl: song.artUrl?.startsWith("http") ? song.artUrl : song.artUrl ? `${API_BASE}${song.artUrl}` : null,
  };
}

/**
 * Delete a song by ID
 * @param {string} songId
 * @returns {Promise<Object>}
 */
export async function deleteSong(songId) {
  const res = await fetch(`${API_BASE}/api/songs/${songId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
  return res.json();
}
