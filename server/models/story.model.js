const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const storySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    contentImage: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true },
);

storySchema.index({ status: 1, createdAt: -1 }); // public feed
storySchema.index({ owner: 1, createdAt: -1 }); // my content

module.exports = mongoose.models.Story || mongoose.model("Story", storySchema);
