// Reuses the strict, folder-checked deleter from cloudinary.util.js.
const { destroyImage } = require("../utils/cloudinary.util.js");

// Copies allowed fields onto the user document. It does NOT save and does NOT
// delete anything. It returns the old avatar URLs that should be deleted
// after the save succeeds.
const applyProfileUpdates = (user, req) => {
  const { name, removeAvatar } = req.body;
  const staleImages = [];

  // Update basic fields
  if (name !== undefined) user.name = name;

  // Remove the current avatar without replacing it
  if (removeAvatar === "true" && user.avatar) {
    staleImages.push(user.avatar);
    user.avatar = "";
  }

  // New avatar uploaded
  if (req.file) {
    if (user.avatar) staleImages.push(user.avatar);
    user.avatar = req.file.path;
  }

  return staleImages;
};

const deleteImages = (urls) => Promise.all(urls.map(destroyImage));

// The upload runs BEFORE validation, so a rejected request must delete
// the file it already uploaded.
const discardUpload = (req) => destroyImage(req.file?.path);

module.exports = { applyProfileUpdates, deleteImages, discardUpload };
