export const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

// Asks Cloudinary for a smaller copy when rendering. The stored URL stays untouched.
// Only our own Cloudinary URLs are changed; anything else is returned as is.
export const optimize = (url, width) =>
  url &&
  url.startsWith("https://res.cloudinary.com/") &&
  url.includes("/upload/")
    ? url.replace("/upload/", `/upload/w_${width},c_limit,q_auto,f_auto/`)
    : url;
