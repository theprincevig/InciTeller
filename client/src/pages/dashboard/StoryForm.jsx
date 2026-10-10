import { useCallback, useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStoryStore } from "../../stores/useStoryStore.js";
import { useAuthStore } from "../../stores/useAuthStore.js";
import { ErrorState } from "../../components/common";
import {
  ImageInput,
  SelectInput,
  TextArea,
  TextInput,
} from "../../components/inputs";

const CONTENT_MAX = 2000; // must match the server's story validator

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft (only you can see it)" },
  { value: "published", label: "Published (everyone can read it)" },
];

// One component for both /stories/new and /stories/:storyId/edit
export default function StoryForm() {
  const { storyId } = useParams();
  const isEdit = Boolean(storyId);
  const navigate = useNavigate();

  const {
    getStory,
    createStory,
    updateStory,
    createLoading,
    updateLoading
  } = useStoryStore();
  const { authUser } = useAuthStore();

  const [original, setOriginal] = useState(null); // the saved story (edit mode)
  const [loadStatus, setLoadStatus] = useState(isEdit ? "loading" : "ready");
  const [loadError, setLoadError] = useState("");

  const [form, setForm] = useState({ title: "", content: "", status: "draft" });
  const [file, setFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState("");

  const saving = isEdit ? updateLoading : createLoading;

  const loadStory = useCallback(async () => {
    setLoadStatus("loading");
    setLoadError("");
    const result = await getStory(storyId);
    if (!result.success) {
      setLoadError(result.message);
      setLoadStatus("error");
      return;
    }
    const s = result.story;
    setOriginal(s);
    setForm({ title: s.title, content: s.content, status: s.status });
    setFile(null);
    setRemoveImage(false);
    setLoadStatus("ready");
  }, [getStory, storyId]);

  useEffect(() => {
    if (isEdit) loadStory();
  }, [isEdit, loadStory]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (picked) => {
    setFile(picked);
    if (picked) setRemoveImage(false); // a new file replaces the old one anyway
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setError("");

    const title = form.title.trim();
    const content = form.content.trim();
    const fd = new FormData(); // no Content-Type header: the browser adds the boundary

    if (!isEdit) {
      fd.append("title", title);
      fd.append("content", content);
      if (file) fd.append("contentImage", file);

      const result = await createStory(fd);
      if (result.success) navigate("/my-stories");
      else setError(result.message);
      return;
    }

    // Edit: send only what changed
    if (title !== original.title) fd.append("title", title);
    if (content !== original.content) fd.append("content", content);
    if (form.status !== original.status) fd.append("status", form.status);
    if (file) fd.append("contentImage", file);
    else if (removeImage) fd.append("removeImage", "true");

    if ([...fd.keys()].length === 0) {
      setError("You haven't changed anything.");
      return;
    }

    const result = await updateStory(storyId, fd);
    if (result.success) navigate("/my-stories");
    else setError(result.message);
  };

  // ---- Edit-mode load states ----
  if (isEdit && loadStatus === "error") {
    return (
      <ErrorState message={loadError} onRetry={loadStory}>
        <Link to="/my-stories" className="btn-secondary">
          Back to my stories
        </Link>
      </ErrorState>
    );
  }

  if (isEdit && loadStatus === "loading") {
    return (
      <div aria-busy="true" aria-label="Loading story" className="mx-auto max-w-2xl space-y-6">
        <div className="shimmer h-12" />
        <div className="shimmer h-48" />
      </div>
    );
  }

  // Cosmetic only. The server rejects edits to other people's stories (403/404).
  if (isEdit && original && authUser && original.author?._id !== authUser._id) {
    return (
      <ErrorState message="You can only edit your own stories.">
        <Link to="/" className="btn-secondary">
          Back to home
        </Link>
      </ErrorState>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-4xl font-bold">
          {isEdit ? "Edit story" : "Write a story"}
        </h1>
        <div className="mt-3 accent-bar" aria-hidden="true" />
        {!isEdit && (
          <p className="mt-4">
            New stories are saved as drafts. Publish them from My stories when
            you're ready.
          </p>
        )}
      </header>

      <TextInput
        label="Title"
        name="title"
        minLength={3}
        maxLength={120}
        value={form.title}
        onChange={handleChange}
        required
      />

      <TextArea
        label="Your story"
        name="content"
        maxLength={CONTENT_MAX}
        value={form.content}
        onChange={handleChange}
        hint="Funny, thrilling or embarrassing: spill it."
        required
      />

      <ImageInput
        label="Cover image (optional)"
        file={file}
        onChange={handleFile}
        currentUrl={removeImage ? "" : (original?.contentImage ?? "")}
        hint="PNG, JPG or WEBP, up to 5MB."
      />

      {isEdit && original?.contentImage && !file && (
        <label className="flex items-center gap-3 font-bold">
          <input
            type="checkbox"
            checked={removeImage}
            onChange={(e) => setRemoveImage(e.target.checked)}
            className="h-5 w-5 accent-rose"
          />
          Remove current cover image
        </label>
      )}

      {isEdit && (
        <SelectInput
          label="Visibility"
          name="status"
          options={STATUS_OPTIONS}
          value={form.status}
          onChange={handleChange}
        />
      )}

      {error && (
        <p role="alert" className="form-alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn-primary btn-auto">
          <Save size={18} aria-hidden="true" />
          {saving ? "Saving…" : isEdit ? "Save changes" : "Save as draft"}
        </button>
        <Link to="/my-stories" className="btn-secondary">
          <X size={18} aria-hidden="true" />
          Cancel
        </Link>
      </div>
    </form>
  );
}