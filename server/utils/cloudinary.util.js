const { cloudinary } = require("../configs/cloud.config.js");

const FOLDER = "inciteller-cloudinary"; // must match the folder in the config

const PUBLIC_ID_REGEX = new RegExp(
  `/upload/(?:v\\d+/)?(${FOLDER}/[^/.]+)\\.[a-z0-9]+$`,
  "i",
);

// Returns null for anything that isn't one of our own uploaded images.
const getPublicId = (url) => {
  if (typeof url !== "string" || !url) return null;
  const match = url.match(PUBLIC_ID_REGEX);
  return match ? match[1] : null;
};

// Deletes the image behind a URL. Never throws: cleanup must not fail a request.
const destroyImage = async (url) => {
  try {
    const publicId = getPublicId(url);
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary cleanup failed:", err.message);
  }
};

module.exports = { getPublicId, destroyImage };
