const User = require("../models/user.model.js");
const {
  discardUpload,
  applyProfileUpdates,
  deleteImages,
} = require("../helpers/profile.helper.js");
const { updateProfileSchema } = require("../validators/profile.validator.js");

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

const toProfile = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  createdAt: user.createdAt,
});

module.exports.view = async (req, res) => {
  // The user id comes from the session, never from the URL or body.
  const user = await User.findById(req.user._id);
  if (!user) return fail(res, 404, "User not found");

  res.status(200).json({ success: true, user: toProfile(user) });
};

module.exports.update = async (req, res) => {
  const parsed = updateProfileSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    await discardUpload(req);
    return fail(res, 400, parsed.error.issues[0].message);
  }

  // from here on, the helper only sees validated fields
  req.body = parsed.data;

  let user;
  let staleImages;
  try {
    const userId = req.user._id;

    user = await User.findById(userId);
    if (!user) {
      await discardUpload(req);
      return fail(res, 404, "User not found");
    }

    staleImages = applyProfileUpdates(user, req);

    if (!user.isModified()) {
      await discardUpload(req);
      return fail(res, 400, "Nothing to update");
    }

    await user.save();
  } catch (err) {
    await discardUpload(req); // DB failure: don't orphan the new image
    throw err;
  }

  await deleteImages(staleImages); // only after the save succeeded
  res.status(200).json({ success: true, user: toProfile(user) });
};
