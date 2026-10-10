import { optimize } from "../../utils/format.js";

export default function Avatar({ user, className = "h-8 w-8 text-sm" }) {
  if (user?.avatar) {
    return (
      <img
        src={optimize(user.avatar, 96)}
        alt=""
        className={`${className} avatar shrink-0 object-cover`}
      />
    );
  }
  const initial = (user?.name || "A")[0].toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`${className} avatar flex shrink-0 items-center justify-center bg-leaf font-bold text-ink`}
    >
      {initial}
    </span>
  );
}