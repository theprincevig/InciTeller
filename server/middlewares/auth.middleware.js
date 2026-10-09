const User = require("../models/user.model");

// Reads the session, loads the user, returns the user or null.
async function loadSessionUser(req) {
  const userId = req.session?.userId;
  if (!userId) return null;

  const user = await User.findById(userId).select("_id name email avatar");

  if (!user) {
    // Session points to a deleted account: kill the stale session.
    await new Promise((resolve) => req.session.destroy(resolve));
    return null;
  }
  return user;
}

module.exports.requireAuth = async (req, res, next) => {
  try {
    const user = await loadSessionUser(req);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Please login to continue" });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.optionalAuth = async (req, res, next) => {
  try {
    req.user = await loadSessionUser(req); // user or null
    next();
  } catch (err) {
    next(err);
  }
};
