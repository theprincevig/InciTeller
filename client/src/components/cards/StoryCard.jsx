import { Link } from "react-router-dom";
import { Avatar, StoryCover } from "../common";
import { formatDate } from "../../utils/format.js";

export default function StoryCard({ story, index = 0 }) {
  return (
    <Link
      to={`/stories/${story._id}`}
      data-accent={index % 4}
      className="glass story-card flex flex-col overflow-hidden"
    >
      <div className="aspect-16/10 border-b border-(--line)">
        <StoryCover story={story} width={600} />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-semibold leading-snug">
          {story.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-(--text-secondary)">
          {story.content}
        </p>
        <div className="flex items-center gap-2 text-xs text-(--text-secondary)">
          <Avatar user={story.author} className="h-7 w-7" />
          <span className="font-medium text-(--text-primary)">
            {story.author?.name ?? "Anonymous"}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={story.createdAt}>{formatDate(story.createdAt)}</time>
        </div>
      </div>
    </Link>
  );
}