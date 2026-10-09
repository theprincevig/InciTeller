const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
      default: "Anonymous",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // creates a unique index; see note below
      lowercase: true, // normalizes "A@x.com" and "a@x.com" to one value
      trim: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      select: false, // excluded from query results unless you ask for it
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }, // gives you createdAt and updatedAt
);

// Safety net: even if a user document is serialized by accident,
// the hash and internal version key never reach the response.
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
