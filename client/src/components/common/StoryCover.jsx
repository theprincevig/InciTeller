import { optimize } from "../../utils/format.js";

const BG = ["bg-sun", "bg-mint", "bg-rose text-white", "bg-leaf"];

// Stable color per story, so a story keeps the same placeholder every time.
const pick = (id = "") =>
  BG[[...id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % BG.length];

export default function StoryCover({ story, width = 800, eager = false }) {
  const src = optimize(story.contentImage, width);

  if (src) {
    return (
      <img
        src={src}
        alt="" // decorative: the title is right next to it
        loading={eager ? "eager" : "lazy"}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center font-display text-7xl font-bold text-ink ${pick(story._id)}`}
    >
      {story.title?.[0]?.toUpperCase()}
    </div>
  );
}