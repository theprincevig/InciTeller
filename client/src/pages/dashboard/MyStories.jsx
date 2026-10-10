import { useCallback, useEffect, useState } from "react";
import { PenLine } from "lucide-react";
import { Link } from "react-router-dom";
import { useStoryStore } from "../../stores/useStoryStore.js";
import { DashboardStoryCard } from "../../components/cards";
import { ErrorState } from "../../components/common";
import { ConfirmModal } from "../../components/modals";

export default function MyStories() {
  const {
    myStories,
    getMyStories,
    updateStory,
    removeStory,
    removeLoading
  } = useStoryStore();

  // Local status, so another account's stale list never flashes before the fetch ends
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [publishingId, setPublishingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    const result = await getMyStories();
    if (result.success) {
      setStatus("ready");
    } else {
      setErrorMessage(result.message);
      setStatus("error");
    }
  }, [getMyStories]);

  useEffect(() => {
    load();
  }, [load]);

  const handleTogglePublish = async (story) => {
    setActionError("");
    setPublishingId(story._id);
    const next = story.status === "published" ? "draft" : "published";
    const result = await updateStory(story._id, { status: next });
    if (!result.success) setActionError(result.message);
    setPublishingId(null);
  };

  const closeDelete = () => {
    if (removeLoading) return;
    setPendingDelete(null);
    setDeleteError("");
  };

  const handleConfirmDelete = async () => {
    setDeleteError("");
    const result = await removeStory(pendingDelete._id);
    if (result.success) setPendingDelete(null);
    else setDeleteError(result.message);
  };

  return (
    <>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold">My stories</h1>
          <div className="mt-3 accent-bar" aria-hidden="true" />
        </div>
        <Link to="/stories/new" className="btn-primary btn-auto">
          <PenLine size={18} aria-hidden="true" />
          Write a story
        </Link>
      </header>

      {actionError && (
        <p role="alert" className="form-alert mb-6">
          {actionError}
        </p>
      )}

      {status === "error" ? (
        <ErrorState message={errorMessage} onRetry={load} />
      ) : status === "loading" ? (
        <div aria-busy="true" aria-label="Loading your stories" className="space-y-6">
          {[0, 1, 2].map((n) => (
            <div key={n} className="shimmer h-36" />
          ))}
        </div>
      ) : myStories.length === 0 ? (
        <div className="glass state-box">
          <h2 className="font-display text-2xl font-bold">No stories yet</h2>
          <p className="mt-2">Your drafts and published stories will show up here.</p>
          <Link to="/stories/new" className="btn-primary btn-auto mt-5">
            <PenLine size={18} aria-hidden="true" />
            Write your first story
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {myStories.map((story) => (
            <DashboardStoryCard
              key={story._id}
              story={story}
              publishing={publishingId === story._id}
              onTogglePublish={handleTogglePublish}
              onDelete={setPendingDelete}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete this story?"
        message={`“${pendingDelete?.title}” and its cover image will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete story"
        loading={removeLoading}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={closeDelete}
      />
    </>
  );
}