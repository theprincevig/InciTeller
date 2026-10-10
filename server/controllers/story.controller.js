const Story = require("../models/story.model.js");
const {
  discardUpload,
  applyStoryUpdates,
  deleteImages,
  deleteStoryImage,
} = require("../helpers/story.helper.js");
const {
  createStorySchema,
  updateStorySchema,
} = require("../validators/story.validator.js");

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

const toInt = (value, fallback) => {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
};

// Load an story the logged-in user may modify, or respond with the right error.
// Returns null if it already responded.
const loadOwned = async (req, res) => {
  const { storyId } = req.params;
  const userId = req.user._id;

  const story = await Story.findById(storyId);
  if (!story) {
    fail(res, 404, "Story not found");
    return null;
  }
  if (String(story.author) !== String(userId)) {
    // Published = visible to everyone, so 403. Draft = don't reveal it exists.
    story.status === "published"
      ? fail(res, 403, "You can only modify your own stories")
      : fail(res, 404, "Story not found");
    return null;
  }
  return story;
};

module.exports.list = async (req, res) => {
  const page = Math.max(1, toInt(req.query.page, 1));
  const limit = Math.min(50, Math.max(1, toInt(req.query.limit, 12)));
  const filter = { status: "published" };

  const [stories, total] = await Promise.all([
    Story.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name avatar"),
    Story.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    stories,
    page,
    limit,
    total,
  });
};

module.exports.getOne = async (req, res) => {
  const { storyId } = req.params;

  const story = await Story.findById(storyId).populate("author", "name avatar");
  const isAuthor =
    req.user && story && String(story.author._id) === String(req.user._id);

  if (!story || (story.status !== "published" && !isAuthor)) {
    return fail(res, 404, "Story not found");
  }
  res.status(200).json({ success: true, story });
};

module.exports.create = async (req, res) => {
  const userId = req.user._id;

  const parsed = createStorySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    await discardUpload(req);
    return fail(res, 400, parsed.error.issues[0].message);
  }

  let story;
  try {
    story = await Story.create({
      ...parsed.data,
      contentImage: req.file?.path ?? "", // URL comes only from the upload
      author: userId, // owner comes only from the session
    });
  } catch (err) {
    await discardUpload(req); // DB failed, so don't orphan the image
    throw err;
  }

  res.status(201).json({ success: true, story });
};

module.exports.update = async (req, res) => {
  const parsed = updateStorySchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    await discardUpload(req);
    return fail(res, 400, parsed.error.issues[0].message);
  }

  if (Object.keys(parsed.data).length === 0 && !req.file) {
    return fail(res, 400, "Nothing to update");
  }

  // from here on, the helper only sees validated fields
  req.body = parsed.data;

  let story;
  let staleImages;
  try {
    story = await loadOwned(req, res);
    if (!story) {
      await discardUpload(req); // not found / not the owner: throw the upload away
      return;
    }

    staleImages = applyStoryUpdates(story, req);
    if (!story.isModified()) return fail(res, 400, "Nothing to update");

    await story.save();
  } catch (err) {
    await discardUpload(req); // bad ID or DB failure
    throw err;
  }

  await deleteImages(staleImages); // only after the save succeeded
  res.status(200).json({ success: true, story });
};

module.exports.remove = async (req, res) => {
  const story = await loadOwned(req, res);
  if (!story) return;

  // TODO (Stories step): also delete this experience's stories here (cascade).
  await story.deleteOne();
  await deleteStoryImage(story);

  res.status(200).json({
    success: true,
    data: null,
    message: "Story deleted successfully!",
  });
};

module.exports.mine = async (req, res) => {
  const userId = req.user._id;

  // The author id comes from the session, never from the URL or body.
  const stories = await Story.find({ author: userId })
    .sort({ createdAt: -1 })
    .limit(100); // safety cap so one account can't return an unbounded list

  res.status(200).json({ success: true, stories });
};
