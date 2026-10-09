const express = require("express");
const {
  requireAuth,
  optionalAuth,
} = require("../middlewares/auth.middleware.js");
const story = require("../controllers/story.controller.js");
const asyncHandler = require("../utils/asyncHandler.js");
const { upload } = require("../middlewares/upload.middleware.js");

const router = express.Router();

router
  .route("/")
  .get(asyncHandler(story.list))
  .post(requireAuth, upload.single("contentImage"), asyncHandler(story.create));

router
  .route("/:storyId")
  .get(optionalAuth, asyncHandler(story.getOne))
  .patch(requireAuth, upload.single("contentImage"), asyncHandler(story.update))
  .delete(requireAuth, asyncHandler(story.remove));

router.get("/me", requireAuth, asyncHandler(story.mine));

module.exports = router;
