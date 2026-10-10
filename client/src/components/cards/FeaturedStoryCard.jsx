import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Avatar, StoryCover } from "../common";
import { formatDate } from "../../utils/format.js";

export default function FeaturedStoryCard({ story }) {
  return (
    <Link
      to={`/stories/${story._id}`}
      data-accent="1"
      className="glass story-card group grid overflow-hidden md:grid-cols-2"
    >
      <div className="aspect-4/3 md:aspect-auto md:min-h-90">
        <StoryCover story={story} width={1000} eager />
      </div>

      <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
        <span className="badge badge-rose w-fit">Latest story</span>
        <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
          {story.title}
        </h2>
        <p className="line-clamp-4 leading-relaxed text-(--text-secondary)">
          {story.content}
        </p>

        <div className="flex items-center gap-3 text-sm text-(--text-secondary)">
          <Avatar user={story.author} className="h-9 w-9" />
          <span className="font-medium text-(--text-primary)">
            {story.author?.name ?? "Anonymous"}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={story.createdAt}>{formatDate(story.createdAt)}</time>
        </div>

        <span className="inline-flex items-center gap-2 font-medium text-rose group-hover:underline">
          Read the story
          <ArrowRight size={18} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}