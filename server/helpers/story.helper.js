// Reuses the strict, folder-checked deleter from cloudinary.util.js,
// so you don't keep two copies of the "URL to public ID" logic.
const { destroyImage } = require("../utils/cloudinary.util.js");

// Copies allowed fields onto the document. It does NOT save and does NOT
// delete anything. It returns the old image URLs that should be deleted
// after the save succeeds.
const applyStoryUpdates = (story, req) => {
  const { title, content, status, removeImage } = req.body;
  const staleImages = [];

  // Update basic fields
  if (title !== undefined) story.title = title;
  if (content !== undefined) story.content = content;
  if (status !== undefined) story.status = status;

  // Remove the current image without replacing it
  if (removeImage === "true" && story.contentImage) {
    staleImages.push(story.contentImage);
    story.contentImage = "";
  }

  // New image uploaded
  if (req.file) {
    if (story.contentImage) staleImages.push(story.contentImage);
    story.contentImage = req.file.path;
  }

  return staleImages;
};

const deleteImages = (urls) => Promise.all(urls.map(destroyImage));

const deleteStoryImage = (story) => destroyImage(story.contentImage);

// The upload runs BEFORE validation and ownership checks, so a rejected
// request must delete the file it already uploaded.
const discardUpload = (req) => destroyImage(req.file?.path);

module.exports = {
  applyStoryUpdates,
  deleteImages,
  deleteStoryImage,
  discardUpload,
};
