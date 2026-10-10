const bcrypt = require("bcryptjs");
const User = require("../models/user.model.js");
const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validator.js");

const COOKIE_NAME = "incitellerSid"; // must match session.config.js
const BCRYPT_COST = 12;

// Used when the email doesn't exist, so login takes about the same time either way.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_COST);

const SAFE_USER = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
});

const FAIL = (res, status, message) =>
  res.status(status).json({ success: false, message });

// New session ID (blocks session fixation), then store only the user id.
const START_SESSION = async (req, userId) => {
  await new Promise((resolve, reject) =>
    req.session.regenerate((err) => (err ? reject(err) : resolve())),
  );
  req.session.userId = userId.toString();
  await new Promise((resolve, reject) =>
    req.session.save((err) => (err ? reject(err) : resolve())),
  );
};

module.exports.session = async (req, res) => {
  res.status(200).json({
    success: true,
    user: SAFE_USER(req.user),
  });
};

module.exports.register = async (req, res) => {
  const parsed = registerSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    return FAIL(res, 400, parsed.error.issues[0].message);
  }

  const { email, password } = parsed.data;
  const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

  let user;
  try {
    user = await User.create({
      email,
      password: hashedPassword,
    });
  } catch (err) {
    if (err.code === 11000) {
      return FAIL(res, 409, "Email is already registered");
    }
    throw err; // anything else goes to the central error handler
  }

  await START_SESSION(req, user._id);
  res.status(201).json({
    success: true,
    message: "Registered successfully!",
    user: SAFE_USER(user),
  });
};

module.exports.login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body ?? {});
  if (!parsed.success) return FAIL(res, 400, parsed.error.issues[0].message);

  const { email, password } = parsed.data;
  const user = await User.findOne({ email }).select("+password");

  // Always run one bcrypt comparison, even for unknown emails.
  const matches = await bcrypt.compare(
    password,
    user ? user.password : DUMMY_HASH,
  );
  if (!user || !matches) return FAIL(res, 401, "Invalid email or password");

  await START_SESSION(req, user._id);
  res.status(200).json({
    success: true,
    message: "Logged-in successfully!",
    user: SAFE_USER(user),
  });
};

module.exports.logout = async (req, res) => {
  await new Promise((resolve, reject) =>
    req.session.destroy((err) => (err ? reject(err) : resolve())),
  );
  res.clearCookie(COOKIE_NAME);
  res.status(200).json({ success: true, message: "Logged out successfully!" });
};
