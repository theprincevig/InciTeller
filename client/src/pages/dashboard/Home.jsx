import { useEffect, useState } from "react";
import { ArrowDown, LoaderCircle, PenLine, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

import { useStoryStore } from "../../stores/useStoryStore.js";
import { useAuthStore } from "../../stores/useAuthStore.js";
import { FeaturedStoryCard, StoryCard } from "../../components/cards";
import { ErrorState } from "../../components/common";
// import AppLayout from "../../components/layouts/AppLayout.jsx";

export default function Home() {
  const { stories, page, hasMore, listLoading, getStories } = useStoryStore();
  const { authUser } = useAuthStore();

  const [error, setError] = useState("");

  const loadPage = async (nextPage) => {
    setError("");
    const result = await getStories({ page: nextPage, limit: 12 });
    // "Already loading" is the store's double-click guard, not a real error.
    if (!result.success && result.message !== "Already loading") {
      setError(result.message);
    }
  };

  useEffect(() => {
    loadPage(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [latest, ...rest] = stories;

  return (
    <>
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          Fresh from the chaos
        </h1>
        <p className="mt-3 max-w-xl text-lg">
          Funny, thrilling and downright embarrassing stories, told by the
          people who lived them.
        </p>
        <div className="mt-5 accent-bar" aria-hidden="true" />
      </header>

      {stories.length > 0 ? (
        <>
          <FeaturedStoryCard story={latest} />

          {rest.length > 0 && (
            <section aria-labelledby="more-heading" className="mt-14">
              <h2
                id="more-heading"
                className="mb-6 inline-block border-b-4 border-sun pb-1 font-display text-2xl font-bold"
              >
                More stories
              </h2>
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {rest.map((story, i) => (
                  <StoryCard key={story._id} story={story} index={i} />
                ))}
              </div>
            </section>
          )}

          <div className="mt-12 text-center">
            {error && (
              <p role="alert" className="mb-4 font-bold text-rose">
                {error}
              </p>
            )}
            {hasMore && (
              <button
                type="button"
                onClick={() => loadPage(page + 1)}
                disabled={listLoading}
                className="btn-primary btn-auto"
              >
                {listLoading ? (
                  <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
                ) : (
                  <ArrowDown size={18} aria-hidden="true" />
                )}
                {listLoading ? "Loading…" : "Load more stories"}
              </button>
            )}
          </div>
        </>
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadPage(1)} />
      ) : page >= 1 ? (
        <div className="glass state-box">
          <h2 className="font-display text-2xl font-bold">No stories yet</h2>
          <p className="mt-2">Be the first to spill the chaos.</p>
          <Link
            to={authUser ? "/stories/new" : "/signup"}
            className="btn-primary btn-auto mt-5"
          >
            {authUser ? (
              <PenLine size={18} aria-hidden="true" />
            ) : (
              <UserPlus size={18} aria-hidden="true" />
            )}
            {authUser ? "Write a story" : "Sign up to write"}
          </Link>
        </div>
      ) : (
        <div aria-busy="true" aria-label="Loading stories">
          <div className="shimmer h-80" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((n) => (
              <div key={n} className="shimmer h-64" />
            ))}
          </div>
        </div>
      )}
    </>
  );
}