import { useState, useRef, useCallback } from "react";
import { usePlayer } from "../context/PlayerContext";

export default function UploadModal({ isOpen, onClose }) {
  const { uploadSong } = usePlayer();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const reset = () => {
    setFile(null);
    setTitle("");
    setArtist("");
    setError(null);
    setDragActive(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }
    try {
      setUploading(true);
      setError(null);
      await uploadSong(file, title || undefined, artist || undefined);
      handleClose();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" id="upload-modal-overlay" onClick={handleClose}>
      <div
        className="modal"
        id="upload-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2>Upload Song</h2>
          <button
            className="modal__close"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <form className="modal__body" onSubmit={handleSubmit}>
          {/* Drop zone */}
          <div
            className={`upload-zone ${dragActive ? "upload-zone--active" : ""} ${file ? "upload-zone--has-file" : ""}`}
            id="upload-zone"
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp3,.wav,.ogg,.m4a,.flac,.webm"
              onChange={handleFileInput}
              className="upload-zone__input"
              id="file-input"
            />
            {file ? (
              <div className="upload-zone__file">
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
                <span>{file.name}</span>
                <span className="upload-zone__size">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </span>
              </div>
            ) : (
              <div className="upload-zone__prompt">
                <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                  <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                </svg>
                <p>Drag & drop or click to select</p>
                <span>MP3, WAV, OGG, M4A, FLAC</span>
              </div>
            )}
          </div>

          {/* Metadata fields */}
          <div className="modal__fields">
            <div className="modal__field">
              <label htmlFor="upload-title">Title (optional)</label>
              <input
                id="upload-title"
                type="text"
                placeholder="Song title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="modal__field">
              <label htmlFor="upload-artist">Artist (optional)</label>
              <input
                id="upload-artist"
                type="text"
                placeholder="Artist name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="modal__error" id="upload-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="modal__submit"
            id="btn-upload-submit"
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
