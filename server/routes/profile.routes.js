const express = require("express");
const { requireAuth } = require("../middlewares/auth.middleware.js");
const profile = require("../controllers/profile.controller.js");
const asyncHandler = require("../utils/asyncHandler.js");
const { upload } = require("../middlewares/upload.middleware.js");

const router = express.Router();

router
  .route("/me")
  .post(requireAuth, asyncHandler(profile.view))
  .patch(requireAuth, upload.single("avatar"), asyncHandler(profile.update));

module.exports = router;
