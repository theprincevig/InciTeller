import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { optimize } from "../../utils/format.js";

const TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // same limit as the server

// Controlled by the parent: `file` is a File or null, `onChange(file | null)`.
// `currentUrl` shows the already-saved image when no new file is picked.
export default function ImageInput({
  label,
  file,
  onChange,
  currentUrl = "",
  error,
  hint,
  className = "",
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const inputRef = useRef(null);
  
  const [preview, setPreview] = useState("");
  const [localError, setLocalError] = useState("");

  // Local preview of the chosen file, released when it changes or unmounts
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Convenience checks only. The server (multer + Cloudinary) is the real gate.
  const handleChange = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;

    if (!TYPES.includes(picked.type)) {
      setLocalError("Only PNG, JPG or WEBP images are allowed");
      e.target.value = "";
      return;
    }
    if (picked.size > MAX_BYTES) {
      setLocalError("Image must be 5MB or smaller");
      e.target.value = "";
      return;
    }
    setLocalError("");
    onChange(picked);
  };

  const clearFile = () => {
    if (inputRef.current) inputRef.current.value = "";
    setLocalError("");
    onChange(null);
  };

  const shown = preview || optimize(currentUrl, 600);
  const message = localError || error;
  const describedBy =
    [hint && hintId, message && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>

      {shown && (
        <img
          src={shown}
          alt="Selected image preview"
          className="mb-3 max-h-56 w-full media-frame object-cover sm:w-auto"
        />
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        aria-invalid={message ? true : undefined}
        aria-describedby={describedBy}
        className="file-field"
      />

      {file && (
        <button
          type="button"
          onClick={clearFile}
          className="btn-secondary btn-sm mt-2"
        >
          <X size={16} aria-hidden="true" />
          Remove selected image
        </button>
      )}

      {hint && (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      )}
      {message && (
        <p id={errorId} role="alert" className="field-error">
          {message}
        </p>
      )}
    </div>
  );
}