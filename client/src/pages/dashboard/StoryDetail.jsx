import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, PenLine, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStoryStore } from "../../stores/useStoryStore.js";
import { useAuthStore } from "../../stores/useAuthStore.js";
import { Avatar, ErrorState, StatusBadge } from "../../components/common";
import { ConfirmModal } from "../../components/modals";
import { formatDate, optimize } from "../../utils/format.js";

export default function StoryDetail() {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const {
    story,
    getStory,
    removeStory,
    removeLoading
  } = useStoryStore();
  const { authUser } = useAuthStore();

  // Local status, so a story left in the store by an earlier visit or another
  // account is never shown before THIS visit's fetch finishes.
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    const result = await getStory(storyId);
    if (result.success) {
      setStatus("ready");
    } else {
      setErrorMessage(result.message);
      setStatus("error");
    }
  }, [getStory, storyId]);

  useEffect(() => {
    load();
  }, [load]);

  const current = status === "ready" && story?._id === storyId ? story : null;
  const isAuthor = Boolean(
    authUser && current?.author && authUser._id === current.author._id,
  );

  const closeConfirm = () => {
    if (removeLoading) return;
    setConfirmOpen(false);
    setDeleteError("");
  };

  const handleDelete = async () => {
    setDeleteError("");
    const result = await removeStory(storyId);
    if (result.success) {
      setConfirmOpen(false);
      navigate("/my-stories");
    } else {
      setDeleteError(result.message);
    }
  };

  if (status === "error") {
    return (
      <ErrorState message={errorMessage} onRetry={load}>
        <Link to="/" className="btn-secondary">
          Back to home
        </Link>
      </ErrorState>
    );
  }

  if (!current) {
    return (
      <div aria-busy="true" aria-label="Loading story" className="mx-auto max-w-3xl">
        <div className="shimmer h-64" />
        <div className="mt-8 shimmer h-10 w-2/3" />
        <div className="mt-6 shimmer h-40" />
      </div>
    );
  }

  return (
    <>
      <article className="mx-auto max-w-3xl">
        <Link to="/" className="mb-6 inline-flex items-center font-bold hover:underline">
          <ArrowLeft size={18} className="mr-2" aria-hidden="true" />
          All stories
        </Link>

        {current.contentImage && (
          <img
            src={optimize(current.contentImage, 1200)}
            alt={`Cover for ${current.title}`}
            className="mb-8 max-h-112 w-full media-frame object-cover"
          />
        )}

        {current.status === "draft" && (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <StatusBadge status="draft" />
            <span className="text-sm">Only you can see this draft.</span>
          </div>
        )}

        <h1 className="wrap-break-word font-display text-4xl font-bold leading-tight sm:text-5xl">
          {current.title}
        </h1>

        <div className="mt-5 flex items-center gap-3">
          <Avatar user={current.author} className="h-10 w-10" />
          <span className="font-bold">{current.author?.name ?? "Anonymous"}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={current.createdAt}>{formatDate(current.createdAt)}</time>
        </div>

        <div className="accent-bar my-6" aria-hidden="true" />

        {/* Plain text. React escapes it, and whitespace-pre-line keeps line breaks. */}
        <div className="whitespace-pre-line wrap-break-word text-lg leading-relaxed">
          {current.content}
        </div>

        {isAuthor && (
          <div className="mt-10 flex flex-wrap gap-3 border-t border-(--line) pt-6">
            <Link to={`/stories/${current._id}/edit`} className="btn-secondary">
              <PenLine size={18} aria-hidden="true" />
              Edit story
            </Link>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="btn-danger"
            >
              <Trash2 size={18} aria-hidden="true" />
              Delete story
            </button>
          </div>
        )}
      </article>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this story?"
        message={`“${current.title}” and its cover image will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete story"
        loading={removeLoading}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={closeConfirm}
      />
    </>
  );
}