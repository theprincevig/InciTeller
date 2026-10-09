const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "inciteller-cloudinary",
    allowed_formats: ["png", "jpg", "jpeg", "webp"],
    transformation: [{ width: 1600, crop: "limit" }],
  },
});

module.exports = { cloudinary, storage };
