const express = require("express");
const { requireAuth } = require("../middlewares/auth.middleware.js");
const auth = require("../controllers/auth.controller.js");
const asyncHandler = require("../utils/asyncHandler.js");

const router = express.Router();

router.post("/register", asyncHandler(auth.register));

router.post("/login", asyncHandler(auth.login));

router.get("/session", requireAuth, asyncHandler(auth.session));

router.delete("/logout", requireAuth, asyncHandler(auth.logout));

module.exports = router;
