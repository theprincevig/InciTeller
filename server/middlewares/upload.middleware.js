const multer = require("multer");
const { storage } = require("../configs/cloud.config.js");

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

module.exports.upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5MB, one file
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      const err = new Error("Only PNG, JPG or WEBP images are allowed");
      err.code = "INVALID_FILE_TYPE";
      return cb(err);
    }
    cb(null, true);
  },
});
