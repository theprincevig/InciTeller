import { Link } from "react-router-dom";
import { Archive, PenLine, Send, Trash2 } from "lucide-react";
import { StatusBadge, StoryCover } from "../common";
import { formatDate } from "../../utils/format.js";

export default function DashboardStoryCard({
  story,
  onTogglePublish,
  onDelete,
  publishing = false,
}) {
  const published = story.status === "published";

  return (
    <article className="glass card-lift flex flex-col overflow-hidden sm:flex-row">
      <div className="aspect-video border-b border-(--line) sm:aspect-auto sm:min-h-32 sm:w-48 sm:shrink-0 sm:border-b-0 sm:border-r">
        <StoryCover story={story} width={400} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={story.status} />
          <time dateTime={story.createdAt} className="text-sm text-(--text-secondary)">
            {formatDate(story.createdAt)}
          </time>
        </div>

        <h3 className="wrap-break-word font-display text-lg font-semibold leading-snug">
          <Link to={`/stories/${story._id}`} className="hover:underline">
            {story.title}
          </Link>
        </h3>

        <p className="line-clamp-2 wrap-break-word text-sm text-(--text-secondary)">
          {story.content}
        </p>

        <div className="mt-auto flex flex-wrap gap-2">
          <Link
            to={`/stories/${story._id}/edit`}
            aria-label={`Edit ${story.title}`}
            className="btn-secondary btn-sm"
          >
            <PenLine size={16} aria-hidden="true" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onTogglePublish(story)}
            disabled={publishing}
            aria-label={`${published ? "Unpublish" : "Publish"} ${story.title}`}
            className="btn-secondary btn-sm"
          >
            {published ? (
              <Archive size={16} aria-hidden="true" />
            ) : (
              <Send size={16} aria-hidden="true" />
            )}
            {publishing ? "Saving…" : published ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(story)}
            aria-label={`Delete ${story.title}`}
            className="btn-danger btn-sm"
          >
            <Trash2 size={16} aria-hidden="true" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}